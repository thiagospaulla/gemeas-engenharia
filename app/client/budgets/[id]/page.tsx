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
  CheckCircle,
  XCircle,
  Calendar,
  FolderKanban,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ClientViewBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState<any>(null)
  const { id: budgetId } = use(params)

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

    if (budgetId) {
      fetchBudget(token, budgetId)
    }
  }, [budgetId, router])

  const fetchBudget = async (token: string, id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (data.budget) {
        setBudget(data.budget)
      } else {
        alert('Orçamento não encontrado')
        router.push('/client/budgets')
      }
    } catch (error) {
      console.error('Error fetching budget:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm(`✅ APROVAR ORÇAMENTO\n\n"${budget.title}"\n\nValor: ${formatCurrency(budget.totalValue)}\n\nAo aprovar, você autoriza o início do trabalho.\n\nConfirmar?`)) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'APROVADO' })
      })

      if (res.ok) {
        alert('✅ Orçamento aprovado!\n\nA equipe foi notificada e em breve iniciará o trabalho.')
        router.push('/client/budgets')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Erro ao aprovar')
    }
  }

  const handleReject = async () => {
    const reason = prompt(`❌ REJEITAR ORÇAMENTO\n\n"${budget.title}"\n\nMotivo da rejeição (opcional):`)
    if (reason === null) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'REJEITADO',
          notes: reason ? `Motivo: ${reason}` : undefined
        })
      })

      if (res.ok) {
        alert('Orçamento rejeitado.\n\nA equipe foi notificada e entrará em contato.')
        router.push('/client/budgets')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Erro ao rejeitar')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      RASCUNHO: 'bg-gray-100 text-gray-800',
      ENVIADO: 'bg-blue-100 text-blue-800',
      APROVADO: 'bg-green-100 text-green-800',
      REJEITADO: 'bg-red-100 text-red-800',
      EXPIRADO: 'bg-orange-100 text-orange-800'
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

  if (!budget) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Orçamento não encontrado</p>
        </div>
      </div>
    )
  }

  const isExpired = new Date(budget.validUntil) < new Date()
  const canApprove = budget.status === 'ENVIADO' && !isExpired

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
                <h1 className="text-3xl font-bold text-gray-900">{budget.title}</h1>
                <p className="text-gray-600">{budget.type}</p>
              </div>
              <Badge className={getStatusColor(budget.status)}>
                {budget.status}
              </Badge>
            </div>

            {/* Alert for expired budget */}
            {isExpired && budget.status === 'ENVIADO' && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Este orçamento expirou. Entre em contato para solicitar atualização.</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {budget.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{budget.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                          <th className="pb-3 font-medium">Descrição</th>
                          <th className="pb-3 font-medium text-right">Qtd</th>
                          <th className="pb-3 font-medium">Un</th>
                          <th className="pb-3 font-medium text-right">Valor Unit.</th>
                          <th className="pb-3 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budget.items.map((item: any) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3">
                              <p className="font-medium">{item.description}</p>
                              <p className="text-xs text-gray-500">{item.category}</p>
                            </td>
                            <td className="py-3 text-right">{item.quantity}</td>
                            <td className="py-3">{item.unit}</td>
                            <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-3 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan={4} className="pt-4 text-right font-bold text-lg">
                            VALOR TOTAL:
                          </td>
                          <td className="pt-4 text-right text-2xl font-bold text-[#C9A574]">
                            {formatCurrency(budget.totalValue)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {budget.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">{budget.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {canApprove && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar Orçamento
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="outline"
                        className="flex-1 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project */}
              {budget.project && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">{budget.project.title}</p>
                    <Badge variant="outline">{budget.project.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => router.push(`/client/projects/${budget.project.id}`)}
                    >
                      Ver Projeto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Criado em</p>
                    <p className="font-medium">{formatDate(budget.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Válido até</p>
                    <p className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                      {formatDate(budget.validUntil)}
                      {isExpired && ' (Expirado)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total de Itens</p>
                    <p className="font-medium">{budget.items.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Valor Total</p>
                    <p className="text-lg font-bold text-[#C9A574]">
                      {formatCurrency(budget.totalValue)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {canApprove && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-green-900">✅ Ação Necessária</h3>
                    <p className="text-sm text-green-800">
                      Este orçamento está aguardando sua aprovação. Revise os itens e valores antes de decidir.
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
