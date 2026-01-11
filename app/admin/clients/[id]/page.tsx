'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FolderKanban,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ViewClientPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const { id: clientId } = use(params) // Next.js 16: Unwrap params com React.use()

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

    if (clientId) {
      fetchClient(token, clientId)
    }
  }, [clientId, router])

  const fetchClient = async (token: string, id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClient(data.user)
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
    }
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

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cliente não encontrado</p>
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <Button
                onClick={() => router.push(`/admin/clients/${clientId}/edit`)}
                className="bg-[#C9A574] hover:bg-[#B8935E]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-600">{client.email}</p>
              </div>
              <div className="flex gap-2">
                {client.role === 'ADMIN' ? (
                  <Badge className="bg-[#C9A574] text-white">
                    Administrador
                  </Badge>
                ) : (
                  <Badge variant="outline">Cliente</Badge>
                )}
                {client.active ? (
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
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{client.email}</p>
                      </div>
                    </div>

                    {client.phone && (
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Telefone</p>
                          <p className="font-medium">{client.phone}</p>
                        </div>
                      </div>
                    )}

                    {client.cpf && (
                      <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">CPF</p>
                          <p className="font-medium">{client.cpf}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Cadastrado em</p>
                        <p className="font-medium">{formatDate(client.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              {(client.address || client.city || client.state) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {client.address && (
                      <div>
                        <p className="text-sm text-gray-600">Endereço</p>
                        <p className="font-medium">{client.address}</p>
                      </div>
                    )}
                    {client.city && client.state && (
                      <div>
                        <p className="text-sm text-gray-600">Cidade/Estado</p>
                        <p className="font-medium">{client.city}, {client.state}</p>
                      </div>
                    )}
                    {client.zipCode && (
                      <div>
                        <p className="text-sm text-gray-600">CEP</p>
                        <p className="font-medium">{client.zipCode}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <FolderKanban className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{client._count?.projects || 0}</p>
                        <p className="text-sm text-gray-600">Projetos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <FileText className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{client._count?.documents || 0}</p>
                        <p className="text-sm text-gray-600">Documentos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <DollarSign className="h-5 w-5 text-[#C9A574]" />
                      <div>
                        <p className="text-2xl font-bold">{client._count?.budgets || 0}</p>
                        <p className="text-sm text-gray-600">Orçamentos</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/projects?client=${clientId}`)}
                    >
                      Ver Projetos
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/budgets?client=${clientId}`)}
                    >
                      Ver Orçamentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/projects/new?client=${clientId}`)}
                  >
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Criar Projeto
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/budgets/new?client=${clientId}`)}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Criar Orçamento
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/appointments/new?client=${clientId}`)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Compromisso
                  </Button>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">ID do Usuário</p>
                    <p className="font-mono text-xs">{client.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tipo de Conta</p>
                    <p className="font-medium">{client.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium">{client.active ? 'Ativo' : 'Aguardando aprovação'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Última atualização</p>
                    <p className="font-medium">{formatDate(client.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
