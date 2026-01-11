'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, Cloud, Thermometer, Users, Wrench, Package, MessageSquare, Image as ImageIcon, Plus, X } from 'lucide-react'

export default function NewWorkDiaryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedProject = searchParams.get('project')
  
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([''])
  const [formData, setFormData] = useState({
    projectId: preSelectedProject || '',
    date: new Date().toISOString().split('T')[0],
    weather: 'Ensolarado',
    temperature: '',
    workersPresent: '',
    activities: '',
    materials: '',
    equipment: '',
    observations: ''
  })

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

    fetchProjects(token)
  }, [router])

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch('/api/projects?status=EM_ANDAMENTO', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const addPhotoUrl = () => {
    setPhotoUrls([...photoUrls, ''])
  }

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index))
  }

  const updatePhotoUrl = (index: number, value: string) => {
    const newUrls = [...photoUrls]
    newUrls[index] = value
    setPhotoUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.projectId) {
      alert('Selecione um projeto!')
      return
    }

    if (!formData.activities.trim()) {
      alert('Descreva as atividades realizadas!')
      return
    }

    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const validPhotoUrls = photoUrls.filter(url => url.trim().length > 0)

      const diaryData = {
        projectId: formData.projectId,
        date: new Date(formData.date).toISOString(),
        weather: formData.weather,
        temperature: formData.temperature,
        workersPresent: formData.workersPresent ? parseInt(formData.workersPresent) : null,
        activities: formData.activities,
        materials: formData.materials,
        equipment: formData.equipment,
        observations: formData.observations,
        photos: validPhotoUrls
      }

      const res = await fetch('/api/work-diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(diaryData)
      })

      if (res.ok) {
        alert('✅ Registro do diário criado com sucesso!')
        router.push('/admin/work-diaries')
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao criar registro')
      }
    } catch (error) {
      console.error('Error creating diary:', error)
      alert('Erro ao criar registro')
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
            
            <h1 className="text-3xl font-bold text-gray-900">Novo Registro - Diário de Obras</h1>
            <p className="text-gray-600">Documente as atividades do dia</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Projeto *
                        </label>
                        <select
                          required
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.projectId}
                          onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        >
                          <option value="">Selecione um projeto</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title} - {project.client.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Data *
                        </label>
                        <Input
                          required
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Condições Climáticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Clima
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-[#C9A574] focus:ring-[#C9A574]"
                          value={formData.weather}
                          onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                        >
                          <option value="Ensolarado">☀️ Ensolarado</option>
                          <option value="Parcialmente Nublado">⛅ Parcialmente Nublado</option>
                          <option value="Nublado">☁️ Nublado</option>
                          <option value="Chuvoso">🌧️ Chuvoso</option>
                          <option value="Tempestade">⛈️ Tempestade</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          <Thermometer className="inline h-4 w-4 mr-1" />
                          Temperatura (°C)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.temperature}
                          onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                          placeholder="25.5"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Workers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Equipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Trabalhadores Presentes
                      </label>
                      <Input
                        type="number"
                        value={formData.workersPresent}
                        onChange={(e) => setFormData({ ...formData, workersPresent: e.target.value })}
                        placeholder="Ex: 8"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Número total de trabalhadores presentes no dia
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Realizadas *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      required
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={6}
                      value={formData.activities}
                      onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                      placeholder="Descreva detalhadamente as atividades realizadas no dia...&#10;&#10;Exemplo:&#10;- Concretagem da laje do 2º pavimento&#10;- Instalação de tubulação hidráulica&#10;- Levantamento de alvenaria na área social"
                    />
                  </CardContent>
                </Card>

                {/* Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Materiais Utilizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={4}
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      placeholder="Liste os materiais utilizados...&#10;&#10;Exemplo:&#10;- 5m³ de concreto usinado&#10;- 1000 tijolos cerâmicos&#10;- 10 sacos de cimento"
                    />
                  </CardContent>
                </Card>

                {/* Equipment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Equipamentos Utilizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={4}
                      value={formData.equipment}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                      placeholder="Liste os equipamentos utilizados...&#10;&#10;Exemplo:&#10;- Betoneira&#10;- Andaimes tubulares&#10;- Serra circular"
                    />
                  </CardContent>
                </Card>

                {/* Observations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-[#C9A574] focus:ring-[#C9A574]"
                      rows={4}
                      value={formData.observations}
                      onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                      placeholder="Observações gerais, pendências, problemas encontrados, etc...&#10;&#10;Exemplo:&#10;- Aguardando entrega de ferragens&#10;- Necessário reforço na estrutura do térreo"
                    />
                  </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Fotos (URLs)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {photoUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={url}
                            onChange={(e) => updatePhotoUrl(index, e.target.value)}
                            placeholder="https://exemplo.com/foto.jpg"
                          />
                        </div>
                        {photoUrls.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePhotoUrl(index)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPhotoUrl}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Foto
                    </Button>

                    <p className="text-xs text-gray-500">
                      💡 Cole URLs de imagens hospedadas (Cloudinary, AWS S3, Imgur, etc)
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.projectId && (
                      <div>
                        <p className="text-gray-600">Projeto</p>
                        <p className="font-medium">
                          {projects.find(p => p.id === formData.projectId)?.title || 'Selecionado'}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Data</p>
                      <p className="font-medium">
                        {new Date(formData.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {formData.weather && (
                      <div>
                        <p className="text-gray-600">Clima</p>
                        <p className="font-medium">{formData.weather}</p>
                      </div>
                    )}
                    {formData.workersPresent && (
                      <div>
                        <p className="text-gray-600">Trabalhadores</p>
                        <p className="font-medium">{formData.workersPresent} pessoas</p>
                      </div>
                    )}
                    {photoUrls.filter(u => u.trim()).length > 0 && (
                      <div>
                        <p className="text-gray-600">Fotos</p>
                        <p className="font-medium">{photoUrls.filter(u => u.trim()).length} imagens</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
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
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Registro
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-blue-900">💡 Dicas Profissionais</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Registre no final do dia</li>
                      <li>• Seja específico nas atividades</li>
                      <li>• Documente problemas e soluções</li>
                      <li>• Adicione fotos para evidência</li>
                      <li>• Registre condições climáticas</li>
                      <li>• Anote materiais e equipamentos usados</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* AI Info */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 font-semibold text-purple-900">🤖 Análise por IA</h3>
                    <p className="text-sm text-purple-800">
                      Após salvar, a IA analisará o registro e gerará automaticamente um resumo e insights sobre as atividades.
                    </p>
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
