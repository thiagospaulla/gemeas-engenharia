'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import * as Tabs from '@radix-ui/react-tabs'
import { 
  Settings, 
  Lock, 
  Users, 
  UserPlus, 
  CheckCircle, 
  XCircle,
  User,
  Mail,
  Phone,
  Shield
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  phone: string | null
  cpf: string | null
  cnpj: string | null
  active: boolean
  createdAt: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [activeTab, setActiveTab] = useState('profile')

  // Alterar Senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)

  // Criar Usuário
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT',
    phone: '',
    cpf: '',
    cnpj: '',
    active: true
  })
  const [creatingUser, setCreatingUser] = useState(false)

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

    setCurrentUser(userData)
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres!')
      return
    }

    setChangingPassword(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      alert('Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      alert(error.message || 'Erro ao alterar senha')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newUserData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }

    setCreatingUser(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/users/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      alert('Usuário criado com sucesso!')
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'CLIENT',
        phone: '',
        cpf: '',
        cnpj: '',
        active: true
      })
      fetchUsers(token!)
    } catch (error: any) {
      alert(error.message || 'Erro ao criar usuário')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desativar' : 'ativar'
    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/users/${userId}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active: !currentStatus })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Erro ao ${action} usuário`)
      }

      alert(data.message)
      fetchUsers(token!)
    } catch (error: any) {
      alert(error.message || `Erro ao ${action} usuário`)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#C9A574]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const pendingUsers = users.filter(u => !u.active && u.role === 'CLIENT')
  const activeUsers = users.filter(u => u.active)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie sua conta e usuários do sistema</p>
          </div>

          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="mb-6 flex gap-4 border-b border-gray-200">
              <Tabs.Trigger
                value="profile"
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#C9A574] text-[#C9A574]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Lock className="h-5 w-5" />
                Perfil & Senha
              </Tabs.Trigger>

              <Tabs.Trigger
                value="users"
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'border-[#C9A574] text-[#C9A574]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-5 w-5" />
                Gerenciar Usuários
                {pendingUsers.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {pendingUsers.length}
                  </Badge>
                )}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="create"
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'border-[#C9A574] text-[#C9A574]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="h-5 w-5" />
                Cadastrar Usuário
              </Tabs.Trigger>
            </Tabs.List>

            {/* Aba Perfil & Senha */}
            <Tabs.Content value="profile">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Informações do Perfil */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações do Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nome</label>
                      <p className="mt-1 text-lg font-semibold">{currentUser?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1">{currentUser?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Função</label>
                      <Badge className="mt-1 bg-[#C9A574] text-white">
                        {currentUser?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Alterar Senha */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Alterar Senha
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Senha Atual *
                        </label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                          placeholder="Digite sua senha atual"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Nova Senha *
                        </label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Confirmar Nova Senha *
                        </label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                          placeholder="Digite novamente"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full bg-[#C9A574] hover:bg-[#B8956A]"
                      >
                        {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </Tabs.Content>

            {/* Aba Gerenciar Usuários */}
            <Tabs.Content value="users">
              <div className="space-y-6">
                {/* Usuários Pendentes */}
                {pendingUsers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-yellow-500" />
                        Usuários Aguardando Aprovação
                        <Badge className="ml-2 bg-red-500 text-white">
                          {pendingUsers.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                          >
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              {user.phone && (
                                <p className="text-xs text-gray-500">Tel: {user.phone}</p>
                              )}
                            </div>
                            <Button
                              onClick={() => handleToggleUserStatus(user.id, user.active)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprovar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Usuários Ativos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Todos os Usuários ({activeUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A574] text-lg font-bold text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <Badge className={user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                  {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                                </Badge>
                                <Badge className={user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {user.active ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
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
                              </div>
                            </div>
                          </div>
                          {user.id !== currentUser?.id && (
                            <Button
                              onClick={() => handleToggleUserStatus(user.id, user.active)}
                              variant="outline"
                              size="sm"
                              className={user.active ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}
                            >
                              {user.active ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Ativar
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}

                      {activeUsers.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                          <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                          <p>Nenhum usuário ativo</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Tabs.Content>

            {/* Aba Cadastrar Usuário */}
            <Tabs.Content value="create">
              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Cadastrar Novo Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nome Completo *
                      </label>
                      <Input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        required
                        placeholder="Nome do usuário"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          required
                          placeholder="email@exemplo.com"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Senha *
                        </label>
                        <Input
                          type="password"
                          value={newUserData.password}
                          onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Função *
                        </label>
                        <select
                          value={newUserData.role}
                          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                        >
                          <option value="CLIENT">Cliente</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <Input
                          type="tel"
                          value={newUserData.phone}
                          onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          CPF
                        </label>
                        <Input
                          type="text"
                          value={newUserData.cpf}
                          onChange={(e) => setNewUserData({ ...newUserData, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          CNPJ
                        </label>
                        <Input
                          type="text"
                          value={newUserData.cnpj}
                          onChange={(e) => setNewUserData({ ...newUserData, cnpj: e.target.value })}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newUserData.active}
                        onChange={(e) => setNewUserData({ ...newUserData, active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#C9A574] focus:ring-[#C9A574]"
                      />
                      <label htmlFor="active" className="text-sm text-gray-700">
                        Ativar usuário imediatamente
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={creatingUser}
                      className="w-full bg-[#C9A574] hover:bg-[#B8956A]"
                    >
                      {creatingUser ? 'Criando...' : 'Criar Usuário'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Tabs.Content>
          </Tabs.Root>
        </main>
      </div>
    </div>
  )
}
