'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TeamMember {
  id: string
  name: string
  email: string | null
  phone: string
  cpf: string
  role: string
  status: string
  specialization: string | null
  hourlyRate: number | null
  dailyRate: number | null
  hireDate: string
  avatar: string | null
  active: boolean
  projectAssignments: Array<{
    id: string
    project: {
      id: string
      title: string
      status: string
    }
  }>
}

const roleLabels: Record<string, string> = {
  ENGENHEIRO: 'Engenheiro',
  ARQUITETO: 'Arquiteto',
  MESTRE_OBRAS: 'Mestre de Obras',
  PEDREIRO: 'Pedreiro',
  ELETRICISTA: 'Eletricista',
  ENCANADOR: 'Encanador',
  PINTOR: 'Pintor',
  CARPINTEIRO: 'Carpinteiro',
  SERVENTE: 'Servente',
  OUTRO: 'Outro'
}

const statusLabels: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  FERIAS: 'Férias',
  AFASTADO: 'Afastado'
}

const statusColors: Record<string, string> = {
  ATIVO: 'bg-green-100 text-green-800',
  INATIVO: 'bg-gray-100 text-gray-800',
  FERIAS: 'bg-blue-100 text-blue-800',
  AFASTADO: 'bg-yellow-100 text-yellow-800'
}

export default function TeamPage() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [searchTerm, statusFilter, roleFilter, teamMembers])

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar membros da equipe')
      }

      const data = await response.json()
      setTeamMembers(data)
      setFilteredMembers(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao carregar membros da equipe')
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = [...teamMembers]

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.cpf.includes(searchTerm)
      )
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter)
    }

    // Filtro de função
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter)
    }

    setFilteredMembers(filtered)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao excluir membro')
      }

      alert('Membro excluído com sucesso!')
      fetchTeamMembers()
    } catch (error: any) {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao excluir membro')
    }
  }

  const getActiveProjects = (member: TeamMember) => {
    return member.projectAssignments.filter(
      assignment => assignment.project.status === 'EM_ANDAMENTO'
    ).length
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#C9A574]"></div>
          <p className="mt-4 text-gray-600">Carregando equipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipe</h1>
            <p className="mt-2 text-gray-600">
              Gerencie os membros da sua equipe
            </p>
          </div>
          <Link href="/admin/team/new">
            <Button className="bg-[#C9A574] hover:bg-[#B8956A]">
              <UserPlus className="mr-2 h-5 w-5" />
              Adicionar Membro
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card className="mb-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, email, telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro de Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
              >
                <option value="all">Todos os Status</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="FERIAS">Férias</option>
                <option value="AFASTADO">Afastado</option>
              </select>
            </div>

            {/* Filtro de Função */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
              >
                <option value="all">Todas as Funções</option>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredMembers.length} de {teamMembers.length} membros
            </span>
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setRoleFilter('all')
                }}
                className="text-[#C9A574] hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </Card>

        {/* Lista de Membros */}
        {filteredMembers.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum membro encontrado
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando um novo membro à equipe'}
            </p>
            {!(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
              <Link href="/admin/team/new">
                <Button className="mt-4 bg-[#C9A574] hover:bg-[#B8956A]">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Adicionar Primeiro Membro
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="p-6">
                  {/* Header do Card */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A574] text-lg font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {roleLabels[member.role]}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusColors[member.status]}>
                      {statusLabels[member.status]}
                    </Badge>
                  </div>

                  {/* Informações de Contato */}
                  <div className="mb-4 space-y-2">
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="mb-4 space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Projetos Ativos:</span>
                      <span className="font-semibold text-gray-900">
                        {getActiveProjects(member)}
                      </span>
                    </div>
                    {member.dailyRate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Diária:</span>
                        <span className="font-semibold text-gray-900">
                          R$ {member.dailyRate.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {member.specialization && (
                      <div className="text-sm">
                        <span className="text-gray-600">Especialização:</span>
                        <p className="mt-1 text-gray-900">
                          {member.specialization}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Link href={`/admin/team/${member.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-[#C9A574] text-[#C9A574] hover:bg-[#C9A574] hover:text-white"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(member.id, member.name)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
