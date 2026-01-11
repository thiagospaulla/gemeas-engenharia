'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FolderKanban, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate, getProjectStatusLabel } from '@/lib/utils'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalBudget: 0
  })

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

    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/users?role=CLIENT', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const projectsData = await projectsRes.json()
      const usersData = await usersRes.json()

      setProjects(projectsData.projects || [])
      
      const totalBudget = (projectsData.projects || []).reduce(
        (sum: number, p: any) => sum + (p.estimatedBudget || 0), 
        0
      )

      setStats({
        totalProjects: projectsData.projects?.length || 0,
        activeProjects: projectsData.projects?.filter((p: any) => p.status === 'EM_ANDAMENTO').length || 0,
        totalClients: usersData.users?.length || 0,
        totalBudget
      })
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral dos projetos e atividades</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Projetos
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
                <p className="text-xs text-gray-500">Todos os projetos cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Projetos Ativos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
                <p className="text-xs text-gray-500">Em andamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalClients}</div>
                <p className="text-xs text-gray-500">Clientes cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Orçamento Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[#C9A574]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.totalBudget)}
                </div>
                <p className="text-xs text-gray-500">Valor estimado</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <Badge variant={getStatusVariant(project.status)}>
                          {getProjectStatusLabel(project.status)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Cliente: {project.client.name}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(project.createdAt)}
                        </span>
                        {project.estimatedBudget && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(project.estimatedBudget)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#C9A574]">
                          {project.progress}%
                        </div>
                        <div className="text-xs text-gray-500">Progresso</div>
                      </div>
                      {project.status === 'CONCLUIDO' ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      ) : project.status === 'PAUSADO' ? (
                        <AlertCircle className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <Clock className="h-8 w-8 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <FolderKanban className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>Nenhum projeto cadastrado ainda</p>
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

