'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Plus, X, Loader2, Calculator } from 'lucide-react'

interface BudgetItem {
  id: string
  description: string
  quantity: string
  unit: string
  unitPrice: string
  totalPrice: number
  category: string
}

function NewBudgetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedClient = searchParams.get('client')
  
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', description: '', quantity: '', unit: 'un', unitPrice: '', totalPrice: 0, category: 'Material' }
  ])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RESIDENCIAL',
    clientId: preSelectedClient || '',
    projectId: '',
    validUntil: '',
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
      if (token) {
        fetchClientProjects(token, formData.clientId)
      }
    } else {
      setProjects([])
      setFormData(prev => ({ ...prev, projectId: '' }))
    }
  }, [formData.clientId])

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

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: '',
      unit: 'un',
      unitPrice: '',
      totalPrice: 0,
      category: 'Material'
    }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        
        // Calcular total do item
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = parseFloat(field === 'quantity' ? value : updated.quantity) || 0
          const price = parseFloat(field === 'unitPrice' ? value : updated.unitPrice) || 0
          updated.totalPrice = qty * price
        }
        
        return updated
      }
      return item
    }))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0 || items.every(item => !item.description)) {
      alert('Adicione pelo menos um item ao orçamento!')
      return
    }

    if (!formData.validUntil) {
      alert('Defina a data de validade do orçamento!')
      return
    }

    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const totalValue = calculateTotal()
      
      const budgetData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        clientId: formData.clientId,
        projectId: formData.projectId || null,
        validUntil: formData.validUntil,
        notes: formData.notes,
        totalValue,
        items: items
          .filter(item => item.description.trim() !== '')
          .map(item => ({
            description: item.description,
            quantity: parseFloat(item.quantity) || 0,
            unit: item.unit,
            unitPrice: parseFloat(item.unitPrice) || 0,
            totalPrice: item.totalPrice,
            category: item.category
          }))
      }

      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(budgetData)
      })

      if (res.ok) {
        alert('Orçamento criado com sucesso!')
        router.push('/admin/budgets')
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao criar orçamento')
      }
    } catch (error) {
      console.error('Error creating budget:', error)
      alert('Erro ao criar orçamento')
    } finally {
      setLoading(false)
    }
  }

  const totalValue = calculateTotal()

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
            
            <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
            <p className="text-gray-600">Crie um orçamento detalhado para o cliente</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Título do Orçamento *
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Orçamento Casa Residencial - João Silva"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrição geral do orçamento..."
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
                          Válido Até *
                        </label>
                        <Input
                          required
                          type="date"
                          value={formData.validUntil}
                          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        />
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
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {client.email}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Selecione o cliente para carregar seus projetos
                      </p>
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
                        <option value="">Não vincular a projeto específico</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title} - {project.status}
                          </option>
                        ))}
                      </select>
                      {formData.clientId && projects.length === 0 && (
                        <p className="mt-1 text-xs text-yellow-600">
                          ⚠️ Este cliente ainda não tem projetos cadastrados
                        </p>
                      )}
                      {!formData.clientId && (
                        <p className="mt-1 text-xs text-gray-500">
                          Selecione um cliente primeiro
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Itens do Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold text-gray-700">Item {index + 1}</h4>
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Descrição *
                            </label>
                            <Input
                              required
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Ex: Concreto estrutural 25 MPa"
                            />
                          </div>

                          <div className="grid gap-3 md:grid-cols-5">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Qtd *
                              </label>
                              <Input
                                required
                                type="number"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                placeholder="10"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Unidade
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                value={item.unit}
                                onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              >
                                <option value="un">un</option>
                                <option value="m²">m²</option>
                                <option value="m³">m³</option>
                                <option value="m">m</option>
                                <option value="kg">kg</option>
                                <option value="ton">ton</option>
                                <option value="hora">hora</option>
                                <option value="dia">dia</option>
                                <option value="mês">mês</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Valor Unit. *
                              </label>
                              <Input
                                required
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                placeholder="100.00"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Categoria
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                value={item.category}
                                onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                              >
                                <option value="Material">Material</option>
                                <option value="Mão de Obra">Mão de Obra</option>
                                <option value="Equipamento">Equipamento</option>
                                <option value="Serviço">Serviço</option>
                                <option value="Outros">Outros</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Total
                              </label>
                              <div className="flex h-10 items-center rounded-md border border-gray-300 bg-gray-50 px-3 text-sm font-semibold">
                                R$ {item.totalPrice.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addItem}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Item
                    </Button>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Observações adicionais, condições de pagamento, garantias, etc."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Total */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Valor Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Valor Total do Orçamento</p>
                      <p className="text-4xl font-bold text-[#C9A574]">
                        R$ {totalValue.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {items.filter(i => i.description).length} item(ns)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                {formData.clientId && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Cliente</p>
                        <p className="font-medium">
                          {clients.find(c => c.id === formData.clientId)?.name || 'Selecionado'}
                        </p>
                      </div>
                      {formData.projectId && (
                        <div>
                          <p className="text-gray-600">Projeto</p>
                          <p className="font-medium">
                            {projects.find(p => p.id === formData.projectId)?.title || 'Selecionado'}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-medium">{formData.type}</p>
                      </div>
                      {formData.validUntil && (
                        <div>
                          <p className="text-gray-600">Válido até</p>
                          <p className="font-medium">
                            {new Date(formData.validUntil).toLocaleDateString('pt-BR')}
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
                          Criando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Criar Orçamento
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Selecione o cliente para ver seus projetos</li>
                      <li>• Adicione quantos itens precisar</li>
                      <li>• O total é calculado automaticamente</li>
                      <li>• Vincular a projeto é opcional</li>
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

export default function NewBudgetPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#C9A574]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NewBudgetForm />
    </Suspense>
  )
}
