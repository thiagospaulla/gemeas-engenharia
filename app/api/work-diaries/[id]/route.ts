import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Obter diário específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const workDiary = await prisma.workDiary.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            clientId: true,
            client: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!workDiary) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (
      authResult.role !== 'ADMIN' &&
      workDiary.project?.clientId !== authResult.id
    ) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este registro' },
        { status: 403 }
      )
    }

    return NextResponse.json({ workDiary })
  } catch (error) {
    console.error('Get work diary error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar registro' },
      { status: 500 }
    )
  }
}

// Atualizar diário
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode atualizar
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem atualizar registros' },
        { status: 403 }
      )
    }

    const data = await request.json()

    const workDiary = await prisma.workDiary.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        weather: data.weather,
        temperature: data.temperature,
        workersPresent: data.workersPresent,
        activities: data.activities,
        materials: data.materials,
        equipment: data.equipment,
        observations: data.observations,
        photos: data.photos || []
      },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({ workDiary })
  } catch (error) {
    console.error('Update work diary error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar registro' },
      { status: 500 }
    )
  }
}

// Deletar diário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Apenas admin pode deletar
    if (authResult.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar registros' },
        { status: 403 }
      )
    }

    await prisma.workDiary.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Registro deletado com sucesso' })
  } catch (error) {
    console.error('Delete work diary error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar registro' },
      { status: 500 }
    )
  }
}
