'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardList,
  Calendar,
  Cloud,
  Users,
  Image as ImageIcon,
  FolderKanban,
  Eye
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ClientWorkDiariesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [diaries, setDiaries] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState('')

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

  const filteredDiaries = selectedProject
    ? diaries.filter(d => d.projectId === selectedProject)
    : diaries

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
      <Sidebar role="CLIENT" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Acompanhamento da Obra</h1>
            <p className="text-gray-600">Veja o progresso diário dos seus projetos</p>
          </div>

          {/* Filter by Project */}
          {projects.length > 1 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Filtrar por Projeto
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Todos os projetos</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            {filteredDiaries.map((diary) => (
              <Card 
                key={diary.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/client/work-diaries/${diary.id}`)}
              >
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
                          {diary.project?.title}
                        </span>
                        {diary.workersPresent && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {diary.workersPresent} trabalhadores
                          </span>
                        )}
                        {diary.photos && diary.photos.length > 0 && (
                          <span className="flex items-center gap-1 text-[#C9A574]">
                            <ImageIcon className="h-4 w-4" />
                            {diary.photos.length} fotos
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 line-clamp-3">
                        {diary.activities}
                      </p>

                      {diary.aiSummary && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3">
                          <p className="text-sm text-blue-900">
                            <span className="font-semibold">🤖 Resumo: </span>
                            {diary.aiSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    <Eye className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDiaries.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p className="mb-2">Nenhum registro disponível</p>
                  <p className="text-sm">
                    Quando houver atualizações na obra, você será notificado.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
