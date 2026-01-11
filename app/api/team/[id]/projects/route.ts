import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// POST /api/team/[id]/projects - Atribuir membro a um projeto
export async function POST(
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

    // Validar campos obrigatórios
    if (!body.projectId || !body.startDate || !body.role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se o membro existe
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o projeto existe
    const project = await prisma.project.findUnique({
      where: { id: body.projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe atribuição ativa
    const existingAssignment = await prisma.projectTeamMember.findFirst({
      where: {
        projectId: body.projectId,
        teamMemberId: params.id,
        endDate: null
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Membro já está atribuído a este projeto' },
        { status: 400 }
      )
    }

    const assignment = await prisma.projectTeamMember.create({
      data: {
        projectId: body.projectId,
        teamMemberId: params.id,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        role: body.role,
        notes: body.notes || null,
      },
      include: {
        project: true,
        teamMember: true
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Erro ao atribuir membro ao projeto:', error)
    return NextResponse.json(
      { error: 'Erro ao atribuir membro ao projeto' },
      { status: 500 }
    )
  }
}

// GET /api/team/[id]/projects - Listar projetos do membro
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

    const assignments = await prisma.projectTeamMember.findMany({
      where: {
        teamMemberId: params.id
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Erro ao buscar projetos do membro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projetos do membro' },
      { status: 500 }
    )
  }
}
