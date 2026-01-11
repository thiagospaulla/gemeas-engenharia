'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, Calendar as CalendarIcon, Clock, MapPin, Mail, Phone } from 'lucide-react'

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedClient = searchParams.get('client')
  
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [sendNotifications, setSendNotifications] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Reunião',
    clientId: preSelectedClient || '',
    projectId: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
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

    fetchClients(token)
  }, [router])

  useEffect(() => {
    if (formData.clientId) {
      const token = localStorage.getItem('token')
      const client = clients.find(c => c.id === formData.clientId)
      setSelectedClient(client)
      
      if (token) {
        fetchClientProjects(token, formData.clientId)
      }
    } else {
      setProjects([])
      setSelectedClient(null)
      setFormData(prev => ({ ...prev, projectId: '' }))
    }
  }, [formData.clientId, clients])

  const fetchClients = async (token: string) => {
    try {
      const res = await fetch('/api/users?role=CLIENT', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClients(data.users || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchClientProjects = async (token: string, clientId: string) => {
    try {
      const res = await fetch(`/api/projects?clientId=${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const validateTimes = (): boolean => {
    if (!formData.startTime || !formData.endTime) {
      alert('Defina os horários de início e término!')
      return false
    }

    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)

    if (end <= start) {
      alert('O horário de término deve ser posterior ao início!')
      return false
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60) // minutos
    if (duration < 15) {
      alert('O agendamento deve ter no mínimo 15 minutos!')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateTimes()) return

    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const appointmentData = {
        ...formData,
        projectId: formData.projectId || null,
        sendNotifications // Informar se deve enviar notificações
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      })

      if (res.ok) {
        const data = await res.json()
        const notificationMsg = sendNotifications 
          ? '\n\n📧 Email e 📱 WhatsApp foram enviados ao cliente!'
          : ''
        
        alert(`✅ Agendamento criado com sucesso!${notificationMsg}`)
        router.push('/admin/appointments')
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao criar agendamento')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Erro ao criar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const suggestEndTime = (startTime: string) => {
    if (!startTime) return ''
    const start = new Date(startTime)
    start.setHours(start.getHours() + 1) // Padrão: 1 hora
    return start.toISOString().slice(0, 16)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
            <p className="text-gray-600">Agende um compromisso com o cliente</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Agendamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Título *
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Reunião de alinhamento do projeto"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descreva o objetivo do compromisso..."
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tipo de Compromisso *
                        </label>
                        <select
                          required
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          <option value="Reunião">📋 Reunião</option>
                          <option value="Visita Técnica">🔍 Visita Técnica</option>
                          <option value="Vistoria">✅ Vistoria</option>
                          <option value="Entrega">📦 Entrega</option>
                          <option value="Medição">📏 Medição</option>
                          <option value="Assinatura">✍️ Assinatura de Documentos</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Cliente *
                        </label>
                        <select
                          required
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.clientId}
                          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        >
                          <option value="">Selecione um cliente</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Vincular a Projeto (Opcional)
                      </label>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        disabled={!formData.clientId || projects.length === 0}
                      >
                        <option value="">Não vincular a projeto</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                      {formData.clientId && projects.length === 0 && (
                        <p className="mt-1 text-xs text-yellow-600">
                          ⚠️ Este cliente não tem projetos cadastrados
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Date & Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Data e Horário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Data e Hora de Início *
                        </label>
                        <Input
                          required
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              startTime: e.target.value,
                              endTime: formData.endTime || suggestEndTime(e.target.value)
                            })
                          }}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Data e Hora de Término *
                        </label>
                        <Input
                          required
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    {formData.startTime && formData.endTime && (
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-900">
                          ⏱️ Duração: {calculateDuration(formData.startTime, formData.endTime)}
                        </p>
                      </div>
                    )}
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
                  <CardContent>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ex: Escritório - Av. Paulista, 1000"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      💡 Seja específico: nome do local + endereço completo
                    </p>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Informações adicionais, documentos necessários, preparações, etc."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Client Info */}
                {selectedClient && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Nome</p>
                        <p className="font-semibold">{selectedClient.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedClient.email}</span>
                      </div>
                      {selectedClient.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedClient.phone}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="sendNotifications"
                          checked={sendNotifications}
                          onChange={(e) => setSendNotifications(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C9A574] focus:ring-[#C9A574]"
                        />
                        <label htmlFor="sendNotifications" className="text-sm">
                          <span className="font-medium text-gray-700">Enviar notificações automáticas</span>
                          <p className="mt-1 text-xs text-gray-500">
                            O cliente receberá confirmação por:
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-600">
                              📧 Email: {selectedClient?.email || 'Selecione um cliente'}
                            </p>
                            {selectedClient?.phone && (
                              <p className="text-xs text-gray-600">
                                📱 WhatsApp: {selectedClient.phone}
                              </p>
                            )}
                          </div>
                        </label>
                      </div>

                      {sendNotifications && (
                        <div className="rounded-lg bg-green-50 p-3">
                          <p className="text-xs text-green-800">
                            ✅ Cliente receberá confirmação imediata e lembrete 24h antes do compromisso
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                {formData.title && formData.clientId && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Título</p>
                        <p className="font-medium">{formData.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-medium">{formData.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cliente</p>
                        <p className="font-medium">{selectedClient?.name}</p>
                      </div>
                      {formData.projectId && (
                        <div>
                          <p className="text-gray-600">Projeto</p>
                          <p className="font-medium">
                            {projects.find(p => p.id === formData.projectId)?.title}
                          </p>
                        </div>
                      )}
                      {formData.startTime && (
                        <div>
                          <p className="text-gray-600">Quando</p>
                          <p className="font-medium">
                            {new Date(formData.startTime).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#C9A574] hover:bg-[#B8935E]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Agendando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Criar Agendamento
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Agende com antecedência de pelo menos 24h</li>
                      <li>• Defina local específico para evitar confusão</li>
                      <li>• Cliente receberá lembrete automático</li>
                      <li>• WhatsApp e Email enviados instantaneamente</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) {
    return `${diffMins} minutos`
  }
  
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  
  return mins > 0 ? `${hours}h ${mins}min` : `${hours} hora${hours > 1 ? 's' : ''}`
}
