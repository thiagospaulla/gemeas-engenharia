import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/documents - Listar documentos com filtros
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')
    const budgetId = searchParams.get('budgetId')
    const teamMemberId = searchParams.get('teamMemberId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}

    // Filtros de vinculação
    if (projectId) where.projectId = projectId
    if (userId) where.userId = userId
    if (budgetId) where.budgetId = budgetId
    if (teamMemberId) where.teamMemberId = teamMemberId
    if (category) where.category = category

    // Busca por título ou descrição
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Se não for admin, só pode ver documentos próprios ou de seus projetos
    if (user.role !== 'ADMIN') {
      where.OR = [
        { uploadedById: user.id },
        { userId: user.id },
        { project: { clientId: user.id } },
      ]
    }

    const documents = await prisma.document.findMany({
      where,
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
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Criar/Upload documento
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const data = await request.json()

    // Validações
    if (!data.title || !data.fileName || !data.fileUrl || !data.category) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar permissões baseado na entidade vinculada
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId }
      })

      if (!project) {
        return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
      }

      if (user.role !== 'ADMIN' && project.clientId !== user.id) {
        return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
      }
    }

    if (data.userId && user.role !== 'ADMIN' && data.userId !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    if ((data.budgetId || data.teamMemberId) && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const document = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description || null,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize || 0,
        fileType: data.fileType || 'application/octet-stream',
        category: data.category,
        tags: data.tags || [],
        projectId: data.projectId || null,
        userId: data.userId || null,
        budgetId: data.budgetId || null,
        teamMemberId: data.teamMemberId || null,
        uploadedById: user.id
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
        },
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        budget: {
          select: {
            id: true,
            title: true,
          }
        },
        teamMember: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('Create document error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
}
