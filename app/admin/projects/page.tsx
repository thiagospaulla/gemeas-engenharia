'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FolderKanban,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react'
import { formatCurrency, formatDate, getProjectStatusLabel } from '@/lib/utils'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('ALL')

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

    fetchProjects(token)
  }, [router])

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProjects(token)
    } catch (error) {
      console.error('Error deleting project:', error)
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

  const filteredProjects = projects.filter(project => {
    if (filter === 'ALL') return true
    return project.status === filter
  })

  const stats = {
    total: projects.length,
    orcamento: projects.filter(p => p.status === 'ORCAMENTO').length,
    emAndamento: projects.filter(p => p.status === 'EM_ANDAMENTO').length,
    concluido: projects.filter(p => p.status === 'CONCLUIDO').length
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
              <p className="text-gray-600">Gerencie todos os projetos de engenharia</p>
            </div>
            <Button 
              onClick={() => router.push('/admin/projects/new')}
              className="bg-[#C9A574] hover:bg-[#B8935E]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Projetos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.orcamento}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.emAndamento}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Concluídos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.concluido}</div>
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
              variant={filter === 'ORCAMENTO' ? 'default' : 'outline'}
              onClick={() => setFilter('ORCAMENTO')}
            >
              Orçamento
            </Button>
            <Button
              variant={filter === 'EM_ANDAMENTO' ? 'default' : 'outline'}
              onClick={() => setFilter('EM_ANDAMENTO')}
            >
              Em Andamento
            </Button>
            <Button
              variant={filter === 'PAUSADO' ? 'default' : 'outline'}
              onClick={() => setFilter('PAUSADO')}
            >
              Pausados
            </Button>
            <Button
              variant={filter === 'CONCLUIDO' ? 'default' : 'outline'}
              onClick={() => setFilter('CONCLUIDO')}
            >
              Concluídos
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className={getStatusColor(project.status)}>
                      {getProjectStatusLabel(project.status)}
                    </Badge>
                    <div className="text-2xl font-bold text-[#C9A574]">
                      {project.progress}%
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="mb-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{project.client.name}</span>
                    </div>
                    
                    {project.estimatedBudget && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(project.estimatedBudget)}</span>
                      </div>
                    )}

                    {project.city && project.state && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.city}, {project.state}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-[#C9A574] transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <FolderKanban className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>Nenhum projeto encontrado</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
