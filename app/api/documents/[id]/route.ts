import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/documents/[id] - Buscar documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            clientId: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        budget: {
          select: {
            id: true,
            title: true,
            status: true,
          }
        },
        teamMember: {
          select: {
            id: true,
            name: true,
            role: true,
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    // Verificar permissões
    if (user.role !== 'ADMIN') {
      const hasAccess = 
        document.uploadedById === user.id ||
        document.userId === user.id ||
        (document.project && document.project.clientId === user.id)

      if (!hasAccess) {
        return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
      }
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar documento' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/[id] - Atualizar documento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        project: true
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    // Verificar permissões
    if (user.role !== 'ADMIN' && document.uploadedById !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const data = await request.json()

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json({ document: updatedDocument })
  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Deletar documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id: id }
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    }

    // Verificar permissões
    if (user.role !== 'ADMIN' && document.uploadedById !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    await prisma.document.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Documento excluído com sucesso' })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    )
  }
}
