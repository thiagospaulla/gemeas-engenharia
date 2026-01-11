'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Briefcase, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const roleOptions = [
  { value: 'ENGENHEIRO', label: 'Engenheiro' },
  { value: 'ARQUITETO', label: 'Arquiteto' },
  { value: 'MESTRE_OBRAS', label: 'Mestre de Obras' },
  { value: 'PEDREIRO', label: 'Pedreiro' },
  { value: 'ELETRICISTA', label: 'Eletricista' },
  { value: 'ENCANADOR', label: 'Encanador' },
  { value: 'PINTOR', label: 'Pintor' },
  { value: 'CARPINTEIRO', label: 'Carpinteiro' },
  { value: 'SERVENTE', label: 'Servente' },
  { value: 'OUTRO', label: 'Outro' },
]

const statusOptions = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'FERIAS', label: 'Férias' },
  { value: 'AFASTADO', label: 'Afastado' },
]

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const projectStatusLabels: Record<string, string> = {
  ORCAMENTO: 'Orçamento',
  EM_ANDAMENTO: 'Em Andamento',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado'
}

const projectStatusColors: Record<string, string> = {
  ORCAMENTO: 'bg-gray-100 text-gray-800',
  EM_ANDAMENTO: 'bg-blue-100 text-blue-800',
  PAUSADO: 'bg-yellow-100 text-yellow-800',
  CONCLUIDO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800'
}

interface ProjectAssignment {
  id: string
  startDate: string
  endDate: string | null
  role: string
  project: {
    id: string
    title: string
    status: string
    type: string
    address: string | null
    city: string | null
    state: string | null
  }
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [projectAssignments, setProjectAssignments] = useState<ProjectAssignment[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    role: 'PEDREIRO',
    status: 'ATIVO',
    specialization: '',
    hourlyRate: '',
    dailyRate: '',
    hireDate: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  })

  useEffect(() => {
    if (id) {
      fetchTeamMember()
    }
  }, [id])

  const fetchTeamMember = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/team/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar membro')
      }

      const data = await response.json()
      
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: formatPhone(data.phone || ''),
        cpf: formatCPF(data.cpf || ''),
        role: data.role || 'PEDREIRO',
        status: data.status || 'ATIVO',
        specialization: data.specialization || '',
        hourlyRate: data.hourlyRate?.toString() || '',
        dailyRate: data.dailyRate?.toString() || '',
        hireDate: data.hireDate ? new Date(data.hireDate).toISOString().split('T')[0] : '',
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: formatZipCode(data.zipCode || ''),
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: formatPhone(data.emergencyPhone || ''),
        notes: data.notes || '',
      })

      setProjectAssignments(data.projectAssignments || [])
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao carregar dados do membro')
      router.push('/admin/team')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({ ...prev, cpf: formatted }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, [e.target.name]: formatted }))
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value)
    setFormData(prev => ({ ...prev, zipCode: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      
      const submitData = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        emergencyPhone: formData.emergencyPhone.replace(/\D/g, ''),
        zipCode: formData.zipCode.replace(/\D/g, ''),
        email: formData.email || null,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
        birthDate: formData.birthDate || null,
      }

      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar membro')
      }

      alert('Membro atualizado com sucesso!')
      router.push('/admin/team')
    } catch (error: any) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao atualizar membro')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${formData.name}?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao excluir membro')
      }

      alert('Membro excluído com sucesso!')
      router.push('/admin/team')
    } catch (error: any) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao excluir membro')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#C9A574]"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/team"
            className="mb-4 inline-flex items-center text-[#C9A574] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Equipe
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Membro
              </h1>
              <p className="mt-2 text-gray-600">
                Atualize os dados do membro da equipe
              </p>
            </div>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Membro
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Informações Básicas */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Informações Básicas
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      CPF *
                    </label>
                    <Input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      required
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Data de Nascimento
                    </label>
                    <Input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Telefone *
                    </label>
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      maxLength={15}
                    />
                  </div>
                </div>
              </Card>

              {/* Informações Profissionais */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Informações Profissionais
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Função *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Especialização
                    </label>
                    <Input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Data de Contratação *
                    </label>
                    <Input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Valor por Hora (R$)
                    </label>
                    <Input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Valor da Diária (R$)
                    </label>
                    <Input
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </Card>

              {/* Endereço */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Endereço
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      CEP
                    </label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleZipCodeChange}
                      maxLength={9}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                    >
                      <option value="">Selecione</option>
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              {/* Contato de Emergência */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Contato de Emergência
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nome do Contato
                    </label>
                    <Input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Telefone de Emergência
                    </label>
                    <Input
                      type="text"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handlePhoneChange}
                      maxLength={15}
                    />
                  </div>
                </div>
              </Card>

              {/* Observações */}
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Observações
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                />
              </Card>

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#C9A574] hover:bg-[#B8956A]"
                >
                  {saving ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link href="/admin/team" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* Sidebar - Projetos */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Projetos
                </h2>
                <Button
                  size="sm"
                  className="bg-[#C9A574] hover:bg-[#B8956A]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {projectAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Nenhum projeto atribuído
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-gray-900">
                          {assignment.project.title}
                        </h3>
                        <Badge className={projectStatusColors[assignment.project.status]}>
                          {projectStatusLabels[assignment.project.status]}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        {assignment.role}
                      </p>
                      <div className="text-xs text-gray-500">
                        <p>
                          Início: {format(new Date(assignment.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                        {assignment.endDate && (
                          <p>
                            Fim: {format(new Date(assignment.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
