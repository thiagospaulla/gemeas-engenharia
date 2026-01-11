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
  Calendar,
  Clock,
  MapPin,
  FolderKanban,
  MessageSquare
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ClientViewAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState<any>(null)
  const { id: appointmentId } = use(params)

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

    if (appointmentId) {
      fetchAppointment(token, appointmentId)
    }
  }, [appointmentId, router])

  const fetchAppointment = async (token: string, id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (data.appointment) {
        setAppointment(data.appointment)
      } else {
        alert('Agendamento não encontrado')
        router.push('/client/appointments')
      }
    } catch (error) {
      console.error('Error fetching appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      AGENDADO: 'bg-blue-100 text-blue-800',
      CONFIRMADO: 'bg-green-100 text-green-800',
      CONCLUIDO: 'bg-gray-100 text-gray-800',
      CANCELADO: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  if (!appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Agendamento não encontrado</p>
        </div>
      </div>
    )
  }

  const isUpcoming = new Date(appointment.startTime) > new Date()

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
                <h1 className="text-3xl font-bold text-gray-900">{appointment.title}</h1>
                <p className="text-gray-600">{appointment.type}</p>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {appointment.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{appointment.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Data e Horário</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-lg border-2 border-[#C9A574] bg-[#C9A574]/5 p-4">
                      <Calendar className="h-8 w-8 text-[#C9A574]" />
                      <div>
                        <p className="text-sm text-gray-600">Data</p>
                        <p className="font-semibold text-xl">
                          {new Date(appointment.startTime).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            weekday: 'long'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                      <Clock className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Horário</p>
                        <p className="font-semibold text-xl">
                          {new Date(appointment.startTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {new Date(appointment.endTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              {appointment.location && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Local
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{appointment.location}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#C9A574] px-4 py-2 text-sm font-medium text-white hover:bg-[#B8935E] transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver no Google Maps
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {appointment.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {appointment.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Status Alert */}
              {isUpcoming && appointment.status === 'AGENDADO' && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-900">Aguardando Confirmação</h3>
                        <p className="text-sm text-yellow-800 mt-1">
                          Este agendamento ainda não foi confirmado pela equipe. Você receberá uma notificação quando for confirmado.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isUpcoming && appointment.status === 'CONFIRMADO' && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900">✅ Confirmado!</h3>
                        <p className="text-sm text-green-800 mt-1">
                          Este compromisso está confirmado. Você receberá um lembrete 24h antes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project */}
              {appointment.project && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      Projeto Relacionado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">{appointment.project.title}</p>
                    <Badge variant="outline">{appointment.project.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => router.push(`/client/projects/${appointment.project.id}`)}
                    >
                      Ver Projeto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Reminder Info */}
              {isUpcoming && appointment.status !== 'CANCELADO' && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">🔔 Lembretes</h3>
                    <p className="text-sm text-blue-800">
                      Você receberá um lembrete por email e WhatsApp 24 horas antes do compromisso.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
