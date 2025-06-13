"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { BadgeCheck, Calendar, Clock, Search, User2, ExternalLink, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import type { User as UserType } from "@/lib/types"

interface Curso {
  id: string
  titulo: string
  descricao: string
  imagem: string
  data: string
  status: "disponivel" | "indisponivel"
  instrutor: string
  duracao: string
  categoria: string
  links?: string[]
  arquivos?: {
    nome: string
    url: string
    tipo: string
  }[]
  vagas?: number
  vagasPreenchidas?: number
  inscritos?: string[] // IDs dos usuários inscritos
}

interface Inscricao {
  id: string
  cursoId: string
  cursoTitulo: string
  userId: string
  userName: string
  userRank: string
  status: "pendente" | "aprovada" | "rejeitada"
  data: string
}

interface User extends UserType {
  rank?: string;
}

// Dados iniciais para demonstração
const cursosIniciais: Curso[] = [
  {
    id: "1",
    titulo: "Abordagem Policial Avançada",
    descricao: "Curso focado em técnicas avançadas de abordagem policial para situações de alto risco.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-08-15",
    status: "disponivel",
    instrutor: "Cap. Silva",
    duracao: "20h",
    categoria: "Operacional",
    vagas: 20,
    vagasPreenchidas: 8,
    inscritos: []
  },
  {
    id: "2",
    titulo: "Primeiros Socorros Táticos",
    descricao: "Aprenda técnicas de primeiros socorros aplicáveis em situações táticas e de emergência.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-09-10",
    status: "disponivel",
    instrutor: "Ten. Oliveira",
    duracao: "15h",
    categoria: "Saúde",
    vagas: 15,
    vagasPreenchidas: 4,
    inscritos: []
  },
  {
    id: "3",
    titulo: "Direito Penal Aplicado",
    descricao: "Estudo aprofundado do código penal com foco na aplicação prática para policiais.",
    imagem: "https://placehold.co/600x400/png",
    data: "2023-07-20",
    status: "indisponivel",
    instrutor: "Dr. Mendes",
    duracao: "30h",
    categoria: "Jurídico",
    vagas: 25,
    vagasPreenchidas: 25,
    inscritos: []
  }
]

// Variantes do Badge
type BadgeVariant = NonNullable<BadgeProps["variant"]>

interface CursoInscrito extends Curso {
  inscricaoStatus: string;
  inscricaoData: string;
}

export default function CursosPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cursos, setCursos] = useState<Curso[]>(cursosIniciais)
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("todas")
  const [selectedCurso, setSelectedCurso] = useState<Curso | CursoInscrito | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("disponiveis")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [inscricaoCursoId, setInscricaoCursoId] = useState<string | null>(null)
  const [formDialogOpen, setFormDialogOpen] = useState(false)

  // Função para carregar dados
  const carregarDados = () => {
    try {
      // Carregar cursos
      const cursosSalvos = localStorage.getItem("cursos")
      if (cursosSalvos) {
        const cursosParsed = JSON.parse(cursosSalvos)
        setCursos(cursosParsed)
      } else {
        setCursos(cursosIniciais)
        localStorage.setItem("cursos", JSON.stringify(cursosIniciais))
      }
      
      // Carregar inscrições
      const inscricoesSalvas = localStorage.getItem("inscricoesCursos")
      let inscricoesParsed: Inscricao[] = []
      
      if (inscricoesSalvas) {
        inscricoesParsed = JSON.parse(inscricoesSalvas)
      }
      
      // Filtrar inscrições do usuário atual
      if (currentUser) {
        const inscricoesDoUsuario = inscricoesParsed.filter(
          inscricao => inscricao.userId === currentUser.id
        )
        setInscricoes(inscricoesDoUsuario)
      } else {
        setInscricoes([])
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar cursos:", error)
      setError("Não foi possível carregar os cursos. Tente novamente mais tarde.")
      setIsLoading(false)
    }
  }

  // Efeito para carregar o usuário atual e ouvir mudanças no localStorage
  useEffect(() => {
    // Carregar usuário atual
    const userSalvo = localStorage.getItem("currentUser")
    if (userSalvo) {
      const userParsed = JSON.parse(userSalvo)
      setCurrentUser(userParsed)
    }
    
    // Carregar dados iniciais
    carregarDados()
    
    // Ouvinte para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      // Se os cursos ou inscrições forem atualizados em outra aba
      if (e.key === "cursos" || e.key === "inscricoesCursos") {
        carregarDados()
      }
      
      // Se o usuário atual mudar
      if (e.key === "currentUser") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null
        setCurrentUser(newUser)
        carregarDados() // Recarregar os dados filtrados para o novo usuário
      }
    }
    
    // Registrar o ouvinte
    window.addEventListener("storage", handleStorageChange)
    
    // Limpar o ouvinte ao desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [currentUser?.id]) // Dependência adicionada para recarregar quando o ID do usuário mudar

  // Função para verificar se o usuário está inscrito em um curso
  const isInscrito = (cursoId: string) => {
    return inscricoes.some(inscricao => 
      inscricao.cursoId === cursoId && 
      (inscricao.status === "pendente" || inscricao.status === "aprovada")
    )
  }

  /**
   * Função para inscrever o usuário atual em um curso
   */
  const inscreverCurso = async (cursoId: string) => {
    setIsLoading(true);
    try {
      // Verificar se o usuário já está inscrito
      if (isInscrito(cursoId)) {
        setError("Você já está inscrito neste curso.");
        setIsLoading(false);
        return;
      }

      // Verificar se o usuário está logado
      if (!currentUser) {
        setError("Você precisa fazer login para se inscrever.");
        setIsLoading(false);
        return;
      }
      
      // Encontrar o curso pelo ID
      const curso = cursos.find(c => c.id === cursoId);
      if (!curso) {
        setError("Curso não encontrado.");
        setIsLoading(false);
        return;
      }

      // Criar nova inscrição
      const novaInscricao: Inscricao = {
        id: `inscricao_${Date.now()}`,
        cursoId,
        cursoTitulo: curso.titulo,
        userId: currentUser.id,
        userName: currentUser.name || "",
        userRank: currentUser.rank || "Policial",
        status: "pendente",
        data: new Date().toISOString()
      };

      // Adicionar nova inscrição ao estado
      const inscricoesAtualizadas = [...inscricoes, novaInscricao];
      setInscricoes(inscricoesAtualizadas);
      
      // Salvar no localStorage
      localStorage.setItem('inscricoesCursos', JSON.stringify(inscricoesAtualizadas));

      setSuccess("Inscrição realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao inscrever:", error);
      setError("Ocorreu um erro ao fazer a inscrição. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para cancelar inscrição em um curso
   */
  const cancelarInscricao = async (cursoId: string) => {
    setIsLoading(true);
    try {
      // Verificar se o usuário está inscrito
      if (!isInscrito(cursoId)) {
        setError("Você não está inscrito neste curso.");
        setIsLoading(false);
        return;
      }

      // Remover inscrição
      const inscricoesAtualizadas = inscricoes.filter(
        inscricao => !(inscricao.cursoId === cursoId && currentUser && inscricao.userId === currentUser.id)
      );
      
      setInscricoes(inscricoesAtualizadas);
      
      // Salvar no localStorage
      localStorage.setItem('inscricoesCursos', JSON.stringify(inscricoesAtualizadas));

      setSuccess("Inscrição cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      setError("Ocorreu um erro ao cancelar a inscrição. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar cursos
  const filteredCursos = cursos.filter(curso => 
    (searchQuery === "" || 
      curso.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curso.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curso.instrutor.toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (categoryFilter === "todas" || curso.categoria === categoryFilter) &&
    (activeTab === "disponiveis" ? curso.status === "disponivel" : true)
  )

  // Obter minhas inscrições
  const usuarioInscricoes = inscricoes.filter(i => 
    currentUser && i.userId === currentUser.id
  )

  // Obter categorias de cursos para o filtro
  const categorias = Array.from(new Set(cursos.map(curso => curso.categoria)))

  // Obter cursos inscritos
  const cursosInscritos = usuarioInscricoes.map(inscricao => {
    const curso = cursos.find(c => c.id === inscricao.cursoId);
    if (!curso) return null;
    return {
      ...curso,
      inscricaoStatus: inscricao.status,
      inscricaoData: inscricao.data
    } as CursoInscrito;
  }).filter(Boolean) as CursoInscrito[];

  const handleVerDetalhes = (curso: Curso | CursoInscrito) => {
    setSelectedCurso(curso)
    setDetailsOpen(true)
  }

  // Função para abrir o Dialog do formulário
  const handleInscreverClick = (cursoId: string) => {
    setInscricaoCursoId(cursoId)
    setFormDialogOpen(true)
  }

  // Função para adicionar inscrição após o envio do formulário
  const handleFormSubmit = () => {
    if (!inscricaoCursoId || !currentUser) return
    // Adicionar inscrição no localStorage
    const inscricoesSalvas = localStorage.getItem("inscricoesCursos")
    let inscricoesParsed: Inscricao[] = inscricoesSalvas ? JSON.parse(inscricoesSalvas) : []
    // Evitar duplicidade
    if (!inscricoesParsed.some(i => i.cursoId === inscricaoCursoId && i.userId === currentUser.id)) {
      const curso = cursos.find(c => c.id === inscricaoCursoId)
      inscricoesParsed.push({
        id: Date.now().toString(),
        cursoId: inscricaoCursoId,
        cursoTitulo: curso?.titulo || "",
        userId: currentUser.id,
        userName: currentUser.name,
        userRank: currentUser.rank || currentUser.patente || "",
        status: "pendente",
        data: new Date().toISOString()
      })
      localStorage.setItem("inscricoesCursos", JSON.stringify(inscricoesParsed))
      setInscricoes(inscricoesParsed.filter(i => i.userId === currentUser.id))
      toast.success("Inscrição registrada! Aguarde aprovação do instrutor.")
    }
    setFormDialogOpen(false)
    setInscricaoCursoId(null)
  }

  return (
    <div className="space-y-6 px-4 w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Cursos</h2>
        <p className="text-rota-darkgold">Acesse os cursos disponíveis para o batalhão</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar curso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm bg-black border-rota-darkgold text-rota-lightgold"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-rota-black border border-rota-darkgold">
          <TabsTrigger value="disponiveis" className="data-[state=active]:bg-rota-gold data-[state=active]:text-black">
            Cursos Disponíveis
          </TabsTrigger>
          <TabsTrigger value="minhas-inscricoes" className="data-[state=active]:bg-rota-gold data-[state=active]:text-black">
            Minhas Inscrições
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="disponiveis" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 border-rota-darkgold">
              <CardHeader>
                <CardTitle className="text-[#ffbf00]">Filtrar Cursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-rota-darkgold" />
                  <Input
                    type="search"
                    placeholder="Pesquisar cursos..."
                    className="pl-9 bg-rota-gray border-rota-darkgold text-rota-gold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-rota-gold">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent className="bg-rota-gray border-rota-darkgold text-rota-gold">
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("todas")
                  }}
                  className="w-full border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
            
            <div className="col-span-1 md:col-span-2 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="border-rota-darkgold">
                      <div className="flex flex-col">
                        <Skeleton className="h-[200px] w-full" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredCursos.length === 0 ? (
                <Alert variant="default" className="border-rota-darkgold bg-rota-black">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Nenhum curso encontrado</AlertTitle>
                  <AlertDescription>
                    Não foram encontrados cursos com os filtros selecionados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4 grid-cols-1">
                  {filteredCursos.map(curso => (
                    <Card key={curso.id} className="border-rota-darkgold overflow-hidden">
                      <div className="flex flex-col h-full">
                        {curso.imagem && (
                          <div className="w-full h-[200px] relative overflow-hidden">
                            <Image
                              src={curso.imagem}
                              alt={curso.titulo}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 z-10">
                              <Badge 
                                variant={(curso.status === "disponivel" ? "default" : "destructive") as BadgeVariant}
                              >
                                {curso.status === "disponivel" ? "Disponível" : "Indisponível"}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 p-4 flex flex-col bg-rota-black">
                          <div>
                            <h3 className="text-lg font-bold text-[#ffbf00]">{curso.titulo}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-rota-gold border-rota-darkgold">
                                {curso.categoria}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-rota-gold mt-2">{curso.descricao}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            <div className="flex items-center text-xs text-rota-darkgold">
                              <User2 className="h-3.5 w-3.5 mr-1" />
                              <span>Instrutor: {curso.instrutor}</span>
                            </div>
                            <div className="flex items-center text-xs text-rota-darkgold">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Duração: {curso.duracao}</span>
                            </div>
                            <div className="flex items-center text-xs text-rota-darkgold">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>Data: {new Date(curso.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center text-xs text-rota-darkgold">
                              <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                              <span>Vagas: {curso.vagasPreenchidas || 0}/{curso.vagas || 0}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center border-t border-rota-darkgold/30 pt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                              onClick={() => handleVerDetalhes(curso)}
                            >
                              Ver detalhes
                            </Button>
                            
                            {curso.status === "disponivel" && (
                              <>
                                {isInscrito(curso.id) ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => cancelarInscricao(curso.id)}
                                  >
                                    Cancelar inscrição
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-rota-gold text-black hover:bg-rota-darkgold"
                                    disabled={
                                      (curso.vagasPreenchidas || 0) >= (curso.vagas || 0)
                                    }
                                    onClick={() => handleInscreverClick(curso.id)}
                                  >
                                    {(curso.vagasPreenchidas || 0) >= (curso.vagas || 0)
                                      ? "Vagas esgotadas"
                                      : "Inscrever-se"}
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="minhas-inscricoes" className="mt-4">
          {usuarioInscricoes.length === 0 ? (
            <Alert variant="default" className="border-rota-darkgold bg-rota-black">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhuma inscrição</AlertTitle>
              <AlertDescription>
                Você ainda não se inscreveu em nenhum curso. Confira os cursos disponíveis para se inscrever.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {cursosInscritos.map(curso => (
                <Card key={curso?.id || `curso-${Math.random()}`} className="border-rota-darkgold overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#ffbf00]">{curso?.titulo}</CardTitle>
                    <CardDescription className="text-rota-darkgold">
                      {curso?.categoria} • {curso?.duracao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-4">
                      <Badge 
                        variant={
                          (curso?.inscricaoStatus === "aprovada" 
                            ? "default" 
                            : curso?.inscricaoStatus === "rejeitada" 
                              ? "destructive" 
                              : "outline") as BadgeVariant
                        }
                      >
                        {curso?.inscricaoStatus === "aprovada" 
                          ? "Aprovada" 
                          : curso?.inscricaoStatus === "rejeitada" 
                            ? "Rejeitada" 
                            : "Pendente"}
                      </Badge>
                      <span className="text-xs text-rota-darkgold ml-2">
                        Inscrição: {curso?.inscricaoData ? new Date(curso.inscricaoData).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-rota-darkgold mb-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Data do curso: {curso?.data ? new Date(curso.data).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                    <div className="flex items-center text-xs text-rota-darkgold">
                      <User2 className="h-3.5 w-3.5 mr-1" />
                      <span>Instrutor: {curso?.instrutor}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-rota-darkgold/30 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
                      onClick={() => curso && handleVerDetalhes(curso)}
                    >
                      Ver detalhes
                    </Button>
                    
                    {curso?.inscricaoStatus !== "rejeitada" && curso?.id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelarInscricao(curso.id)}
                      >
                        Cancelar inscrição
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes do curso */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[600px] max-h-[90vh] flex flex-col">
          {selectedCurso && (
            <>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-[#ffbf00]">{selectedCurso.titulo}</DialogTitle>
                <DialogDescription className="text-rota-darkgold">
                  {selectedCurso.categoria} • Instrutor: {selectedCurso.instrutor}
                  {'inscricaoStatus' in selectedCurso && (
                    <span className="ml-2">
                      • Status: <span className={`font-medium ${
                        selectedCurso.inscricaoStatus === 'aprovada' 
                          ? 'text-green-500' 
                          : selectedCurso.inscricaoStatus === 'rejeitada' 
                            ? 'text-red-500' 
                            : 'text-yellow-500'
                      }`}>
                        {selectedCurso.inscricaoStatus === 'aprovada' 
                          ? 'Aprovada' 
                          : selectedCurso.inscricaoStatus === 'rejeitada' 
                            ? 'Rejeitada' 
                            : 'Pendente'}
                      </span>
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="overflow-y-auto pr-2 flex-grow">
                {selectedCurso.imagem && (
                  <div className="w-full h-[200px] relative mb-4 overflow-hidden rounded">
                    <Image
                      src={selectedCurso.imagem}
                      alt={selectedCurso.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="bg-rota-black p-3 rounded">
                    <h3 className="text-sm font-semibold mb-1 text-rota-gold">Descrição do Curso</h3>
                    <p className="text-sm text-rota-darkgold">{selectedCurso.descricao}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rota-black p-3 rounded">
                      <h3 className="text-sm font-semibold mb-1 text-rota-gold">Data</h3>
                      <div className="flex items-center text-sm text-rota-darkgold">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(selectedCurso.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-rota-black p-3 rounded">
                      <h3 className="text-sm font-semibold mb-1 text-rota-gold">Duração</h3>
                      <div className="flex items-center text-sm text-rota-darkgold">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{selectedCurso.duracao}</span>
                      </div>
                    </div>
                    
                    <div className="bg-rota-black p-3 rounded">
                      <h3 className="text-sm font-semibold mb-1 text-rota-gold">Instrutor</h3>
                      <div className="flex items-center text-sm text-rota-darkgold">
                        <User2 className="h-4 w-4 mr-1" />
                        <span>{selectedCurso.instrutor}</span>
                      </div>
                    </div>
                    
                    <div className="bg-rota-black p-3 rounded">
                      <h3 className="text-sm font-semibold mb-1 text-rota-gold">Vagas</h3>
                      <div className="flex items-center text-sm text-rota-darkgold">
                        <BadgeCheck className="h-4 w-4 mr-1" />
                        <span>{selectedCurso.vagasPreenchidas || 0} de {selectedCurso.vagas || 0} preenchidas</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Links e Arquivos */}
                  {(selectedCurso.links?.length || selectedCurso.arquivos?.length) ? (
                    <div className="bg-rota-black p-3 rounded">
                      <h3 className="text-sm font-semibold mb-2 text-rota-gold">Materiais do Curso</h3>
                      
                      {selectedCurso.links && selectedCurso.links.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium mb-1 text-rota-darkgold">Links:</h4>
                          <ul className="space-y-1">
                            {selectedCurso.links.map((link, index) => (
                              <li key={index} className="text-xs">
                                <a 
                                  href={link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-400 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  <span className="truncate">{link}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedCurso.arquivos && selectedCurso.arquivos.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium mb-1 text-rota-darkgold">Arquivos:</h4>
                          <ul className="space-y-1">
                            {selectedCurso.arquivos.map((arquivo, index) => (
                              <li key={index} className="text-xs">
                                <a 
                                  href={arquivo.url} 
                                  download={arquivo.nome}
                                  className="flex items-center text-blue-400 hover:underline"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  <span>{arquivo.nome}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
              
              <DialogFooter className="flex-shrink-0 mt-2 border-t border-rota-darkgold pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsOpen(false)}
                  className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
                >
                  Fechar
                </Button>
                
                {selectedCurso.status === "disponivel" && !('inscricaoStatus' in selectedCurso && selectedCurso.inscricaoStatus === 'rejeitada') && (
                  <>
                    {isInscrito(selectedCurso.id) ? (
                      <Button
                        variant="destructive"
                        onClick={() => cancelarInscricao(selectedCurso.id)}
                      >
                        Cancelar inscrição
                      </Button>
                    ) : (
                      <Button
                        className="bg-rota-gold text-black hover:bg-rota-darkgold"
                        disabled={
                          (selectedCurso.vagasPreenchidas || 0) >= (selectedCurso.vagas || 0)
                        }
                        onClick={() => handleInscreverClick(selectedCurso.id)}
                      >
                        {(selectedCurso.vagasPreenchidas || 0) >= (selectedCurso.vagas || 0)
                          ? "Vagas esgotadas"
                          : "Inscrever-se"}
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog com Google Forms */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inscrição no Curso</DialogTitle>
            <DialogDescription>Preencha o formulário abaixo para concluir sua inscrição.</DialogDescription>
          </DialogHeader>
          <div className="w-full h-[600px]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfDUMMYFORMURL/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Formulário de Inscrição"
              onLoad={() => {
                // O usuário deve clicar em "Enviar" no Google Forms
              }}
            >Carregando…</iframe>
          </div>
          <DialogFooter>
            <Button onClick={handleFormSubmit} className="bg-rota-gold text-black hover:bg-amber-500 w-full">
              Já preenchi o formulário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 