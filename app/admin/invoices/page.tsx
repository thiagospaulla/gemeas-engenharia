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
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  User,
  Calendar
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminInvoicesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])

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

    fetchInvoices(token)
  }, [router])

  const fetchInvoices = async (token: string) => {
    try {
      const res = await fetch('/api/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      PAGO: 'bg-green-100 text-green-800',
      ATRASADO: 'bg-red-100 text-red-800',
      CANCELADO: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      PENDENTE: 'Pendente',
      PAGO: 'Pago',
      ATRASADO: 'Atrasado',
      CANCELADO: 'Cancelado'
    }
    return labels[status] || status
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'PAGO').length,
    pending: invoices.filter(i => i.status === 'PENDENTE').length,
    overdue: invoices.filter(i => i.status === 'ATRASADO').length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
    paidAmount: invoices.filter(i => i.status === 'PAGO').reduce((sum, i) => sum + i.amount, 0)
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
              <h1 className="text-3xl font-bold text-gray-900">Faturamento</h1>
              <p className="text-gray-600">Gerencie faturas e pagamentos</p>
            </div>
            <Button onClick={() => router.push('/admin/invoices/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Valor Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalAmount)}
                </div>
                <p className="text-xs text-gray-500">{stats.total} faturas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Recebido
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.paidAmount)}
                </div>
                <p className="text-xs text-gray-500">{stats.paid} pagas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pendentes
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
                  Atrasadas
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {invoice.client.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Vencimento: {formatDate(invoice.dueDate)}
                        </span>
                        {invoice.paidDate && (
                          <span className="text-green-600">
                            Pago em: {formatDate(invoice.paidDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#C9A574]">
                        {formatCurrency(invoice.amount)}
                      </div>
                    </div>
                  </div>
                ))}

                {invoices.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p>Nenhuma fatura cadastrada</p>
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
