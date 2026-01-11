'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ClientBudgetsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState<any[]>([])

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

    fetchBudgets(token)
  }, [router])

  const fetchBudgets = async (token: string) => {
    try {
      const res = await fetch('/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setBudgets(data.budgets || [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (budgetId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const budget = budgets.find(b => b.id === budgetId)
    if (!budget) return

    if (!confirm(`✅ APROVAR ORÇAMENTO\n\n"${budget.title}"\n\nValor: ${formatCurrency(budget.totalValue)}\n\nAo aprovar, você autoriza o início do trabalho conforme este orçamento.\n\nDeseja continuar?`)) {
      return
    }

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
        alert('✅ Orçamento aprovado com sucesso!\n\nA equipe foi notificada e em breve entrará em contato para dar início ao projeto.')
        fetchBudgets(token)
      } else {
        alert('❌ Erro ao aprovar orçamento')
      }
    } catch (error) {
      console.error('Error approving budget:', error)
      alert('❌ Erro ao aprovar orçamento')
    }
  }

  const handleReject = async (budgetId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const budget = budgets.find(b => b.id === budgetId)
    if (!budget) return

    const reason = prompt(`❌ REJEITAR ORÇAMENTO\n\n"${budget.title}"\n\nPor favor, informe o motivo da rejeição (opcional):`)
    
    if (reason === null) return // Cancelou

    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'REJEITADO',
          notes: reason ? `Motivo da rejeição: ${reason}` : undefined
        })
      })

      if (res.ok) {
        alert('Orçamento rejeitado.\n\nA equipe foi notificada e entrará em contato para revisar a proposta.')
        fetchBudgets(token)
      } else {
        alert('❌ Erro ao rejeitar orçamento')
      }
    } catch (error) {
      console.error('Error rejecting budget:', error)
      alert('❌ Erro ao rejeitar orçamento')
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="CLIENT" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meus Orçamentos</h1>
            <p className="text-gray-600">Visualize e aprove seus orçamentos</p>
          </div>

          <div className="space-y-4">
            {budgets.map((budget) => (
              <Card 
                key={budget.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/client/budgets/${budget.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{budget.title}</h3>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status}
                        </Badge>
                      </div>

                      {budget.description && (
                        <p className="mb-4 text-gray-600">{budget.description}</p>
                      )}

                      <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <p className="font-medium">{budget.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Válido até:</span>
                          <p className="font-medium">{formatDate(budget.validUntil)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Criado em:</span>
                          <p className="font-medium">{formatDate(budget.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="mb-2 font-semibold">Itens do Orçamento:</h4>
                        <div className="space-y-2">
                          {budget.items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.description}</span>
                              <span className="font-medium">
                                {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                              </span>
                            </div>
                          ))}
                          {budget.items.length > 3 && (
                            <p className="text-sm text-gray-500">
                              + {budget.items.length - 3} itens...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="text-3xl font-bold text-[#C9A574]">
                          {formatCurrency(budget.totalValue)}
                        </p>
                      </div>

                      {budget.status === 'ENVIADO' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApprove(budget.id)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReject(budget.id)
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {budgets.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p>Nenhum orçamento disponível</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
