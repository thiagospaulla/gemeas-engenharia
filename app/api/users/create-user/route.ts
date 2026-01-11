import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, hashPassword } from '@/lib/auth'

// POST /api/users/create-user - Admin criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, phone, cpf, cnpj, active } = body

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar CPF se fornecido
    if (cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf }
      })

      if (existingCpf) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Verificar CNPJ se fornecido
    if (cnpj) {
      const existingCnpj = await prisma.user.findUnique({
        where: { cnpj }
      })

      if (existingCnpj) {
        return NextResponse.json(
          { error: 'CNPJ já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'CLIENT',
        phone: phone || null,
        cpf: cpf || null,
        cnpj: cnpj || null,
        active: active !== undefined ? active : true, // Admin pode ativar direto
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        cpf: true,
        cnpj: true,
        active: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ 
      user: newUser,
      message: 'Usuário criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
