'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, Award, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const projects = [
  {
    title: 'Edifício AHAVA',
    description: 'Complexo comercial premium com design contemporâneo',
    gradient: 'from-amber-100 via-[#C9A574] to-amber-800',
    features: ['4 andares', 'Vista panorâmica', 'Acabamento premium']
  },
  {
    title: 'Espaço Revolução',
    description: 'Centro corporativo com tecnologia e sustentabilidade',
    gradient: 'from-slate-700 via-slate-900 to-black',
    features: ['Design inovador', 'Infraestrutura completa', 'Localização privilegiada']
  },
  {
    title: 'Galeria Comercial',
    description: 'Empreendimento comercial multiuso',
    gradient: 'from-stone-300 via-stone-500 to-stone-700',
    features: ['Lojas modernas', 'Estacionamento amplo', 'Área verde']
  },
  {
    title: 'Residência de Luxo',
    description: 'Projeto residencial exclusivo e sofisticado',
    gradient: 'from-amber-200 via-amber-400 to-amber-600',
    features: ['3 suítes', 'Área gourmet', 'Piscina e jardim']
  }
]

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#1a252f]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(201, 165, 116, 0.1) 35px,
              rgba(201, 165, 116, 0.1) 70px
            )`
          }} />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          {/* Logo with Animation */}
          <div className="mb-8 flex items-center justify-center gap-4 animate-fade-in">
            <div className="relative">
              <Building2 className="h-20 w-20 text-[#C9A574] animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
            </div>
            <h1 className="text-6xl font-bold text-white">
              GÊMEAS
              <span className="block text-5xl bg-gradient-to-r from-[#C9A574] to-[#E8D5B7] bg-clip-text text-transparent">
                ENGENHARIA
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="mb-4 text-3xl font-light text-gray-300">
            Transformando ideias em
          </p>
          <p className="mb-12 text-4xl font-bold bg-gradient-to-r from-[#C9A574] to-[#E8D5B7] bg-clip-text text-transparent">
            Obras de Excelência
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push('/login')}
              className="group w-72 bg-gradient-to-r from-[#C9A574] to-[#B8956A] py-7 text-xl font-semibold shadow-2xl hover:shadow-[#C9A574]/50 transition-all hover:scale-105"
            >
              Acessar Sistema
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className="w-72 border-2 border-[#C9A574] bg-transparent py-7 text-xl font-semibold text-white hover:bg-[#C9A574]/20 transition-all hover:scale-105"
            >
              Criar Conta Grátis
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-24 grid gap-8 md:grid-cols-4">
            {[
              { value: '15+', label: 'Anos de Experiência' },
              { value: '200+', label: 'Projetos Concluídos' },
              { value: '50+', label: 'Clientes Satisfeitos' },
              { value: '100%', label: 'Compromisso' }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform">
                <p className="text-6xl font-bold bg-gradient-to-r from-[#C9A574] to-[#E8D5B7] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-14 w-10 rounded-full border-2 border-[#C9A574] p-2">
            <div className="h-3 w-3 mx-auto rounded-full bg-[#C9A574] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Projects Carousel Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-[#2C3E50]">
              Nossos Projetos
            </h2>
            <p className="text-xl text-gray-600">
              Excelência em cada detalhe
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {projects.map((project, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className={`relative h-96 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                      {/* Project Content */}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10 text-center text-white px-6">
                        <Building2 className="h-24 w-24 mx-auto mb-6 drop-shadow-2xl" />
                        <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">
                          {project.title}
                        </h3>
                        <p className="text-xl mb-6 drop-shadow-lg">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {project.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl hover:bg-white transition-all hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-[#2C3E50]" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl hover:bg-white transition-all hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-[#2C3E50]" />
            </button>

            {/* Indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-12 bg-[#C9A574]' 
                      : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-[#2C3E50]">
              Por que escolher a Gêmeas?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Somos referência em engenharia civil, unindo tradição e inovação
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: 'Projetos Inovadores',
                description: 'Soluções arquitetônicas modernas e funcionais, adaptadas às suas necessidades'
              },
              {
                icon: Users,
                title: 'Equipe Especializada',
                description: 'Profissionais qualificados com anos de experiência no mercado'
              },
              {
                icon: Award,
                title: 'Excelência Garantida',
                description: 'Compromisso com qualidade, prazos e total transparência'
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="group p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-[#C9A574]"
              >
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-[#C9A574] to-[#B8956A] p-6 group-hover:scale-110 transition-transform">
                    <item.icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-[#2C3E50]">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-[#2C3E50]">
              Nossos Serviços
            </h2>
            <p className="text-xl text-gray-600">
              Soluções completas em engenharia civil
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Projetos Arquitetônicos',
                description: 'Desenvolvimento completo de projetos residenciais, comerciais e industriais'
              },
              {
                title: 'Gestão de Obras',
                description: 'Acompanhamento integral desde o planejamento até a entrega final'
              },
              {
                title: 'Consultoria Técnica',
                description: 'Assessoria especializada para viabilidade e execução de projetos'
              },
              {
                title: 'Regularização de Obras',
                description: 'Suporte completo para licenças, alvarás e toda documentação necessária'
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="group flex gap-4 rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-[#C9A574] hover:shadow-xl transition-all"
              >
                <CheckCircle className="h-7 w-7 flex-shrink-0 text-[#C9A574] group-hover:scale-125 transition-transform" />
                <div>
                  <h3 className="mb-2 text-xl font-bold text-[#2C3E50]">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#C9A574] via-[#B8956A] to-[#C9A574] py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white drop-shadow-lg">
            Pronto para começar seu projeto?
          </h2>
          <p className="mb-10 text-2xl text-white/95">
            Entre em contato e transforme suas ideias em realidade
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push('/register')}
              className="w-72 bg-white py-7 text-xl font-semibold text-[#C9A574] shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all"
            >
              Criar Conta Grátis
            </Button>
            <Button
              onClick={() => router.push('/login')}
              className="w-72 border-3 border-white bg-transparent py-7 text-xl font-semibold text-white hover:bg-white/20 hover:scale-105 transition-all"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-[#2C3E50]">
              Nossos Diferenciais
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Transparência Total',
                description: 'Acompanhe cada etapa da obra em tempo real através do nosso sistema'
              },
              {
                title: 'Tecnologia Avançada',
                description: 'Plataforma digital completa para gestão e acompanhamento de projetos'
              },
              {
                title: 'Suporte Personalizado',
                description: 'Equipe dedicada para atender suas necessidades em qualquer momento'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-[#C9A574] to-[#B8956A] p-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#2C3E50]">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Building2 className="h-10 w-10 text-[#C9A574]" />
                <span className="text-3xl font-bold text-[#C9A574]">GÊMEAS</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Engenharia de excelência com compromisso, qualidade e inovação 
                para transformar seus projetos em realidade.
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-semibold text-[#C9A574]">Nossos Serviços</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">→ Projetos Arquitetônicos</li>
                <li className="hover:text-white transition-colors cursor-pointer">→ Gestão de Obras</li>
                <li className="hover:text-white transition-colors cursor-pointer">→ Consultoria Técnica</li>
                <li className="hover:text-white transition-colors cursor-pointer">→ Regularização</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-semibold text-[#C9A574]">Contato</h3>
              <ul className="space-y-3 text-gray-400">
                <li>📧 contato@gemeas.com.br</li>
                <li>📱 (34) 99999-9999</li>
                <li>📍 Uberlândia - MG</li>
                <li>🕐 Seg-Sex: 8h às 18h</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-gray-400">
                &copy; 2025 Gêmeas Engenharia. Todos os direitos reservados.
              </p>
              <div className="flex gap-6">
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-[#C9A574] hover:bg-[#B8956A]"
                >
                  Acessar Sistema
                </Button>
              </div>
            </div>
          </div>
      </div>
      </footer>
    </div>
  )
}
