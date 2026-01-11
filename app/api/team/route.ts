import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/team - Listar todos os membros da equipe
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      include: {
        projectAssignments: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                status: true,
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar membros da equipe' },
      { status: 500 }
    )
  }
}

// POST /api/team - Criar novo membro da equipe
export async function POST(request: NextRequest) {
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

    // Validar campos obrigatórios
    if (!body.name || !body.phone || !body.cpf || !body.role || !body.hireDate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe
    const existingCpf = await prisma.teamMember.findUnique({
      where: { cpf: body.cpf }
    })

    if (existingCpf) {
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se email já existe (se fornecido)
    if (body.email) {
      const existingEmail = await prisma.teamMember.findUnique({
        where: { email: body.email }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email já cadastrado' },
          { status: 400 }
        )
      }
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone,
        cpf: body.cpf,
        role: body.role,
        status: body.status || 'ATIVO',
        specialization: body.specialization || null,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
        dailyRate: body.dailyRate ? parseFloat(body.dailyRate) : null,
        hireDate: new Date(body.hireDate),
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zipCode: body.zipCode || null,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
        documents: body.documents || [],
        certifications: body.certifications || [],
        notes: body.notes || null,
        avatar: body.avatar || null,
        active: body.active !== undefined ? body.active : true,
      },
      include: {
        projectAssignments: {
          include: {
            project: true
          }
        }
      }
    })

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar membro da equipe:', error)
    return NextResponse.json(
      { error: 'Erro ao criar membro da equipe' },
      { status: 500 }
    )
  }
}
