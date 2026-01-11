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
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Image
} from 'lucide-react'
import { formatCurrency, formatDate, getProjectStatusLabel } from '@/lib/utils'

export default function ViewProjectPage({ params }: { params: Promise<{ id: string }> }) {
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
    if (userData.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    if (projectId) {
      fetchProject(token, projectId)
    }
  }, [projectId, router])

  const fetchProject = async (token: string, id: string) => {
    try {
      console.log('Fetching project with ID:', id)
      const res = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Project data:', data)
      
      if (data.project) {
        setProject(data.project)
      } else {
        console.error('No project in response:', data)
        alert('Projeto não encontrado')
        router.push('/admin/projects')
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
                onClick={() => router.push(`/admin/projects/${projectId}/edit`)}
                className="bg-[#C9A574] hover:bg-[#B8935E]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Projeto
              </Button>
            </div>
            
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
                  <CardTitle>Progresso da Obra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Fase Atual: {getPhaseLabel(project.currentPhase)}
                      </span>
                      <span className="text-2xl font-bold text-[#C9A574]">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-gray-200">
                      <div
                        className="h-4 rounded-full bg-[#C9A574] transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>Informações Financeiras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <DollarSign className="h-5 w-5 text-[#C9A574]" />
                      <div>
                        <p className="text-sm text-gray-600">Orçamento Estimado</p>
                        <p className="text-xl font-bold">
                          {project.estimatedBudget ? formatCurrency(project.estimatedBudget) : 'Não definido'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Orçamento Real</p>
                        <p className="text-xl font-bold">
                          {project.actualBudget ? formatCurrency(project.actualBudget) : 'Não definido'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {project.estimatedBudget && project.actualBudget && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600 mb-1">Variação</p>
                      <p className={`text-lg font-bold ${
                        project.actualBudget > project.estimatedBudget 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {project.actualBudget > project.estimatedBudget ? '+' : ''}
                        {formatCurrency(project.actualBudget - project.estimatedBudget)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project._count?.documents > 0 ? (
                    <p className="text-gray-700">
                      {project._count.documents} documento(s) anexado(s)
                    </p>
                  ) : (
                    <p className="text-gray-500">Nenhum documento anexado ainda</p>
                  )}
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push(`/admin/documents?project=${project.id}`)}
                  >
                    Ver Documentos
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-semibold">{project.client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm">{project.client.email}</p>
                    </div>
                    {project.client.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="text-sm">{project.client.phone}</p>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => router.push(`/admin/users/${project.client.id}`)}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.zipCode && (
                    <div>
                      <p className="text-sm text-gray-600">CEP</p>
                      <p className="text-sm font-medium">{project.zipCode}</p>
                    </div>
                  )}
                  {project.address && (
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="text-sm">{project.address}</p>
                    </div>
                  )}
                  {project.complement && (
                    <div>
                      <p className="text-sm text-gray-600">Complemento</p>
                      <p className="text-sm">{project.complement}</p>
                    </div>
                  )}
                  {project.city && project.state && (
                    <div>
                      <p className="text-sm text-gray-600">Cidade/Estado</p>
                      <p className="text-sm">{project.city}, {project.state}</p>
                    </div>
                  )}
                  {project.area && (
                    <div>
                      <p className="text-sm text-gray-600">Área</p>
                      <p className="text-sm">{project.area} m²</p>
                    </div>
                  )}
                  {!project.address && !project.city && !project.area && (
                    <p className="text-sm text-gray-500">Localização não definida</p>
                  )}
                </CardContent>
              </Card>

              {/* Property Codes */}
              {project.propertyCodes && project.propertyCodes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Códigos de Matrícula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.propertyCodes.map((code: string, index: number) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <p className="text-sm text-gray-600">Matrícula {index + 1}</p>
                          <p className="font-mono text-lg font-semibold">{code}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Criado em</p>
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
