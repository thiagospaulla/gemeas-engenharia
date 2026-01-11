'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/client/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
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
              <CardTitle>Entrar na Plataforma</CardTitle>
              <CardDescription>
                Digite suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <a href="/register" className="font-medium text-[#C9A574] hover:underline">
                    Cadastre-se
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Credenciais de teste:</p>
            <p>Admin: admin@gemeas.com / admin123</p>
            <p>Cliente: cliente@email.com / cliente123</p>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2C3E50] to-[#34495E] p-12 text-white">
        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-5xl font-bold">
            Transformando <span className="text-[#C9A574]">Sonhos</span>
            <br />
            em <span className="text-[#C9A574]">Realidade</span>
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Projetos arquitetônicos inovadores e sustentáveis que elevam
            o padrão de qualidade e design
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 text-3xl font-bold text-[#C9A574]">1500+</div>
              <div className="text-sm text-gray-300">Projetos Entregues</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 text-3xl font-bold text-[#C9A574]">5+</div>
              <div className="text-sm text-gray-300">Anos de Experiência</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 text-3xl font-bold text-[#C9A574]">100%</div>
              <div className="text-sm text-gray-300">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

