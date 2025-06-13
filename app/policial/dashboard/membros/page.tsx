"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Users, Shield, Award, MapPin, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Policial {
  id: string
  nome: string
  rg: string
  graduacao: string
  unidade: string
  funcao: string
  status: "ativo" | "inativo" | "afastado" | "ferias"
  dataIngresso: string
  avatar?: string
  ultimaAtualizacao?: string
  observacoes?: string
}

export default function PolicialMembrosPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [policiais, setPoliciais] = useState<Policial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [unidadeFilter, setUnidadeFilter] = useState("todas")
  const [graduacaoFilter, setGraduacaoFilter] = useState("todas")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    nome: "",
    rg: "",
    graduacao: "",
    unidade: "",
    funcao: "",
    status: "ativo",
    dataIngresso: "",
    avatar: ""
  })

  useEffect(() => {
    // Carregar informações do usuário atual
    try {
      const user = localStorage.getItem("currentUser")
      if (user) {
        const userData = JSON.parse(user)
        if (userData.role !== "policial" && userData.role !== "admin") {
          router.push("/login")
          return
        }
        setCurrentUser(userData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
    }

    // Carregar lista de policiais
    const storedPoliciais = localStorage.getItem("policiais")
    if (storedPoliciais) {
      setPoliciais(JSON.parse(storedPoliciais))
    }

    setIsLoading(false)
  }, [router])

  // Filtrar policiais
  const filteredPoliciais = policiais.filter(policial => {
    const matchesSearch = searchTerm === "" || 
      policial.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policial.rg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policial.graduacao.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || policial.status === statusFilter
    const matchesUnidade = unidadeFilter === "todas" || policial.unidade === unidadeFilter
    const matchesGraduacao = graduacaoFilter === "todas" || policial.graduacao === graduacaoFilter

    return matchesSearch && matchesStatus && matchesUnidade && matchesGraduacao
  })

  // Obter unidades únicas
  const unidades = Array.from(new Set(policiais.map(p => p.unidade)))
  // Obter graduações únicas
  const graduacoes = Array.from(new Set(policiais.map(p => p.graduacao)))

  const handleAddMember = () => {
    if (!newMember.nome || !newMember.rg || !newMember.graduacao || !newMember.unidade || !newMember.dataIngresso) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }
    const novoPolicial = {
      ...newMember,
      id: Date.now().toString(),
      ultimaAtualizacao: new Date().toISOString(),
      observacoes: ""
    }
    const updatedPoliciais = [...policiais, novoPolicial]
    setPoliciais(updatedPoliciais)
    localStorage.setItem("policiais", JSON.stringify(updatedPoliciais))
    setIsAddDialogOpen(false)
    setNewMember({
      nome: "",
      rg: "",
      graduacao: "",
      unidade: "",
      funcao: "",
      status: "ativo",
      dataIngresso: "",
      avatar: ""
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-center">
          <div className="h-6 w-6 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-2 text-xs text-rota-darkgold">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full h-full min-h-screen px-0 md:px-4 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">
            Membros
          </h2>
          <p className="text-rota-darkgold">
            Visualize os membros do Batalhão Tático Especial.
          </p>
        </div>
        <Button className="bg-rota-gold text-black hover:bg-amber-500" onClick={() => setIsAddDialogOpen(true)}>
          + Novo Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 bg-rota-gray border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {policiais.length}
            </div>
            <p className="text-xs text-rota-darkgold">Policiais registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 bg-rota-gray border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Membros Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {policiais.filter(p => p.status === "ativo").length}
            </div>
            <p className="text-xs text-rota-darkgold">Em serviço</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 bg-rota-gray border-rota-darkgold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#ffbf00]">Unidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ffbf00]">
              {unidades.length}
            </div>
            <p className="text-xs text-rota-darkgold">Unidades ativas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="search" className="text-rota-darkgold">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-rota-darkgold" />
            <Input
              id="search"
              placeholder="Nome, RG ou graduação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-rota-gray border-rota-darkgold text-rota-gold"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="status" className="text-rota-darkgold">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="afastado">Afastado</SelectItem>
              <SelectItem value="ferias">Férias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="unidade" className="text-rota-darkgold">Unidade</Label>
          <Select
            value={unidadeFilter}
            onValueChange={setUnidadeFilter}
          >
            <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {unidades.map((unidade) => (
                <SelectItem key={unidade} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="graduacao" className="text-rota-darkgold">Graduação</Label>
          <Select
            value={graduacaoFilter}
            onValueChange={setGraduacaoFilter}
          >
            <SelectTrigger className="bg-rota-gray border-rota-darkgold text-rota-gold">
              <SelectValue placeholder="Selecione a graduação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {graduacoes.map((graduacao) => (
                <SelectItem key={graduacao} value={graduacao}>
                  {graduacao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoliciais.map((policial) => (
          <Card key={policial.id} className="bg-rota-gray border-rota-darkgold">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-rota-darkgold">
                  <AvatarImage src={policial.avatar} alt={policial.nome} />
                  <AvatarFallback className="bg-rota-darkgold text-black text-lg">
                    {policial.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-[#ffbf00] truncate">
                      {policial.nome}
                    </h3>
                    <Badge
                      variant={policial.status === "ativo" ? "default" : "secondary"}
                      className={
                        policial.status === "ativo" ? "bg-green-500" :
                        policial.status === "inativo" ? "bg-red-500" :
                        policial.status === "afastado" ? "bg-yellow-500" :
                        "bg-blue-500"
                      }
                    >
                      {policial.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-rota-darkgold">
                      <Shield className="h-4 w-4" />
                      <span>{policial.graduacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-rota-darkgold">
                      <MapPin className="h-4 w-4" />
                      <span>{policial.unidade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-rota-darkgold">
                      <Award className="h-4 w-4" />
                      <span>{policial.funcao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-rota-darkgold">
                      <Calendar className="h-4 w-4" />
                      <span>Ingresso: {new Date(policial.dataIngresso).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPoliciais.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-rota-darkgold mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#ffbf00] mb-2">Nenhum membro encontrado</h3>
          <p className="text-rota-darkgold">
            Tente ajustar os filtros de busca para encontrar o que procura.
          </p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-[#ffbf00]">Cadastrar Novo Membro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo*</Label>
              <Input id="nome" value={newMember.nome} onChange={e => setNewMember({ ...newMember, nome: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rg">RG*</Label>
              <Input id="rg" value={newMember.rg} onChange={e => setNewMember({ ...newMember, rg: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="graduacao">Graduação*</Label>
              <Input id="graduacao" value={newMember.graduacao} onChange={e => setNewMember({ ...newMember, graduacao: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade*</Label>
              <Input id="unidade" value={newMember.unidade} onChange={e => setNewMember({ ...newMember, unidade: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="funcao">Função</Label>
              <Input id="funcao" value={newMember.funcao} onChange={e => setNewMember({ ...newMember, funcao: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataIngresso">Data de Ingresso*</Label>
              <Input id="dataIngresso" type="date" value={newMember.dataIngresso} onChange={e => setNewMember({ ...newMember, dataIngresso: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar (URL)</Label>
              <Input id="avatar" value={newMember.avatar} onChange={e => setNewMember({ ...newMember, avatar: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-rota-darkgold text-rota-darkgold hover:bg-rota-gray/50">
              Cancelar
            </Button>
            <Button onClick={handleAddMember} className="bg-rota-gold text-black hover:bg-amber-500">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 