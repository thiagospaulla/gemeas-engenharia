'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardList,
  Plus,
  Calendar,
  Cloud,
  Users,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  FolderKanban,
  Search
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function WorkDiariesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [diaries, setDiaries] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [filters, setFilters] = useState({
    projectId: '',
    startDate: '',
    endDate: '',
    weather: ''
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
      const [diariesRes, projectsRes] = await Promise.all([
        fetch('/api/work-diaries', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const diariesData = await diariesRes.json()
      const projectsData = await projectsRes.json()

      setDiaries(diariesData.workDiaries || [])
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (diaryId: string) => {
    if (!confirm('Tem certeza que deseja deletar este registro do diário?')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`/api/work-diaries/${diaryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData(token)
    } catch (error) {
      console.error('Error deleting diary:', error)
    }
  }

  const getWeatherIcon = (weather: string) => {
    const icons: any = {
      'Ensolarado': '☀️',
      'Parcialmente Nublado': '⛅',
      'Nublado': '☁️',
      'Chuvoso': '🌧️',
      'Tempestade': '⛈️'
    }
    return icons[weather] || '🌤️'
  }

  const filteredDiaries = diaries.filter(diary => {
    if (filters.projectId && diary.projectId !== filters.projectId) return false
    if (filters.weather && diary.weather !== filters.weather) return false
    if (filters.startDate && new Date(diary.date) < new Date(filters.startDate)) return false
    if (filters.endDate && new Date(diary.date) > new Date(filters.endDate)) return false
    return true
  })

  const stats = {
    total: diaries.length,
    thisWeek: diaries.filter(d => {
      const date = new Date(d.date)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return date >= weekAgo
    }).length,
    withPhotos: diaries.filter(d => d.photos && d.photos.length > 0).length,
    totalWorkers: diaries.reduce((sum, d) => sum + (d.workersPresent || 0), 0)
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
              <h1 className="text-3xl font-bold text-gray-900">Diário de Obras</h1>
              <p className="text-gray-600">Registro detalhado das atividades diárias</p>
            </div>
            <Button 
              onClick={() => router.push('/admin/work-diaries/new')}
              className="bg-[#C9A574] hover:bg-[#B8935E]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.thisWeek}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Com Fotos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.withPhotos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Trabalhadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalWorkers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Projeto
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={filters.projectId}
                    onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                  >
                    <option value="">Todos os projetos</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Data Final
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Clima
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={filters.weather}
                    onChange={(e) => setFilters({ ...filters, weather: e.target.value })}
                  >
                    <option value="">Todos</option>
                    <option value="Ensolarado">☀️ Ensolarado</option>
                    <option value="Parcialmente Nublado">⛅ Parc. Nublado</option>
                    <option value="Nublado">☁️ Nublado</option>
                    <option value="Chuvoso">🌧️ Chuvoso</option>
                    <option value="Tempestade">⛈️ Tempestade</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diaries Timeline */}
          <div className="space-y-4">
            {filteredDiaries.map((diary) => (
              <Card key={diary.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {formatDate(diary.date)}
                        </h3>
                        {diary.weather && (
                          <Badge variant="outline">
                            {getWeatherIcon(diary.weather)} {diary.weather}
                          </Badge>
                        )}
                        {diary.temperature && (
                          <Badge variant="outline">
                            🌡️ {diary.temperature}°C
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <FolderKanban className="h-4 w-4" />
                          {diary.project?.title || 'Projeto não vinculado'}
                        </span>
                        {diary.workersPresent && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {diary.workersPresent} trabalhadores
                          </span>
                        )}
                        {diary.photos && diary.photos.length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            {diary.photos.length} fotos
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 line-clamp-2">
                        {diary.activities}
                      </p>

                      {diary.aiSummary && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3">
                          <p className="text-sm text-blue-900">
                            <span className="font-semibold">🤖 IA: </span>
                            {diary.aiSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/work-diaries/${diary.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/work-diaries/${diary.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(diary.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDiaries.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p>Nenhum registro encontrado</p>
                  {(filters.projectId || filters.startDate || filters.endDate || filters.weather) && (
                    <p className="mt-2 text-sm">Tente ajustar os filtros</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
