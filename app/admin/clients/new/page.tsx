'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, User, Mail, Phone, MapPin, CreditCard, Search, Loader2 } from 'lucide-react'
import { 
  formatCPF, 
  formatCNPJ, 
  formatCEP, 
  formatPhone,
  validateCPF,
  validateCNPJ,
  removeMask,
  fetchAddressByCEP
} from '@/lib/validators'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCEP, setLoadingCEP] = useState(false)
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    document: '', // CPF ou CNPJ
    zipCode: '',
    address: '',
    complement: '',
    city: '',
    state: '',
    active: true
  })

  const handleDocumentChange = (value: string) => {
    const formatted = documentType === 'CPF' ? formatCPF(value) : formatCNPJ(value)
    setFormData({ ...formData, document: formatted })
  }

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: formatPhone(value) })
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

  const validateForm = (): boolean => {
    // Validar senhas
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!')
      return false
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!')
      return false
    }

    // Validar documento (CPF ou CNPJ)
    if (formData.document) {
      const cleanDoc = removeMask(formData.document)
      if (documentType === 'CPF') {
        if (cleanDoc.length === 11 && !validateCPF(formData.document)) {
          alert('CPF inválido!')
          return false
        }
      } else {
        if (cleanDoc.length === 14 && !validateCNPJ(formData.document)) {
          alert('CNPJ inválido!')
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const cleanDocument = removeMask(formData.document)
      
      const clientData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        cpf: documentType === 'CPF' && cleanDocument ? cleanDocument : undefined,
        cnpj: documentType === 'CNPJ' && cleanDocument ? cleanDocument : undefined,
        address: formData.address || undefined,
        complement: formData.complement || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: removeMask(formData.zipCode) || undefined,
        role: 'CLIENT',
        active: formData.active
      }

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      })

      const data = await res.json()

      if (res.ok) {
        alert('Cliente cadastrado com sucesso!')
        router.push('/admin/clients')
      } else {
        alert(data.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Erro ao criar cliente')
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
            
            <h1 className="text-3xl font-bold text-gray-900">Novo Cliente</h1>
            <p className="text-gray-600">Cadastre um novo cliente no sistema</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nome Completo *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="João da Silva Santos"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="joao@email.com"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="(11) 98765-4321"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Tipo de Documento
                      </label>
                      <div className="flex gap-4 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="documentType"
                            value="CPF"
                            checked={documentType === 'CPF'}
                            onChange={() => {
                              setDocumentType('CPF')
                              setFormData({ ...formData, document: '' })
                            }}
                            className="text-[#C9A574] focus:ring-[#C9A574]"
                          />
                          <span className="text-sm">CPF (Pessoa Física)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="documentType"
                            value="CNPJ"
                            checked={documentType === 'CNPJ'}
                            onChange={() => {
                              setDocumentType('CNPJ')
                              setFormData({ ...formData, document: '' })
                            }}
                            className="text-[#C9A574] focus:ring-[#C9A574]"
                          />
                          <span className="text-sm">CNPJ (Pessoa Jurídica)</span>
                        </label>
                      </div>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          value={formData.document}
                          onChange={(e) => handleDocumentChange(e.target.value)}
                          placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                          className="pl-10"
                        />
                      </div>
                      {formData.document && removeMask(formData.document).length > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          {documentType === 'CPF' 
                            ? (removeMask(formData.document).length === 11 && validateCPF(formData.document) ? '✅ CPF válido' : '❌ CPF inválido')
                            : (removeMask(formData.document).length === 14 && validateCNPJ(formData.document) ? '✅ CNPJ válido' : '❌ CNPJ inválido')
                          }
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </CardTitle>
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
                        Endereço (Rua, Avenida, etc)
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
                        placeholder="Apto 45, Bloco B, Sala 302, etc."
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Senha *
                      </label>
                      <Input
                        required
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Mínimo 6 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Confirmar Senha *
                      </label>
                      <Input
                        required
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Digite a senha novamente"
                        minLength={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status da Conta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#C9A574] focus:ring-[#C9A574]"
                      />
                      <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Ativar conta imediatamente
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Se marcado, o cliente poderá fazer login imediatamente.
                    </p>
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
                          Cadastrando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Cadastrar Cliente
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• CPF/CNPJ são validados automaticamente</li>
                      <li>• Digite o CEP para buscar o endereço</li>
                      <li>• Números iniciados com 0 são preservados</li>
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
