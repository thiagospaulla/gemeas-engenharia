import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/team/[id] - Buscar membro específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
      include: {
        projectAssignments: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                status: true,
                type: true,
                address: true,
                city: true,
                state: true,
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          }
        }
      }
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Erro ao buscar membro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar membro' },
      { status: 500 }
    )
  }
}

// PUT /api/team/[id] - Atualizar membro
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Verificar se o membro existe
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      )
    }

    // Verificar CPF duplicado (se alterado)
    if (body.cpf && body.cpf !== existingMember.cpf) {
      const cpfExists = await prisma.teamMember.findUnique({
        where: { cpf: body.cpf }
      })

      if (cpfExists) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Verificar email duplicado (se alterado)
    if (body.email && body.email !== existingMember.email) {
      const emailExists = await prisma.teamMember.findUnique({
        where: { email: body.email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email || null
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.cpf !== undefined) updateData.cpf = body.cpf
    if (body.role !== undefined) updateData.role = body.role
    if (body.status !== undefined) updateData.status = body.status
    if (body.specialization !== undefined) updateData.specialization = body.specialization || null
    if (body.hourlyRate !== undefined) updateData.hourlyRate = body.hourlyRate ? parseFloat(body.hourlyRate) : null
    if (body.dailyRate !== undefined) updateData.dailyRate = body.dailyRate ? parseFloat(body.dailyRate) : null
    if (body.hireDate !== undefined) updateData.hireDate = new Date(body.hireDate)
    if (body.birthDate !== undefined) updateData.birthDate = body.birthDate ? new Date(body.birthDate) : null
    if (body.address !== undefined) updateData.address = body.address || null
    if (body.city !== undefined) updateData.city = body.city || null
    if (body.state !== undefined) updateData.state = body.state || null
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode || null
    if (body.emergencyContact !== undefined) updateData.emergencyContact = body.emergencyContact || null
    if (body.emergencyPhone !== undefined) updateData.emergencyPhone = body.emergencyPhone || null
    if (body.documents !== undefined) updateData.documents = body.documents || []
    if (body.certifications !== undefined) updateData.certifications = body.certifications || []
    if (body.notes !== undefined) updateData.notes = body.notes || null
    if (body.avatar !== undefined) updateData.avatar = body.avatar || null
    if (body.active !== undefined) updateData.active = body.active

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: updateData,
      include: {
        projectAssignments: {
          include: {
            project: true
          }
        }
      }
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Erro ao atualizar membro:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar membro' },
      { status: 500 }
    )
  }
}

// DELETE /api/team/[id] - Deletar membro
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se o membro existe
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
      include: {
        projectAssignments: true
      }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há projetos ativos
    const activeAssignments = existingMember.projectAssignments.filter(
      assignment => !assignment.endDate
    )

    if (activeAssignments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir membro com projetos ativos. Finalize os projetos primeiro.' 
        },
        { status: 400 }
      )
    }

    await prisma.teamMember.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Membro excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar membro:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar membro' },
      { status: 500 }
    )
  }
}
