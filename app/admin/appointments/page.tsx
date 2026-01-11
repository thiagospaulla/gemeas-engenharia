'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminAppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])

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

    fetchAppointments(token)
  }, [router])

  const fetchAppointments = async (token: string) => {
    try {
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
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

  const getStatusLabel = (status: string) => {
    const labels: any = {
      AGENDADO: 'Agendado',
      CONFIRMADO: 'Confirmado',
      CONCLUIDO: 'Concluído',
      CANCELADO: 'Cancelado'
    }
    return labels[status] || status
  }

  const handleConfirm = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CONFIRMADO' })
      })
      fetchAppointments(token)
    } catch (error) {
      console.error('Error confirming appointment:', error)
    }
  }

  const handleComplete = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CONCLUIDO' })
      })
      fetchAppointments(token)
    } catch (error) {
      console.error('Error completing appointment:', error)
    }
  }

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'AGENDADO').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMADO').length,
    completed: appointments.filter(a => a.status === 'CONCLUIDO').length
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
              <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600">Gerencie compromissos e agendamentos</p>
            </div>
            <Button onClick={() => router.push('/admin/appointments/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Agendados
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.scheduled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Confirmados
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.confirmed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Concluídos
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>Todos os Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {appointment.client.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(appointment.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(appointment.startTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {new Date(appointment.endTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {appointment.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.location}
                          </span>
                        )}
                      </div>
                      {appointment.description && (
                        <p className="mt-2 text-sm text-gray-600">{appointment.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {appointment.status === 'AGENDADO' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(appointment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === 'CONFIRMADO' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(appointment.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>Nenhum agendamento cadastrado</p>
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
