'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Search, Loader2, Plus, X } from 'lucide-react'
import { formatCEP, removeMask, fetchAddressByCEP } from '@/lib/validators'

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingCEP, setLoadingCEP] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const { id: projectId } = use(params) // Next.js 16: Unwrap params com React.use()
  const [propertyCodes, setPropertyCodes] = useState<string[]>([''])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    currentPhase: '',
    clientId: '',
    estimatedBudget: '',
    actualBudget: '',
    progress: '0',
    startDate: '',
    endDate: '',
    zipCode: '',
    address: '',
    complement: '',
    city: '',
    state: '',
    area: ''
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

    if (projectId) {
      fetchData(token, projectId)
    }
  }, [projectId, router])

  const fetchData = async (token: string, id: string) => {
    try {
      console.log('Fetching project for edit, ID:', id)
      
      const [projectRes, clientsRes] = await Promise.all([
        fetch(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/users?role=CLIENT', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      console.log('Project response status:', projectRes.status)
      
      const projectData = await projectRes.json()
      const clientsData = await clientsRes.json()

      console.log('Project data received:', projectData)

      const project = projectData.project
      
      if (!project) {
        console.error('No project found')
        alert('Projeto não encontrado')
        router.push('/admin/projects')
        return
      }

      setFormData({
        title: project.title || '',
        description: project.description || '',
        type: project.type || '',
        status: project.status || '',
        currentPhase: project.currentPhase || '',
        clientId: project.clientId || '',
        estimatedBudget: project.estimatedBudget?.toString() || '',
        actualBudget: project.actualBudget?.toString() || '',
        progress: project.progress?.toString() || '0',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        zipCode: project.zipCode ? formatCEP(project.zipCode) : '',
        address: project.address || '',
        complement: project.complement || '',
        city: project.city || '',
        state: project.state || '',
        area: project.area?.toString() || ''
      })

      setPropertyCodes(project.propertyCodes?.length > 0 ? project.propertyCodes : [''])
      setClients(clientsData.users || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value)
    setFormData({ ...formData, zipCode: formatted })
    
    const cleanCEP = removeMask(formatted)
    if (cleanCEP.length === 8) {
      searchCEP(cleanCEP)
    }
  }

  const searchCEP = async (cep: string) => {
    setLoadingCEP(true)
    try {
      const address = await fetchAddressByCEP(cep)
      if (address) {
        setFormData(prev => ({
          ...prev,
          address: address.logradouro || prev.address,
          city: address.localidade || prev.city,
          state: address.uf || prev.state
        }))
      } else {
        alert('CEP não encontrado')
      }
    } catch (error) {
      console.error('Error fetching CEP:', error)
    } finally {
      setLoadingCEP(false)
    }
  }

  const addPropertyCode = () => {
    setPropertyCodes([...propertyCodes, ''])
  }

  const removePropertyCode = (index: number) => {
    setPropertyCodes(propertyCodes.filter((_, i) => i !== index))
  }

  const updatePropertyCode = (index: number, value: string) => {
    const newCodes = [...propertyCodes]
    newCodes[index] = value.replace(/\D/g, '').substring(0, 16)
    setPropertyCodes(newCodes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const validPropertyCodes = propertyCodes.filter(code => code.trim().length > 0)

      const updateData = {
        ...formData,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        actualBudget: formData.actualBudget ? parseFloat(formData.actualBudget) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        progress: parseInt(formData.progress),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        currentPhase: formData.currentPhase || null,
        zipCode: removeMask(formData.zipCode) || null,
        propertyCodes: validPropertyCodes
      }

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (res.ok) {
        alert('Projeto atualizado com sucesso!')
        router.push(`/admin/projects/${projectId}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao atualizar projeto')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Erro ao atualizar projeto')
    } finally {
      setSaving(false)
    }
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
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">Editar Projeto</h1>
            <p className="text-gray-600">Atualize as informações do projeto</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Principais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Título do Projeto *
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tipo de Obra *
                        </label>
                        <select
                          required
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          <option value="RESIDENCIAL">Residencial</option>
                          <option value="COMERCIAL">Comercial</option>
                          <option value="INDUSTRIAL">Industrial</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Status *
                        </label>
                        <select
                          required
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="ORCAMENTO">Orçamento</option>
                          <option value="EM_ANDAMENTO">Em Andamento</option>
                          <option value="PAUSADO">Pausado</option>
                          <option value="CONCLUIDO">Concluído</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Fase Atual
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.currentPhase}
                          onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value })}
                        >
                          <option value="">Selecione</option>
                          <option value="PLANEJAMENTO">Planejamento</option>
                          <option value="FUNDACAO">Fundação</option>
                          <option value="ESTRUTURA">Estrutura</option>
                          <option value="ALVENARIA">Alvenaria</option>
                          <option value="INSTALACOES">Instalações</option>
                          <option value="ACABAMENTO">Acabamento</option>
                          <option value="FINALIZACAO">Finalização</option>
                        </select>
                      </div>
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
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {client.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Orçamento e Progresso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Orçamento Estimado (R$)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.estimatedBudget}
                          onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Orçamento Real (R$)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.actualBudget}
                          onChange={(e) => setFormData({ ...formData, actualBudget: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Progresso: {formData.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                        className="w-full accent-[#C9A574]"
                      />
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-[#C9A574]"
                          style={{ width: `${formData.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Data de Início
                        </label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Previsão de Término
                        </label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Área (m²)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Localização da Obra</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        CEP
                      </label>
                      <div className="relative">
                        {loadingCEP ? (
                          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#C9A574]" />
                        ) : (
                          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        )}
                        <Input
                          value={formData.zipCode}
                          onChange={(e) => handleCEPChange(e.target.value)}
                          placeholder="00000-000"
                          className="pr-10"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Digite o CEP para buscar o endereço automaticamente
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Endereço (Rua, Número, Bairro)
                      </label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Rua Exemplo, 123 - Bairro Centro"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <Input
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        placeholder="Casa, Terreno, Lote 10, etc."
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Cidade
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="São Paulo"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Estado (UF)
                        </label>
                        <Input
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Códigos de Matrícula do Imóvel (Opcional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {propertyCodes.map((code, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={code}
                            onChange={(e) => updatePropertyCode(index, e.target.value)}
                            placeholder="0000000000000000 (16 dígitos)"
                            maxLength={16}
                          />
                          {code && (
                            <p className="mt-1 text-xs text-gray-500">
                              {code.length} de 16 dígitos {code.length === 16 && '✅'}
                            </p>
                          )}
                        </div>
                        {propertyCodes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePropertyCode(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPropertyCode}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Outro Código
                    </Button>

                    <p className="text-xs text-gray-500">
                      💡 Códigos de matrícula do cartório de registro de imóveis. Podem começar com zero.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-[#C9A574] hover:bg-[#B8935E]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Use o CEP para buscar o endereço</li>
                      <li>• Códigos de imóvel: até 16 dígitos</li>
                      <li>• Números iniciados com 0 são preservados</li>
                      <li>• Adicione múltiplos códigos se necessário</li>
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
