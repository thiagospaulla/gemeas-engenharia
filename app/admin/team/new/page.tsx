'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

export default function NewTeamMemberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    hireDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      // Preparar dados para envio
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

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar membro')
      }

      alert('Membro criado com sucesso!')
      router.push('/admin/team')
    } catch (error: any) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao criar membro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/team"
            className="mb-4 inline-flex items-center text-[#C9A574] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Equipe
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Adicionar Novo Membro
          </h1>
          <p className="mt-2 text-gray-600">
            Preencha os dados do novo membro da equipe
          </p>
        </div>

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
                  placeholder="Nome completo do membro"
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
                  placeholder="000.000.000-00"
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
                  placeholder="email@exemplo.com"
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
                  placeholder="(00) 00000-0000"
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
                  placeholder="Ex: Instalações elétricas residenciais"
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
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="00000-000"
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
                  placeholder="Nome da cidade"
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
                  placeholder="Rua, número, bairro"
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
                  placeholder="Nome completo"
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
                  placeholder="(00) 00000-0000"
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
              placeholder="Informações adicionais sobre o membro..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
            />
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#C9A574] hover:bg-[#B8956A]"
            >
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Salvar Membro
                </>
              )}
            </Button>
            <Link href="/admin/team" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
