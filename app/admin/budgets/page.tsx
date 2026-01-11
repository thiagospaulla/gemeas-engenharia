'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  User
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminBudgetsPage() {
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
    if (userData.role !== 'ADMIN') {
      router.push('/client/dashboard')
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

  const getStatusLabel = (status: string) => {
    const labels: any = {
      RASCUNHO: 'Rascunho',
      ENVIADO: 'Enviado',
      APROVADO: 'Aprovado',
      REJEITADO: 'Rejeitado',
      EXPIRADO: 'Expirado'
    }
    return labels[status] || status
  }

  const stats = {
    total: budgets.length,
    approved: budgets.filter(b => b.status === 'APROVADO').length,
    pending: budgets.filter(b => b.status === 'ENVIADO').length,
    totalValue: budgets.reduce((sum, b) => sum + (b.totalValue || 0), 0)
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
              <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
              <p className="text-gray-600">Gerencie orçamentos e propostas</p>
            </div>
            <Button onClick={() => router.push('/admin/budgets/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Orçamentos
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Aprovados
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Aguardando
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Valor Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[#C9A574]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budgets List */}
          <Card>
            <CardHeader>
              <CardTitle>Todos os Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 hover:shadow-md cursor-pointer"
                    onClick={() => router.push(`/admin/budgets/${budget.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{budget.title}</h3>
                        <Badge className={getStatusColor(budget.status)}>
                          {getStatusLabel(budget.status)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {budget.client.name}
                        </span>
                        <span>Tipo: {budget.type}</span>
                        <span>Válido até: {formatDate(budget.validUntil)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#C9A574]">
                        {formatCurrency(budget.totalValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {budget.items.length} item(ns)
                      </div>
                    </div>
                  </div>
                ))}

                {budgets.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>Nenhum orçamento cadastrado</p>
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
