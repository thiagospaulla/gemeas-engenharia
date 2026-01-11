'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, Users, Award, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, 
  Sparkles, Target, TrendingUp, Shield, Clock, Phone, Mail, MapPin,
  FileText, Briefcase, Settings, Zap, Star, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const projects = [
  {
    title: 'EDIFÍCIO AHAVA',
    subtitle: 'Complexo Comercial Premium',
    description: 'Projeto comercial de alto padrão com design contemporâneo e acabamento superior',
    gradient: 'from-amber-50 via-amber-200 to-amber-400',
    overlay: 'from-amber-900/60 to-transparent',
    specs: ['1.500m²', '4 Pavimentos', 'Acabamento Premium', 'Vista Panorâmica'],
    type: 'Comercial'
  },
  {
    title: 'ESPAÇO REVOLUÇÃO',
    subtitle: 'Centro Corporativo Sustentável',
    description: 'Empreendimento corporativo com tecnologia de ponta e certificação ambiental',
    gradient: 'from-slate-600 via-slate-800 to-slate-950',
    overlay: 'from-slate-900/70 to-transparent',
    specs: ['2.800m²', 'Certificação LEED', 'Smart Building', 'Heliporto'],
    type: 'Corporativo'
  },
  {
    title: 'GALERIA COMERCIAL',
    subtitle: 'Complexo Multiuso',
    description: 'Desenvolvimento comercial integrado com lojas, escritórios e área de lazer',
    gradient: 'from-stone-200 via-stone-400 to-stone-600',
    overlay: 'from-stone-900/60 to-transparent',
    specs: ['3.200m²', '24 Lojas', 'Estacionamento 150 vagas', 'Praça Central'],
    type: 'Comercial'
  },
  {
    title: 'RESIDÊNCIA DE LUXO',
    subtitle: 'Casa de Alto Padrão',
    description: 'Projeto residencial exclusivo com arquitetura moderna e conforto superior',
    gradient: 'from-amber-100 via-amber-300 to-amber-500',
    overlay: 'from-amber-900/50 to-transparent',
    specs: ['450m²', '4 Suítes', 'Piscina Infinita', 'Automação Completa'],
    type: 'Residencial'
  }
]

const testimonials = [
  {
    name: 'Carlos Mendes',
    role: 'Empresário',
    text: 'A Gêmeas transformou minha visão em realidade. Profissionalismo e qualidade incomparáveis.',
    rating: 5
  },
  {
    name: 'Ana Paula Silva',
    role: 'Investidora',
    text: 'Transparência total durante todo o processo. Sistema de acompanhamento é excelente!',
    rating: 5
  },
  {
    name: 'Roberto Costa',
    role: 'Proprietário',
    text: 'Entregaram minha casa dos sonhos dentro do prazo e orçamento. Recomendo!',
    rating: 5
  }
]

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % projects.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-[#2C3E50] py-3">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white">
            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C9A574]" />
                (11) 99999-9999
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C9A574]" />
                contato@gemeas.com.br
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                size="sm"
                onClick={() => router.push('/login')}
                className="bg-transparent hover:bg-white/10"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/register')}
                className="bg-[#C9A574] hover:bg-[#B8956A]"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50]">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyMDEsMTY1LDExNiwwLjIpIi8+PC9zdmc+')] opacity-40" />
          <div className="absolute top-0 right-0 h-96 w-96 bg-[#C9A574]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 h-96 w-96 bg-[#C9A574]/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <div className={`relative z-10 mx-auto max-w-7xl px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo Premium */}
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="relative">
              <Building2 className="h-24 w-24 text-[#C9A574] drop-shadow-2xl" />
              <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-yellow-200 animate-pulse delay-500" />
            </div>
            <div>
              <h1 className="text-7xl font-black tracking-tight text-white drop-shadow-2xl">
                GÊMEAS
              </h1>
              <p className="text-3xl font-light tracking-widest bg-gradient-to-r from-[#C9A574] via-[#E8D5B7] to-[#C9A574] bg-clip-text text-transparent">
                ENGENHARIA
              </p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="mb-6 text-4xl font-light text-gray-200 leading-relaxed">
            Transformando <span className="font-bold text-[#C9A574]">Visões</span> em
          </h2>
          <h2 className="mb-12 text-5xl font-bold bg-gradient-to-r from-white via-[#E8D5B7] to-[#C9A574] bg-clip-text text-transparent">
            Obras de Excelência
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-300 leading-relaxed">
            Há mais de 15 anos entregando projetos de engenharia civil com qualidade superior, 
            inovação tecnológica e compromisso total com nossos clientes.
          </p>

          {/* CTAs Premium */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row mb-16">
            <Button
              onClick={() => router.push('/login')}
              className="group w-80 bg-gradient-to-r from-[#C9A574] via-[#D4B17E] to-[#C9A574] py-8 text-xl font-bold shadow-2xl hover:shadow-[#C9A574]/50 transition-all hover:scale-110 animate-pulse hover:animate-none"
            >
              <Zap className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Acessar Plataforma
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className="w-80 border-3 border-white bg-white/10 backdrop-blur-sm py-8 text-xl font-bold text-white hover:bg-white hover:text-[#2C3E50] transition-all hover:scale-110"
            >
              <Star className="mr-2 h-6 w-6" />
              Criar Conta Grátis
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { value: '15+', label: 'Anos de', sublabel: 'Experiência', icon: Award },
              { value: '200+', label: 'Projetos', sublabel: 'Concluídos', icon: Building2 },
              { value: '50+', label: 'Clientes', sublabel: 'Satisfeitos', icon: Users },
              { value: '98%', label: 'Taxa de', sublabel: 'Aprovação', icon: Target }
            ].map((stat, index) => (
              <div key={index} className="group text-center transform hover:scale-110 transition-all">
                <stat.icon className="h-12 w-12 mx-auto mb-3 text-[#C9A574] group-hover:rotate-12 transition-transform" />
                <p className="text-6xl font-black bg-gradient-to-r from-[#C9A574] to-[#E8D5B7] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-white font-medium">{stat.label}</p>
                <p className="text-gray-400">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Carousel */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              PORTFÓLIO
            </span>
            <h2 className="mb-4 text-5xl font-black text-[#2C3E50]">
              Projetos que Inspiram
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos empreendimentos que desenvolvemos com excelência e dedicação
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {projects.map((project, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className={`relative h-[500px] bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <Building2 className="absolute top-10 right-10 h-32 w-32 text-white/30" />
                        <Building2 className="absolute bottom-10 left-10 h-24 w-24 text-white/20" />
                      </div>

                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${project.overlay}`} />
                      
                      {/* Content */}
                      <div className="relative z-10 text-center text-white px-8 max-w-4xl">
                        <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-4">
                          {project.type}
                        </span>
                        <h3 className="text-5xl font-black mb-4 drop-shadow-2xl tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-2xl font-medium mb-4 text-white/90 drop-shadow-lg">
                          {project.subtitle}
                        </p>
                        <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto drop-shadow-lg">
                          {project.description}
                        </p>
                        
                        {/* Specs */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          {project.specs.map((spec, idx) => (
                            <div 
                              key={idx}
                              className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 font-medium shadow-lg"
                            >
                              {spec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white p-4 shadow-2xl hover:bg-[#C9A574] hover:text-white transition-all hover:scale-125"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white p-4 shadow-2xl hover:bg-[#C9A574] hover:text-white transition-all hover:scale-125"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Indicators */}
            <div className="mt-8 flex justify-center gap-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-4 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-16 bg-[#C9A574] shadow-lg' 
                      : 'w-4 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              DIFERENCIAIS
            </span>
            <h2 className="mb-6 text-5xl font-black text-[#2C3E50]">
              Por que somos a melhor escolha?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Combinamos experiência, tecnologia e dedicação para entregar resultados excepcionais
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Projetos Inovadores',
                description: 'Design contemporâneo aliado à funcionalidade. Cada projeto é único e pensado nos mínimos detalhes.',
                color: 'from-blue-500 to-blue-700'
              },
              {
                icon: Users,
                title: 'Equipe de Elite',
                description: 'Engenheiros, arquitetos e mestres de obras certificados com anos de experiência comprovada.',
                color: 'from-purple-500 to-purple-700'
              },
              {
                icon: Shield,
                title: 'Garantia de Qualidade',
                description: 'Compromisso com prazos, transparência total e suporte durante e após a entrega.',
                color: 'from-green-500 to-green-700'
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-4 border-0"
              >
                {/* Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`} />
                
                <div className="mb-6 flex justify-center">
                  <div className={`rounded-2xl bg-gradient-to-br ${item.color} p-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <item.icon className="h-14 w-14 text-white" />
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
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              SERVIÇOS
            </span>
            <h2 className="mb-6 text-5xl font-black text-[#2C3E50]">
              Soluções Completas
            </h2>
            <p className="text-xl text-gray-600">
              Do planejamento à entrega, cuidamos de cada detalhe
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: 'Projetos',
                items: ['Arquitetônicos', 'Estruturais', 'Elétricos', 'Hidráulicos']
              },
              {
                icon: Briefcase,
                title: 'Gestão',
                items: ['Obras', 'Equipes', 'Prazos', 'Orçamentos']
              },
              {
                icon: Settings,
                title: 'Consultoria',
                items: ['Técnica', 'Viabilidade', 'Aprovações', 'Regularização']
              },
              {
                icon: TrendingUp,
                title: 'Acompanhamento',
                items: ['Tempo Real', 'Relatórios', 'Fotos', 'Métricas']
              }
            ].map((service, index) => (
              <Card 
                key={index}
                className="group p-6 hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-[#C9A574]"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-xl bg-[#C9A574] p-4 group-hover:bg-gradient-to-br group-hover:from-[#C9A574] group-hover:to-[#B8956A] transition-all">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-[#2C3E50] text-center">
                  {service.title}
                </h3>
                <ul className="space-y-2">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="h-4 w-4 text-[#C9A574] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              NOSSO PROCESSO
            </span>
            <h2 className="mb-6 text-5xl font-black text-[#2C3E50]">
              Como Trabalhamos
            </h2>
            <p className="text-xl text-gray-600">
              Metodologia comprovada em 4 etapas simples
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { number: '01', title: 'Planejamento', desc: 'Análise detalhada das necessidades e proposta personalizada' },
              { number: '02', title: 'Execução', desc: 'Obra realizada com qualidade e acompanhamento constante' },
              { number: '03', title: 'Controle', desc: 'Monitoramento em tempo real através da plataforma digital' },
              { number: '04', title: 'Entrega', desc: 'Finalização completa com documentação e suporte pós-obra' }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="mb-4 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#C9A574] to-[#B8956A] flex items-center justify-center text-3xl font-black text-white shadow-xl group-hover:scale-125 transition-all">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#2C3E50]">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              DEPOIMENTOS
            </span>
            <h2 className="mb-6 text-5xl font-black text-[#2C3E50]">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#C9A574] text-[#C9A574]" />
                  ))}
                </div>
                <p className="mb-6 text-gray-700 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#C9A574] to-[#B8956A] flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#2C3E50]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-[#C9A574]/10 text-[#C9A574] font-semibold mb-4">
              PLATAFORMA DIGITAL
            </span>
            <h2 className="mb-6 text-5xl font-black text-[#2C3E50]">
              Tecnologia a Seu Favor
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema completo de gestão e acompanhamento de obras online
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Clock, title: 'Acompanhamento em Tempo Real', desc: 'Veja o progresso da sua obra a qualquer momento, de onde estiver' },
              { icon: FileText, title: 'Documentos Centralizados', desc: 'Todos os documentos organizados e seguros em um só lugar' },
              { icon: MessageCircle, title: 'Comunicação Direta', desc: 'Chat integrado para falar com a equipe sempre que precisar' },
              { icon: TrendingUp, title: 'Relatórios Detalhados', desc: 'Métricas, gráficos e análises completas do seu projeto' },
              { icon: Shield, title: 'Segurança Total', desc: 'Seus dados protegidos com criptografia e backup automático' },
              { icon: Zap, title: 'Notificações Instantâneas', desc: 'Receba atualizações importantes por email e WhatsApp' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group flex gap-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-6 hover:border-[#C9A574] hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="rounded-xl bg-[#C9A574]/10 p-3 group-hover:bg-[#C9A574] transition-all">
                    <feature.icon className="h-6 w-6 text-[#C9A574] group-hover:text-white transition-all" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-[#2C3E50]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#2C3E50] py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 bg-[#C9A574] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-[#C9A574] rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-black text-white">
            Pronto para começar?
          </h2>
          <p className="mb-10 text-2xl text-gray-300">
            Crie sua conta gratuitamente e tenha acesso completo à nossa plataforma
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              onClick={() => router.push('/register')}
              className="w-80 bg-gradient-to-r from-[#C9A574] to-[#E8D5B7] py-8 text-xl font-bold text-[#2C3E50] shadow-2xl hover:scale-110 transition-all"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Começar Agora
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button
              onClick={() => router.push('/login')}
              className="w-80 border-3 border-white bg-white/10 backdrop-blur-sm py-8 text-xl font-bold text-white hover:bg-white hover:text-[#2C3E50] transition-all hover:scale-110"
            >
              Já sou cliente
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Dados 100% Seguros
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> Sem taxas ocultas
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Suporte 24/7
            </span>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-[#1a252f] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <Building2 className="h-12 w-12 text-[#C9A574]" />
                <div>
                  <span className="text-3xl font-black text-white">GÊMEAS</span>
                  <p className="text-[#C9A574] text-sm">ENGENHARIA</p>
                </div>
              </div>
              <p className="mb-6 text-gray-400 leading-relaxed max-w-md">
                Há mais de 15 anos transformando sonhos em construções sólidas. 
                Compromisso, qualidade e inovação em cada projeto.
              </p>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A574] cursor-pointer transition-all">
                  📘
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A574] cursor-pointer transition-all">
                  📸
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A574] cursor-pointer transition-all">
                  💼
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-[#C9A574]">Navegação</h3>
              <ul className="space-y-3">
                {['Projetos', 'Serviços', 'Sobre Nós', 'Contato'].map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-400 hover:text-[#C9A574] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-[#C9A574]">Contato</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-[#C9A574] flex-shrink-0 mt-0.5" />
                  <span>contato@gemeas.com.br</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-[#C9A574] flex-shrink-0 mt-0.5" />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-[#C9A574] flex-shrink-0 mt-0.5" />
                  <span>São Paulo - SP<br/>Segunda a Sexta: 8h às 18h</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-gray-500 text-sm">
                &copy; 2024 Gêmeas Engenharia. Todos os direitos reservados.
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-[#C9A574] transition-colors">Privacidade</a>
                <a href="#" className="hover:text-[#C9A574] transition-colors">Termos</a>
                <a href="#" className="hover:text-[#C9A574] transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
