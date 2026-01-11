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
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp
} from 'lucide-react'
import { formatCurrency, formatDate, getProjectStatusLabel } from '@/lib/utils'

export default function ClientViewProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const { id: projectId } = use(params) // Next.js 16: Unwrap params com React.use()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== 'CLIENT') {
      router.push('/admin/dashboard')
      return
    }

    if (projectId) {
      fetchProject(token, projectId)
    }
  }, [projectId, router])

  const fetchProject = async (token: string, id: string) => {
    try {
      console.log('Client fetching project, ID:', id)
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Project data:', data)
      
      if (data.project) {
        setProject(data.project)
      } else {
        console.error('No project in response')
        alert('Projeto não encontrado')
        router.push('/client/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Erro ao buscar projeto')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      ORCAMENTO: 'bg-gray-100 text-gray-800',
      EM_ANDAMENTO: 'bg-blue-100 text-blue-800',
      PAUSADO: 'bg-yellow-100 text-yellow-800',
      CONCLUIDO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPhaseLabel = (phase: string | null) => {
    if (!phase) return 'Não definida'
    const labels: any = {
      PLANEJAMENTO: 'Planejamento',
      FUNDACAO: 'Fundação',
      ESTRUTURA: 'Estrutura',
      ALVENARIA: 'Alvenaria',
      INSTALACOES: 'Instalações',
      ACABAMENTO: 'Acabamento',
      FINALIZACAO: 'Finalização'
    }
    return labels[phase] || phase
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

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Projeto não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="CLIENT" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600">{project.type}</p>
              </div>
              <Badge className={getStatusColor(project.status)}>
                {getProjectStatusLabel(project.status)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {project.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição do Projeto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{project.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Acompanhamento da Obra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Fase Atual</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {getPhaseLabel(project.currentPhase)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Progresso</p>
                        <p className="text-3xl font-bold text-[#C9A574]">
                          {project.progress}%
                        </p>
                      </div>
                    </div>
                    <div className="h-4 w-full rounded-full bg-gray-200">
                      <div
                        className="h-4 rounded-full bg-[#C9A574] transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Data de Início</p>
                        <p className="font-semibold">
                          {project.startDate ? formatDate(project.startDate) : 'Não definida'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Previsão de Término</p>
                        <p className="font-semibold">
                          {project.endDate ? formatDate(project.endDate) : 'Não definida'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial */}
              {project.estimatedBudget && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Financeiras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <DollarSign className="h-6 w-6 text-[#C9A574]" />
                      <div>
                        <p className="text-sm text-gray-600">Orçamento do Projeto</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(project.estimatedBudget)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Meus Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project._count?.documents > 0 ? (
                    <>
                      <p className="text-gray-700 mb-4">
                        {project._count.documents} documento(s) no projeto
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/client/documents?project=${projectId}`)}
                      >
                        Ver Todos os Documentos
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">Nenhum documento ainda</p>
                      <Button 
                        variant="outline"
                        onClick={() => router.push(`/client/documents`)}
                      >
                        Fazer Upload de Documentos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização da Obra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.zipCode && (
                    <div>
                      <p className="text-sm text-gray-600">CEP</p>
                      <p className="font-medium">{project.zipCode}</p>
                    </div>
                  )}
                  {project.address && (
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-medium">{project.address}</p>
                    </div>
                  )}
                  {project.complement && (
                    <div>
                      <p className="text-sm text-gray-600">Complemento</p>
                      <p className="font-medium">{project.complement}</p>
                    </div>
                  )}
                  {project.city && project.state && (
                    <div>
                      <p className="text-sm text-gray-600">Cidade/Estado</p>
                      <p className="font-medium">{project.city}, {project.state}</p>
                    </div>
                  )}
                  {project.area && (
                    <div>
                      <p className="text-sm text-gray-600">Área Total</p>
                      <p className="font-medium">{project.area} m²</p>
                    </div>
                  )}
                  {!project.address && !project.city && !project.area && (
                    <p className="text-sm text-gray-500">Informações não disponíveis</p>
                  )}
                </CardContent>
              </Card>

              {/* Property Codes */}
              {project.propertyCodes && project.propertyCodes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Códigos de Matrícula do Imóvel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.propertyCodes.map((code: string, index: number) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <p className="text-xs text-gray-600 mb-1">Matrícula {index + 1}</p>
                          <p className="font-mono text-base font-semibold">{code}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                      Códigos do cartório de registro de imóveis
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/client/budgets')}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Ver Orçamentos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/client/invoices')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Faturas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/client/appointments')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Agendamentos
                  </Button>
                </CardContent>
              </Card>

              {/* Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Projeto criado em</p>
                    <p className="font-medium">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Última atualização</p>
                    <p className="font-medium">{formatDate(project.updatedAt)}</p>
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
