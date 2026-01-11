'use client'

import { useRouter } from 'next/navigation'
import { Building2, Users, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#34495E]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="%232C3E50"/%3E%3Cpath d="M0 0L50 50L100 0" fill="%23C9A574" opacity="0.1"/%3E%3C/svg%3E")'
          }}
        />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <Building2 className="h-16 w-16 text-[#C9A574]" />
            <h1 className="text-6xl font-bold text-white">
              GÊMEAS
              <span className="block text-4xl text-[#C9A574]">ENGENHARIA</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="mb-12 text-2xl text-gray-300">
            Transformando ideias em realidade através da engenharia de excelência
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push('/login')}
              className="w-64 bg-[#C9A574] py-6 text-lg font-semibold hover:bg-[#B8956A]"
            >
              Acessar Sistema
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-64 border-2 border-[#C9A574] py-6 text-lg font-semibold text-white hover:bg-[#C9A574] hover:text-white"
            >
              Criar Conta
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-[#C9A574]">15+</p>
              <p className="mt-2 text-gray-300">Anos de Experiência</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#C9A574]">200+</p>
              <p className="mt-2 text-gray-300">Projetos Concluídos</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#C9A574]">50+</p>
              <p className="mt-2 text-gray-300">Clientes Satisfeitos</p>
            </div>
      <div className="text-center">
              <p className="text-5xl font-bold text-[#C9A574]">100%</p>
              <p className="mt-2 text-gray-300">Compromisso</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-12 w-8 rounded-full border-2 border-[#C9A574] p-2">
            <div className="h-2 w-2 rounded-full bg-[#C9A574] animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#2C3E50]">
              Sobre a Gêmeas Engenharia
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Somos uma empresa de engenharia civil especializada em projetos residenciais e comerciais, 
              comprometida em entregar qualidade, inovação e excelência em cada obra.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="mb-4 flex justify-center">
                <Building2 className="h-16 w-16 text-[#C9A574]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#2C3E50]">
                Projetos Inovadores
              </h3>
              <p className="text-gray-600">
                Desenvolvemos projetos arquitetônicos modernos e funcionais, 
                adaptados às necessidades específicas de cada cliente.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="mb-4 flex justify-center">
                <Users className="h-16 w-16 text-[#C9A574]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#2C3E50]">
                Equipe Especializada
              </h3>
              <p className="text-gray-600">
                Nossa equipe é formada por engenheiros, arquitetos e profissionais 
                altamente qualificados com vasta experiência.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="mb-4 flex justify-center">
                <Award className="h-16 w-16 text-[#C9A574]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#2C3E50]">
                Excelência Garantida
              </h3>
              <p className="text-gray-600">
                Compromisso com prazos, qualidade superior e transparência 
                em todas as etapas do projeto.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#2C3E50]">
              Nossos Projetos
            </h2>
            <p className="text-lg text-gray-600">
              Conheça alguns dos projetos que realizamos com excelência
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#C9A574] to-[#B8956A]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Edifício Comercial</h3>
                  <p className="mt-2 text-sm">Projeto moderno com design arrojado</p>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#2C3E50] to-[#34495E]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Espaço Corporativo</h3>
                  <p className="mt-2 text-sm">Ambientes funcionais e elegantes</p>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#C9A574] to-[#2C3E50]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Residência de Luxo</h3>
                  <p className="mt-2 text-sm">Conforto e sofisticação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-[#2C3E50]">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-600">
              Soluções completas em engenharia civil
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-[#C9A574]" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-[#2C3E50]">
                  Projetos Arquitetônicos
                </h3>
                <p className="text-gray-600">
                  Desenvolvimento completo de projetos residenciais e comerciais
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-[#C9A574]" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-[#2C3E50]">
                  Gestão de Obras
                </h3>
                <p className="text-gray-600">
                  Acompanhamento completo desde o planejamento até a entrega
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-[#C9A574]" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-[#2C3E50]">
                  Consultoria Técnica
                </h3>
                <p className="text-gray-600">
                  Assessoria especializada para viabilidade e execução de projetos
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-[#C9A574]" />
              <div>
                <h3 className="mb-2 text-xl font-bold text-[#2C3E50]">
                  Regularização de Obras
                </h3>
                <p className="text-gray-600">
                  Suporte completo para licenças, alvarás e documentação
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#C9A574] to-[#B8956A] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Pronto para começar seu projeto?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Entre em contato conosco e transforme suas ideias em realidade
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push('/register')}
              className="w-64 bg-white py-6 text-lg font-semibold text-[#C9A574] hover:bg-gray-100"
            >
              Criar Conta Grátis
            </Button>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="w-64 border-2 border-white py-6 text-lg font-semibold text-white hover:bg-white/10"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-[#C9A574]" />
                <span className="text-2xl font-bold text-[#C9A574]">GÊMEAS</span>
              </div>
              <p className="text-gray-400">
                Engenharia de excelência para transformar seus projetos em realidade.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#C9A574]">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Projetos Arquitetônicos</li>
                <li>Gestão de Obras</li>
                <li>Consultoria Técnica</li>
                <li>Regularização</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#C9A574]">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>contato@gemeas.com.br</li>
                <li>(11) 99999-9999</li>
                <li>São Paulo - SP</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gêmeas Engenharia. Todos os direitos reservados.</p>
          </div>
      </div>
      </footer>
    </div>
  )
}
