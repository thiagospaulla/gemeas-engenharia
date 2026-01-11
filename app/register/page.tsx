'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          cpf: formData.cpf || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      // Save token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to client dashboard (new users are clients by default)
      router.push('/client/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Register Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-3xl font-bold text-[#C9A574]">
              <span className="text-4xl">🏢</span>
              <span>GÊMEAS</span>
            </div>
            <p className="text-gray-600">Sistema de Gestão de Projetos</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para se cadastrar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    CPF
                  </label>
                  <Input
                    type="text"
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Senha *
                  </label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirmar Senha *
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <a href="/login" className="font-medium text-[#C9A574] hover:underline">
                    Entrar
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-gray-500">
            * Campos obrigatórios
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2C3E50] to-[#34495E] p-12 text-white">
        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-5xl font-bold">
            Junte-se a <span className="text-[#C9A574]">Nós</span>
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Gerencie seus projetos arquitetônicos de forma simples e eficiente
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A574] text-2xl">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Acompanhamento em Tempo Real</h3>
                <p className="text-gray-300">
                  Visualize o progresso dos seus projetos a qualquer momento
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A574] text-2xl">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Documentos Centralizados</h3>
                <p className="text-gray-300">
                  Acesse plantas, contratos e relatórios em um só lugar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A574] text-2xl">
                ✓
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Comunicação Direta</h3>
                <p className="text-gray-300">
                  Mantenha contato direto com a equipe do projeto
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

