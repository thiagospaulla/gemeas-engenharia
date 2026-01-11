'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FolderKanban, 
  FileText, 
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react'
import { formatCurrency, formatDate, getProjectStatusLabel } from '@/lib/utils'

export default function ClientDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])

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

    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      ORCAMENTO: 'secondary',
      EM_ANDAMENTO: 'default',
      PAUSADO: 'warning',
      CONCLUIDO: 'success',
      CANCELADO: 'danger'
    }
    return variants[status] || 'default'
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

  const activeProjects = projects.filter(p => p.status === 'EM_ANDAMENTO')
  const totalDocuments = projects.reduce((sum, p) => sum + (p._count?.documents || 0), 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="CLIENT" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          {/* Welcome Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-br from-[#2C3E50] to-[#34495E] p-8 text-white">
            <h1 className="mb-2 text-3xl font-bold">
              Bem-vindo à sua Área do Cliente
            </h1>
            <p className="text-gray-300">
              Acompanhe o progresso dos seus projetos e acesse documentos importantes
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Meus Projetos
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
                <p className="text-xs text-gray-500">Total de projetos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Em Andamento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{activeProjects.length}</div>
                <p className="text-xs text-gray-500">Projetos ativos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Documentos
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalDocuments}</div>
                <p className="text-xs text-gray-500">Total de documentos</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <Badge variant={getStatusVariant(project.status)}>
                          {getProjectStatusLabel(project.status)}
                        </Badge>
                      </div>
                      
                      {project.description && (
                        <p className="mb-3 text-sm text-gray-600">{project.description}</p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Criado em {formatDate(project.createdAt)}
                        </span>
                        {project.estimatedBudget && (
                          <span>
                            Orçamento: {formatCurrency(project.estimatedBudget)}
                          </span>
                        )}
                        <span>
                          {project._count?.documents || 0} documentos
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-semibold text-[#C9A574]">{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-[#C9A574] transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <FolderKanban className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="mb-2 text-lg font-medium">Nenhum projeto ainda</p>
                    <p className="text-sm">
                      Entre em contato conosco para iniciar seu primeiro projeto
                    </p>
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

