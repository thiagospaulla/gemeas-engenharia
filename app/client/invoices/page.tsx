'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ClientInvoicesPage() {
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
    if (userData.role !== 'CLIENT') {
      router.push('/admin/dashboard')
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

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter(i => i.status === 'PAGO').reduce((sum, i) => sum + i.amount, 0),
    pending: invoices.filter(i => i.status === 'PENDENTE').reduce((sum, i) => sum + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'ATRASADO').length
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
            <h1 className="text-3xl font-bold text-gray-900">Minhas Faturas</h1>
            <p className="text-gray-600">Acompanhe suas faturas e pagamentos</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Faturas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.total)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.paid)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pendente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pending)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>

                      {invoice.description && (
                        <p className="mb-3 text-gray-600">{invoice.description}</p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Emissão: {formatDate(invoice.issueDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Vencimento: {formatDate(invoice.dueDate)}
                        </span>
                        {invoice.paidDate && (
                          <span className="flex items-center gap-1 text-green-600">
                            Pago em: {formatDate(invoice.paidDate)}
                          </span>
                        )}
                      </div>

                      {invoice.status === 'ATRASADO' && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Esta fatura está atrasada</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#C9A574]">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {invoices.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p>Nenhuma fatura cadastrada</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
