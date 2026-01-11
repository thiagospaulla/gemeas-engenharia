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
  Calendar,
  Cloud,
  Thermometer,
  Users,
  Package,
  Wrench,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  FolderKanban,
  Sparkles
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ViewWorkDiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [diary, setDiary] = useState<any>(null)
  const { id: diaryId } = use(params)

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

    if (diaryId) {
      fetchDiary(token, diaryId)
    }
  }, [diaryId, router])

  const fetchDiary = async (token: string, id: string) => {
    try {
      const res = await fetch(`/api/work-diaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (data.workDiary) {
        setDiary(data.workDiary)
      } else {
        alert('Registro não encontrado')
        router.push('/admin/work-diaries')
      }
    } catch (error) {
      console.error('Error fetching diary:', error)
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

  if (!diary) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Registro não encontrado</p>
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
                onClick={() => router.push(`/admin/work-diaries/${diaryId}/edit`)}
                className="bg-[#C9A574] hover:bg-[#B8935E]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Registro
              </Button>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Diário de Obras - {formatDate(diary.date)}
                </h1>
                <p className="text-gray-600">
                  {diary.project?.title || 'Projeto não vinculado'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Summary & Insights */}
              {(diary.aiSummary || diary.aiInsights) && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Análise por Inteligência Artificial
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {diary.aiSummary && (
                      <div>
                        <h4 className="mb-2 font-semibold text-purple-900">📝 Resumo</h4>
                        <p className="text-gray-700">{diary.aiSummary}</p>
                      </div>
                    )}
                    {diary.aiInsights && (
                      <div>
                        <h4 className="mb-2 font-semibold text-blue-900">💡 Insights</h4>
                        <p className="text-gray-700 whitespace-pre-line">{diary.aiInsights}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividades Realizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {diary.activities}
                  </p>
                </CardContent>
              </Card>

              {/* Materials */}
              {diary.materials && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Materiais Utilizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {diary.materials}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Equipment */}
              {diary.equipment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Equipamentos Utilizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {diary.equipment}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Observations */}
              {diary.observations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {diary.observations}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Photos Gallery */}
              {diary.photos && diary.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Galeria de Fotos ({diary.photos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {diary.photos.map((photo: string, index: number) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+não+disponível'
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-sm text-white font-medium">
                              Foto {index + 1}
                            </p>
                          </div>
                          <a
                            href={photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project */}
              {diary.project && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">{diary.project.title}</p>
                    <Badge>{diary.project.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => router.push(`/admin/projects/${diary.project.id}`)}
                    >
                      Ver Projeto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Weather & Workers */}
              <Card>
                <CardHeader>
                  <CardTitle>Condições do Dia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="font-semibold">{formatDate(diary.date)}</p>
                    </div>
                  </div>

                  {diary.weather && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                      <Cloud className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Clima</p>
                        <p className="font-semibold">
                          {getWeatherIcon(diary.weather)} {diary.weather}
                        </p>
                      </div>
                    </div>
                  )}

                  {diary.temperature && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                      <Thermometer className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Temperatura</p>
                        <p className="font-semibold">{diary.temperature}°C</p>
                      </div>
                    </div>
                  )}

                  {diary.workersPresent && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Trabalhadores</p>
                        <p className="font-semibold">{diary.workersPresent} pessoas</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Registro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Criado em</p>
                    <p className="font-medium">{formatDate(diary.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Última atualização</p>
                    <p className="font-medium">{formatDate(diary.updatedAt)}</p>
                  </div>
                  {diary.photos && diary.photos.length > 0 && (
                    <div>
                      <p className="text-gray-600">Total de Fotos</p>
                      <p className="font-medium">{diary.photos.length} imagens</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
