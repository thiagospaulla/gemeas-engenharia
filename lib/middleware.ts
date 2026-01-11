import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    active: boolean
  }
}

export async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token não fornecido', status: 401 }
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return { error: 'Token inválido ou expirado', status: 401 }
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
      active: true,
      name: true
    }
  })

  if (!user) {
    return { error: 'Usuário não encontrado', status: 404 }
  }

  // Verifica se usuário está ativo (exceto para ADMIN que é sempre ativo)
  if (user.role !== 'ADMIN' && !user.active) {
    return { error: 'Usuário aguardando aprovação do administrador', status: 403 }
  }

  return { user }
}

export async function requireAuth(request: NextRequest) {
  const result = await authenticate(request)
  
  if ('error' in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    )
  }

  return result.user
}

export async function requireAdmin(request: NextRequest) {
  const result = await authenticate(request)
  
  if ('error' in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    )
  }

  if (result.user!.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Acesso negado. Apenas administradores.' },
      { status: 403 }
    )
  }

  return result.user
}

export function apiResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
