'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Plus
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  phone?: string
  cpf?: string
  city?: string
  state?: string
  createdAt: string
  _count: {
    projects: number
  }
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'ADMIN'>('ALL')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    fetchUsers(token)
  }, [router])

  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const user = users.find(u => u.id === userId)
    if (!user) return

    if (!confirm(`Aprovar usuário "${user.name}"?\n\nO cliente receberá uma notificação e poderá fazer login no sistema.`)) {
      return
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...user,
          active: true
        })
      })

      if (res.ok) {
        alert(`✅ Usuário "${user.name}" aprovado com sucesso!\n\nUma notificação foi enviada ao cliente.`)
        fetchUsers(token)
      } else {
        const error = await res.json()
        alert(`❌ Erro: ${error.error || 'Erro ao aprovar usuário'}`)
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert('❌ Erro ao aprovar usuário. Tente novamente.')
    }
  }

  const handlePromoteToAdmin = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const user = users.find(u => u.id === userId)
    if (!user) return

    if (!confirm(`⚠️ ATENÇÃO!\n\nVocê está prestes a promover "${user.name}" a ADMINISTRADOR.\n\nEste usuário terá acesso total ao sistema, incluindo:\n• Aprovar/desativar usuários\n• Criar e editar projetos\n• Emitir faturas\n• Acessar dados de todos os clientes\n\nDeseja continuar?`)) {
      return
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...user,
          role: 'ADMIN',
          active: true
        })
      })

      if (res.ok) {
        alert(`✅ "${user.name}" foi promovido a ADMINISTRADOR!\n\nUma notificação foi enviada ao usuário.`)
        fetchUsers(token)
      } else {
        const error = await res.json()
        alert(`❌ Erro: ${error.error || 'Erro ao promover usuário'}`)
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      alert('❌ Erro ao promover usuário. Tente novamente.')
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const user = users.find(u => u.id === userId)
    if (!user) return

    if (!confirm(`Desativar usuário "${user.name}"?\n\nEsta ação irá:\n• Bloquear o acesso do cliente ao sistema\n• Impedir login\n• Não afetará projetos existentes\n\nVocê pode reativar depois se necessário.\n\nDeseja continuar?`)) {
      return
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...user,
          active: false
        })
      })

      if (res.ok) {
        alert(`✅ Usuário "${user.name}" desativado com sucesso!\n\nO cliente não poderá mais fazer login até ser reativado.`)
        fetchUsers(token)
      } else {
        const error = await res.json()
        alert(`❌ Erro: ${error.error || 'Erro ao desativar usuário'}`)
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      alert('❌ Erro ao desativar usuário. Tente novamente.')
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'ACTIVE') return user.active && user.role !== 'ADMIN'
    if (filter === 'PENDING') return !user.active && user.role !== 'ADMIN'
    if (filter === 'ADMIN') return user.role === 'ADMIN'
    return true
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    pending: users.filter(u => !u.active && u.role !== 'ADMIN').length,
    admins: users.filter(u => u.role === 'ADMIN').length
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
              <p className="text-gray-600">Aprove, gerencie e promova usuários do sistema</p>
            </div>
            <Button 
              onClick={() => router.push('/admin/clients/new')}
              className="bg-[#C9A574] hover:bg-[#B8935E]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Usuários Ativos
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Aguardando Aprovação
                </CardTitle>
                <UserX className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Administradores
                </CardTitle>
                <Shield className="h-4 w-4 text-[#C9A574]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.admins}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <Button
              variant={filter === 'ALL' ? 'default' : 'outline'}
              onClick={() => setFilter('ALL')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'ACTIVE' ? 'default' : 'outline'}
              onClick={() => setFilter('ACTIVE')}
            >
              Ativos
            </Button>
            <Button
              variant={filter === 'PENDING' ? 'default' : 'outline'}
              onClick={() => setFilter('PENDING')}
            >
              Pendentes ({stats.pending})
            </Button>
            <Button
              variant={filter === 'ADMIN' ? 'default' : 'outline'}
              onClick={() => setFilter('ADMIN')}
            >
              Administradores
            </Button>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        {user.role === 'ADMIN' && (
                          <Badge className="bg-[#C9A574] text-white">
                            <Crown className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                        {user.active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </span>
                        )}
                        {user.city && user.state && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.city}, {user.state}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {user._count.projects} projeto(s)
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!user.active && user.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Aprovar
                        </Button>
                      )}
                      {user.active && user.role !== 'ADMIN' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteToAdmin(user.id)}
                          >
                            <Crown className="mr-1 h-4 w-4" />
                            Promover
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Desativar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
