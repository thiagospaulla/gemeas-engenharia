import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { sendAppointmentNotification } from '@/lib/notifications'

// Listar agendamentos
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const where: any = {}
    
    // Admin pode ver todos, cliente só pode ver os seus
    if (authResult.role !== 'ADMIN') {
      where.clientId = authResult.id
    } else if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      
      where.startTime = {
        gte: startDate,
        lte: endDate
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    )
  }
}

// Criar agendamento
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const data = await request.json()

    // Cliente pode criar seus próprios agendamentos, admin pode criar para qualquer um
    const clientId = authResult.role === 'ADMIN' ? data.clientId : authResult.id

    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status || 'AGENDADO',
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        location: data.location,
        notes: data.notes,
        clientId,
        projectId: data.projectId
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

    // Criar notificação no sistema
    await prisma.notification.create({
      data: {
        userId: clientId,
        title: '📅 Novo Agendamento',
        message: `${data.type} agendado: ${data.title}`,
        type: 'info',
        link: `/client/appointments/${appointment.id}`
      }
    })

    // Enviar notificações externas (Email + WhatsApp) se solicitado
    if (data.sendNotifications !== false) {
      try {
        await sendAppointmentNotification(appointment, 'confirmation')
      } catch (error) {
        console.error('Erro ao enviar notificações externas:', error)
        // Não falhar a criação do agendamento por causa de notificação
      }
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    )
  }
}
