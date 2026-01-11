import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// Obter agendamento específico
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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (authResult.role !== 'ADMIN' && appointment.clientId !== authResult.id) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar este agendamento' },
        { status: 403 }
      )
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Get appointment error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar agendamento' },
      { status: 500 }
    )
  }
}

// Atualizar agendamento
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

    const data = await request.json()

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (
      authResult.role !== 'ADMIN' &&
      existingAppointment.clientId !== authResult.id
    ) {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar este agendamento' },
        { status: 403 }
      )
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        location: data.location,
        notes: data.notes
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // Notificar sobre mudança de status
    if (data.status && data.status !== existingAppointment.status) {
      const statusMessages: any = {
        CONFIRMADO: '✅ Agendamento confirmado!',
        CONCLUIDO: '✅ Agendamento concluído!',
        CANCELADO: '❌ Agendamento cancelado'
      }

      if (statusMessages[data.status]) {
        await prisma.notification.create({
          data: {
            userId: appointment.clientId,
            title: 'Status do Agendamento Atualizado',
            message: `${appointment.title}: ${statusMessages[data.status]}`,
            type: data.status === 'CANCELADO' ? 'warning' : 'success'
          }
        })
      }
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento' },
      { status: 500 }
    )
  }
}

// Deletar agendamento
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

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (
      authResult.role !== 'ADMIN' &&
      appointment.clientId !== authResult.id
    ) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este agendamento' },
        { status: 403 }
      )
    }

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Agendamento deletado com sucesso' })
  } catch (error) {
    console.error('Delete appointment error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar agendamento' },
      { status: 500 }
    )
  }
}
