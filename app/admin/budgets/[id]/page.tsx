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
  Edit,
  User,
  Calendar,
  FileText,
  FolderKanban,
  Download,
  Printer
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ViewBudgetPage({ params }: { params: Promise<{ id: string }> }) {
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
    if (userData.role !== 'ADMIN') {
      router.push('/client/dashboard')
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
        router.push('/admin/budgets')
      }
    } catch (error) {
      console.error('Error fetching budget:', error)
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

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // O navegador permite salvar como PDF na janela de impressão
    window.print()
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      
      <div className="ml-64 flex-1">
        <Header />
        
        <main className="p-8">
          {/* Cabeçalho para impressão (só aparece ao imprimir) */}
          <div className="hidden print:block mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-[#C9A574] mb-2">GÊMEAS ENGENHARIA</h1>
              <p className="text-gray-600">Orçamento e Proposta Comercial</p>
            </div>
            <div className="border-t-2 border-b-2 border-[#C9A574] py-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Orçamento: {budget?.title}</p>
                  <p className="text-gray-600">Tipo: {budget?.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Data: {formatDate(new Date())}</p>
                  <p className="font-semibold text-[#C9A574]">Status: {budget?.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 no-print">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <Button
                onClick={() => router.push(`/admin/budgets/${budgetId}/edit`)}
                className="bg-[#C9A574] hover:bg-[#B8935E]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Orçamento
              </Button>

              <Button
                onClick={handlePrint}
                variant="outline"
                className="border-[#C9A574] text-[#C9A574] hover:bg-[#C9A574] hover:text-white"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>

              <Button
                onClick={handleExportPDF}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{budget.title}</h1>
                <p className="text-gray-600">{budget.type}</p>
              </div>
              <Badge className={getStatusColor(budget.status)}>
                {budget.status}
              </Badge>
            </div>
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
                        {budget.items.map((item: any, index: number) => (
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
                          <td colSpan={4} className="pt-3 text-right font-bold">
                            VALOR TOTAL:
                          </td>
                          <td className="pt-3 text-right text-xl font-bold text-[#C9A574]">
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-semibold">{budget.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm">{budget.client.email}</p>
                  </div>
                  {budget.client.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="text-sm">{budget.client.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project */}
              {budget.project && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      Projeto Vinculado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">{budget.project.title}</p>
                    <Badge variant="outline">{budget.project.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => router.push(`/admin/projects/${budget.project.id}`)}
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
                    <p className="font-medium">{formatDate(budget.validUntil)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total de Itens</p>
                    <p className="font-medium">{budget.items.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Rodapé para impressão (só aparece ao imprimir) */}
          <div className="hidden print:block mt-12 pt-4 border-t border-gray-300">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <p className="font-semibold">GÊMEAS ENGENHARIA</p>
                <p>Soluções em Construção Civil</p>
              </div>
              <div className="text-right">
                <p>Orçamento gerado em: {formatDate(new Date())}</p>
                <p>Válido até: {formatDate(budget.validUntil)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
              <p>Os valores estão sujeitos a alteração sem aviso prévio após o período de validade.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
