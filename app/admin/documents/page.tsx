'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import * as Dialog from '@radix-ui/react-dialog'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye,
  X,
  File,
  FolderKanban,
  User,
  DollarSign,
  Users as UsersIcon,
  Calendar
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  description: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  category: string
  tags: string[]
  uploadedAt: string
  uploadedBy: {
    id: string
    name: string
    email: string
  }
  project: {
    id: string
    title: string
    status: string
  } | null
  user: {
    id: string
    name: string
  } | null
  budget: {
    id: string
    title: string
  } | null
  teamMember: {
    id: string
    name: string
  } | null
}

const categories = [
  'Contrato',
  'Planta',
  'Laudo',
  'Licença',
  'Certidão',
  'RG',
  'CPF',
  'CTPS',
  'Comprovante',
  'Nota Fiscal',
  'Recibo',
  'Outro'
]

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Dados do upload
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'Outro',
    tags: '',
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    entityType: 'none',
    entityId: ''
  })

  // Listas para seleção
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])

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

    fetchDocuments(token)
    fetchEntities(token)
  }, [router])

  useEffect(() => {
    filterDocuments()
  }, [searchTerm, categoryFilter, entityFilter, documents])

  const fetchDocuments = async (token: string) => {
    try {
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setDocuments(data.documents || [])
      setFilteredDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEntities = async (token: string) => {
    try {
      // Buscar projetos
      const projectsRes = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const projectsData = await projectsRes.json()
      setProjects(projectsData.projects || [])

      // Buscar usuários
      const usersRes = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const usersData = await usersRes.json()
      setUsers(usersData.users || [])

      // Buscar orçamentos
      const budgetsRes = await fetch('/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const budgetsData = await budgetsRes.json()
      setBudgets(budgetsData.budgets || [])

      // Buscar equipe
      const teamRes = await fetch('/api/team', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const teamData = await teamRes.json()
      setTeamMembers(teamData || [])
    } catch (error) {
      console.error('Error fetching entities:', error)
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter)
    }

    // Filtro de entidade
    if (entityFilter !== 'all') {
      filtered = filtered.filter(doc => {
        switch (entityFilter) {
          case 'project':
            return doc.project !== null
          case 'user':
            return doc.user !== null
          case 'budget':
            return doc.budget !== null
          case 'team':
            return doc.teamMember !== null
          case 'unlinked':
            return !doc.project && !doc.user && !doc.budget && !doc.teamMember
          default:
            return true
        }
      })
    }

    setFilteredDocuments(filtered)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const token = localStorage.getItem('token')
      
      const payload: any = {
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        tags: uploadData.tags.split(',').map(t => t.trim()).filter(t => t),
        fileUrl: uploadData.fileUrl,
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
        fileType: uploadData.fileType,
      }

      // Adicionar vinculação se selecionada
      if (uploadData.entityType !== 'none' && uploadData.entityId) {
        switch (uploadData.entityType) {
          case 'project':
            payload.projectId = uploadData.entityId
            break
          case 'user':
            payload.userId = uploadData.entityId
            break
          case 'budget':
            payload.budgetId = uploadData.entityId
            break
          case 'team':
            payload.teamMemberId = uploadData.entityId
            break
        }
      }

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      alert('Documento enviado com sucesso!')
      setShowUploadModal(false)
      setUploadData({
        title: '',
        description: '',
        category: 'Outro',
        tags: '',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        fileType: '',
        entityType: 'none',
        entityId: ''
      })
      fetchDocuments(token!)
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        throw new Error('Erro ao excluir documento')
      }

      alert('Documento excluído com sucesso!')
      fetchDocuments(token!)
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir documento')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getEntityIcon = (doc: Document) => {
    if (doc.project) return <FolderKanban className="h-4 w-4" />
    if (doc.user) return <User className="h-4 w-4" />
    if (doc.budget) return <DollarSign className="h-4 w-4" />
    if (doc.teamMember) return <UsersIcon className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getEntityName = (doc: Document) => {
    if (doc.project) return doc.project.title
    if (doc.user) return doc.user.name
    if (doc.budget) return doc.budget.title
    if (doc.teamMember) return doc.teamMember.name
    return 'Sem vínculo'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#C9A574]"></div>
          <p className="mt-4 text-gray-600">Carregando documentos...</p>
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
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
              <p className="text-gray-600">Gerencie todos os documentos do sistema</p>
            </div>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#C9A574] hover:bg-[#B8956A]"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Documento
            </Button>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtro de Categoria */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Filtro de Entidade */}
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                >
                  <option value="all">Todos os Vínculos</option>
                  <option value="project">Projetos</option>
                  <option value="user">Usuários</option>
                  <option value="budget">Orçamentos</option>
                  <option value="team">Equipe</option>
                  <option value="unlinked">Sem vínculo</option>
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Mostrando {filteredDocuments.length} de {documents.length} documentos
                </span>
                {(searchTerm || categoryFilter !== 'all' || entityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setCategoryFilter('all')
                      setEntityFilter('all')
                    }}
                    className="text-[#C9A574] hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Documentos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#C9A574] to-[#B8956A] text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Categoria */}
                    <div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {doc.category}
                      </Badge>
                    </div>

                    {/* Descrição */}
                    {doc.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    {/* Informações do Arquivo */}
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        {doc.fileName}
                      </p>
                      <p>{formatFileSize(doc.fileSize)}</p>
                    </div>

                    {/* Vinculação */}
                    <div className="flex items-center gap-2 text-sm">
                      {getEntityIcon(doc)}
                      <span className="text-gray-700">{getEntityName(doc)}</span>
                    </div>

                    {/* Data e Uploader */}
                    <div className="border-t pt-3 text-xs text-gray-500">
                      <p>Enviado por: {doc.uploadedBy.name}</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(doc.uploadedAt)}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#C9A574] text-[#C9A574] hover:bg-[#C9A574] hover:text-white"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Baixar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDelete(doc.id, doc.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Nenhum documento encontrado
                </h3>
                <p className="mt-2 text-gray-600">
                  {searchTerm || categoryFilter !== 'all' || entityFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece fazendo upload de documentos'}
                </p>
              </div>
            )}
          </div>

          {/* Modal de Upload */}
          <Dialog.Root open={showUploadModal} onOpenChange={setShowUploadModal}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Upload de Documento
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="rounded-lg p-2 hover:bg-gray-100">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Título *
                    </label>
                    <Input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      required
                      placeholder="Nome do documento"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      rows={3}
                      placeholder="Descrição opcional do documento"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Categoria *
                      </label>
                      <select
                        value={uploadData.category}
                        onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Tags (separadas por vírgula)
                      </label>
                      <Input
                        type="text"
                        value={uploadData.tags}
                        onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                        placeholder="importante, urgente, contrato"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      URL do Arquivo *
                    </label>
                    <Input
                      type="url"
                      value={uploadData.fileUrl}
                      onChange={(e) => setUploadData({ 
                        ...uploadData, 
                        fileUrl: e.target.value,
                        fileName: e.target.value.split('/').pop() || 'documento'
                      })}
                      required
                      placeholder="https://exemplo.com/documento.pdf"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Cole a URL do arquivo hospedado (Google Drive, Dropbox, etc)
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Vincular a:
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <select
                        value={uploadData.entityType}
                        onChange={(e) => setUploadData({ ...uploadData, entityType: e.target.value, entityId: '' })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                      >
                        <option value="none">Nenhum vínculo</option>
                        <option value="project">Projeto</option>
                        <option value="user">Usuário</option>
                        <option value="budget">Orçamento</option>
                        <option value="team">Membro da Equipe</option>
                      </select>

                      {uploadData.entityType !== 'none' && (
                        <select
                          value={uploadData.entityId}
                          onChange={(e) => setUploadData({ ...uploadData, entityId: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C9A574] focus:outline-none focus:ring-2 focus:ring-[#C9A574]"
                        >
                          <option value="">Selecione...</option>
                          {uploadData.entityType === 'project' && projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                          {uploadData.entityType === 'user' && users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                          {uploadData.entityType === 'budget' && budgets.map(b => (
                            <option key={b.id} value={b.id}>{b.title}</option>
                          ))}
                          {uploadData.entityType === 'team' && teamMembers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-[#C9A574] hover:bg-[#B8956A]"
                    >
                      {uploading ? 'Enviando...' : 'Enviar Documento'}
                    </Button>
                    <Dialog.Close asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </Dialog.Close>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </main>
      </div>
    </div>
  )
}
