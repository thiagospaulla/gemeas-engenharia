'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Search, Loader2, Plus, X } from 'lucide-react'
import { formatCEP, removeMask, fetchAddressByCEP } from '@/lib/validators'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCEP, setLoadingCEP] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [propertyCodes, setPropertyCodes] = useState<string[]>([''])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RESIDENCIAL',
    clientId: '',
    estimatedBudget: '',
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

    fetchClients(token)
  }, [router])

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

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value)
    setFormData({ ...formData, zipCode: formatted })
    
    // Auto-busca quando CEP estiver completo
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
    // Apenas números, máximo 16 dígitos
    newCodes[index] = value.replace(/\D/g, '').substring(0, 16)
    setPropertyCodes(newCodes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      // Filtrar códigos de imóvel vazios
      const validPropertyCodes = propertyCodes.filter(code => code.trim().length > 0)

      const projectData = {
        ...formData,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        zipCode: removeMask(formData.zipCode) || null,
        propertyCodes: validPropertyCodes
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      })

      if (res.ok) {
        const data = await res.json()
        alert('Projeto criado com sucesso!')
        router.push(`/admin/projects/${data.project.id}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao criar projeto')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Erro ao criar projeto')
    } finally {
      setLoading(false)
    }
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
            
            <h1 className="text-3xl font-bold text-gray-900">Novo Projeto</h1>
            <p className="text-gray-600">Crie um novo projeto de engenharia</p>
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
                        placeholder="Ex: Casa Residencial - João Silva"
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
                        placeholder="Descreva os detalhes do projeto..."
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                              {client.name} - {client.email}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

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
                          placeholder="150000.00"
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
                          placeholder="120.50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                    </div>
                  </CardContent>
                </Card>

                {/* Localização */}
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
                        Digite o CEP e buscaremos o endereço automaticamente
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
                        placeholder="Apto 45, Bloco B, Andar 3, etc."
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

                {/* Códigos de Imóvel */}
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
                              {code.length} de 16 dígitos
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
                      💡 Códigos de matrícula do cartório de registro de imóveis (geralmente 16 dígitos). 
                      Podem começar com zero.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.title && (
                      <div>
                        <p className="text-gray-600">Título</p>
                        <p className="font-medium">{formData.title}</p>
                      </div>
                    )}
                    {formData.clientId && (
                      <div>
                        <p className="text-gray-600">Cliente</p>
                        <p className="font-medium">
                          {clients.find(c => c.id === formData.clientId)?.name || 'Selecionado'}
                        </p>
                      </div>
                    )}
                    {formData.type && (
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-medium">{formData.type}</p>
                      </div>
                    )}
                    {formData.estimatedBudget && (
                      <div>
                        <p className="text-gray-600">Orçamento</p>
                        <p className="font-medium">
                          R$ {parseFloat(formData.estimatedBudget).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                      </div>
                    )}
                    {formData.area && (
                      <div>
                        <p className="text-gray-600">Área</p>
                        <p className="font-medium">{formData.area} m²</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

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
                          Criando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Criar Projeto
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Digite o CEP para buscar o endereço</li>
                      <li>• Códigos de imóvel começando com 0 são preservados</li>
                      <li>• Você pode adicionar múltiplos códigos de matrícula</li>
                      <li>• Todos os campos de localização são opcionais</li>
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
