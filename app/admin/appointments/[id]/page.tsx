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
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  FolderKanban,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ViewAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
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
    if (userData.role !== 'ADMIN') {
      router.push('/client/dashboard')
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
        router.push('/admin/appointments')
      }
    } catch (error) {
      console.error('Error fetching appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const confirmMessages: any = {
      CONFIRMADO: 'Confirmar este agendamento?\n\nO cliente receberá uma notificação de confirmação.',
      CONCLUIDO: 'Marcar como concluído?\n\nEsta ação indica que o compromisso foi realizado.',
      CANCELADO: 'Cancelar este agendamento?\n\nO cliente será notificado sobre o cancelamento.'
    }

    if (!confirm(confirmMessages[newStatus] || 'Atualizar status?')) return

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          sendNotification: true
        })
      })

      if (res.ok) {
        alert('✅ Status atualizado! Cliente notificado.')
        fetchAppointment(token, appointmentId)
      }
    } catch (error) {
      console.error('Error updating status:', error)
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
                onClick={() => router.push(`/admin/appointments/${appointmentId}/edit`)}
                className="bg-[#C9A574] hover:bg-[#B8935E]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
            
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Calendar className="h-6 w-6 text-[#C9A574]" />
                      <div>
                        <p className="text-sm text-gray-600">Data</p>
                        <p className="font-semibold text-lg">
                          {new Date(appointment.startTime).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            weekday: 'long'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <Clock className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Horário</p>
                        <p className="font-semibold text-lg">
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
                    <p className="text-gray-700">{appointment.location}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                    >
                      🗺️ Abrir no Google Maps
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

              {/* Actions */}
              {appointment.status !== 'CONCLUIDO' && appointment.status !== 'CANCELADO' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {appointment.status === 'AGENDADO' && (
                        <Button
                          onClick={() => handleUpdateStatus('CONFIRMADO')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === 'CONFIRMADO' && (
                        <Button
                          onClick={() => handleUpdateStatus('CONCLUIDO')}
                          className="flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Concluído
                        </Button>
                      )}
                      <Button
                        onClick={() => handleUpdateStatus('CANCELADO')}
                        variant="outline"
                        className="flex-1 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-semibold">{appointment.client.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{appointment.client.email}</span>
                  </div>
                  {appointment.client.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{appointment.client.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                    <Badge>{appointment.project.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => router.push(`/admin/projects/${appointment.project.id}`)}
                    >
                      Ver Projeto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Criado em</p>
                    <p className="font-medium">{formatDate(appointment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Última atualização</p>
                    <p className="font-medium">{formatDate(appointment.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Info */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-blue-900">📬 Notificações</h3>
                  <p className="text-sm text-blue-800">
                    O cliente foi notificado por email e WhatsApp (se configurado).
                  </p>
                  <p className="mt-2 text-xs text-blue-700">
                    Lembretes automáticos são enviados 24h antes do compromisso.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
