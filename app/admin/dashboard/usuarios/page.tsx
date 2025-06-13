rm -rf node_modules
npm installrm -rf node_modules
npm install"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Edit, Trash2, AlertCircle, ChevronUp, ChevronDown, Shield, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type User, type UserRole, defaultPermissions } from "@/lib/types"
import { AdminPermissions } from "@/components/admin-permissions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, FileEdit, Lock, Unlock } from "lucide-react"
import { AlertSuccess } from "@/components/AlertSuccess"
import { AlertError } from "@/components/AlertError"
import { useToast } from "@/hooks/use-toast"

interface Usuario {
  id: string
  nome: string
  email: string
  rg: string
  patente: string
  graduacao: string
  unidade: string
  funcao: string
  telefone: string
  dataIngresso: string
  avatarUrl: string | null
  status: "Ativo" | "Inativo" | "Bloqueado"
  ultimoAcesso: string
}

export default function UsuariosPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Estados
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const [sortField, setSortField] = useState<keyof Usuario>("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "operador" as UserRole,
    patente: "",
    password: "",
    confirmPassword: "",
    status: "Ativo" as "Ativo" | "Inativo" | "Bloqueado"
  })

  // Código de convite para registro (em um sistema real, seria gerado dinamicamente)
  const CODIGO_CONVITE_VALIDO = "BTE2023"
  const [codigoConvite, setCodigoConvite] = useState("")

  useEffect(() => {
    // Carregar informações do administrador atual
    const admin = localStorage.getItem("currentAdmin")
    if (admin) {
      setCurrentAdmin(JSON.parse(admin))
    } else {
      router.push("/admin/login?redirectTo=/admin/dashboard/usuarios")
      return
    }

    // Carregar usuários administrativos
    const policiais = localStorage.getItem("policiais")
    if (policiais) {
      const usuariosFormatados = JSON.parse(policiais).map((policial: any) => ({
        id: policial.id,
        nome: policial.nome,
        email: policial.email || `${policial.nome.toLowerCase().replace(/\s+/g, '.')}@rota.com`,
        rg: policial.rg,
        patente: policial.patente,
        graduacao: policial.graduacao || policial.patente,
        unidade: policial.unidade,
        funcao: policial.funcao,
        telefone: policial.telefone,
        dataIngresso: policial.dataIngresso,
        avatarUrl: policial.avatarUrl,
        status: policial.status || "Ativo",
        ultimoAcesso: policial.ultimoAcesso || "Nunca acessou"
      }))
      setUsuarios(usuariosFormatados)
    } else {
      // Se não houver usuários, inicializar com o usuário atual
      const currentAdmin = JSON.parse(admin)
      setUsuarios([{
        id: currentAdmin.id,
        nome: currentAdmin.name,
        email: currentAdmin.email,
        rg: "",
        patente: "",
        graduacao: "",
        unidade: "",
        funcao: "",
        telefone: "",
        dataIngresso: "",
        avatarUrl: currentAdmin.avatarUrl,
        status: "Ativo",
        ultimoAcesso: "Nunca acessou"
      }])
      localStorage.setItem("policiais", JSON.stringify([{
        id: currentAdmin.id,
        nome: currentAdmin.name,
        email: currentAdmin.email,
        rg: "",
        patente: "",
        graduacao: "",
        unidade: "",
        funcao: "",
        telefone: "",
        dataIngresso: "",
        avatarUrl: currentAdmin.avatarUrl,
        status: "Ativo",
        ultimoAcesso: "Nunca acessou"
      }]))
    }

    setIsLoading(false)
  }, [router])

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Função para abrir o modal de adicionar usuário
  const handleAddUser = () => {
    setCurrentUser(null)
    setFormData({
      name: "",
      email: "",
      role: "operador",
      patente: "",
      password: "",
      confirmPassword: "",
    })
    setCodigoConvite("")
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de editar usuário
  const handleEditUser = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsEditOpen(true)
  }

  // Função para abrir o modal de excluir usuário
  const handleDeleteUser = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsDeleteOpen(true)
  }

  // Função para salvar um novo usuário ou atualizar um existente
  const handleSaveUser = () => {
    // Validações
    if (!formData.name.trim()) {
      setErrorMessage("Por favor, insira o nome completo.")
      return
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Por favor, insira um email válido.")
      return
    }

    // Verificar se o email já existe (exceto para o usuário atual)
    const emailExists = usuarios.some(
      (usuario: Usuario) =>
        usuario.email.toLowerCase() === formData.email.toLowerCase() && (!selectedUsuario || usuario.id !== selectedUsuario?.id),
    )

    if (emailExists) {
      setErrorMessage("Este email já está em uso por outro usuário.")
      return
    }

    // Validar senha para novos usuários
    if (!selectedUsuario) {
      if (formData.password.length < 6) {
        setErrorMessage("A senha deve ter pelo menos 6 caracteres.")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("As senhas não coincidem.")
        return
      }

      // Verificar código de convite
      if (codigoConvite !== CODIGO_CONVITE_VALIDO) {
        setErrorMessage("Código de convite inválido.")
        return
      }
    }

    try {
      let updatedUsuarios: Usuario[]

      if (selectedUsuario) {
        // Atualizar usuário existente
        updatedUsuarios = usuarios.map((usuario: Usuario) => {
          if (usuario.id === selectedUsuario.id) {
            return {
              ...usuario,
              nome: formData.name,
              email: formData.email,
              patente: formData.patente,
              graduacao: formData.patente,
              unidade: formData.patente,
              funcao: formData.patente,
              telefone: formData.patente,
              status: formData.status as "Ativo" | "Inativo" | "Bloqueado"
            }
          }
          return usuario
        })
      } else {
        // Adicionar novo usuário
        const novoUsuario: Usuario = {
          id: Date.now().toString(),
          nome: formData.name,
          email: formData.email,
          rg: "",
          patente: formData.patente,
          graduacao: formData.patente,
          unidade: formData.patente,
          funcao: formData.patente,
          telefone: formData.patente,
          dataIngresso: new Date().toISOString(),
          avatarUrl: null,
          status: "Ativo",
          ultimoAcesso: new Date().toISOString()
        }

        updatedUsuarios = [...usuarios, novoUsuario]
      }

      localStorage.setItem("usuarios", JSON.stringify(updatedUsuarios))
      setUsuarios(updatedUsuarios)
      toast({
        title: "Sucesso",
        description: selectedUsuario ? "Usuário atualizado com sucesso" : "Usuário adicionado com sucesso",
        className: "bg-rota-darkgold text-black",
      })
      setIsDialogOpen(false)
      setSelectedUsuario(null)
      setFormData({
        name: "",
        email: "",
        role: "operador" as UserRole,
        patente: "",
        password: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário",
        variant: "destructive",
        className: "bg-rota-darkgold text-black"
      })
    }
  }
}

  // Função para confirmar a exclusão de um usuário
  const handleConfirmDelete = async () => {
    if (!selectedUsuario) return;

    try {
      // Remover do localStorage
      const storedUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      const newUsuarios = storedUsuarios.filter((u) => u.id !== selectedUsuario.id);

      localStorage.setItem("usuarios", JSON.stringify(newUsuarios));
      setUsuarios(newUsuarios);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
        className: "bg-rota-darkgold text-black",
      });
      setIsDeleteOpen(false);
      setSelectedUsuario(null);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário",
        variant: "destructive",
      });
    }
  };

  // Função para alternar a direção da ordenação
  const handleSort = (field: keyof Usuario) => {
    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-500 text-white";
      case "Inativo":
        return "bg-yellow-500 text-white";
      case "Bloqueado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Função para visualizar detalhes do usuário
  const handleViewUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsViewOpen(true);
  };

  // Função para alterar o status do usuário
  const handleStatusChange = async (usuario: Usuario, novoStatus: "Ativo" | "Inativo" | "Bloqueado") => {
    try {
      const updatedUsuarios = usuarios.map((u: Usuario) =>
        u.id === usuario.id ? { ...u, status: novoStatus } : u
      );

      localStorage.setItem("usuarios", JSON.stringify(updatedUsuarios));
      setUsuarios(updatedUsuarios);
      toast({
        title: "Sucesso",
        description: `Status do usuário alterado para ${novoStatus}`,
        className: "bg-rota-darkgold text-black",
      });
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status do usuário",
        variant: "destructive",
        className: "bg-rota-darkgold text-black"
      });
    }
  };
  };

  // Carregar usuários do localStorage
  useEffect(() => {
    try {
      const storedUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      setUsuarios(storedUsuarios);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setErrorMessage("Erro ao carregar usuários");
      setIsLoading(false);
    }
  }, []);

  // Carregar admin do localStorage
  useEffect(() => {
    try {
      const storedAdmin = JSON.parse(localStorage.getItem("admin") || "null");
      setCurrentAdmin(storedAdmin);
    } catch (error) {
      console.error("Erro ao carregar admin:", error);
      setErrorMessage("Erro ao carregar admin");
    }
  }, []);

  // Filtrar e ordenar usuários
  const filteredUsuarios = usuarios
    .filter((usuario: Usuario) => {
      // Filtro de busca
      const matchesSearch =
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.rg.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.telefone.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de status
      const matchesStatus = filtroStatus === "todos" || usuario.status === filtroStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a: Usuario, b: Usuario) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    });

  if (isLoading || !currentAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
          <p className="mt-4 text-rota-darkgold">Carregando...</p>
        </div>
      </div>
    );
  }

      u.id === usuario.id ? { ...u, status: novoStatus } : u
    )
    setUsuarios(updatedUsuarios)
    
    // Atualizar no localStorage
    localStorage.setItem("policiais", JSON.stringify(updatedUsuarios))

    toast({
      title: "Status atualizado",
      description: `Status do usuário ${usuario.nome} atualizado para ${novoStatus}.`,
    })
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Erro ao atualizar status do usuário.",
    })
  }
}

if (isLoading || !currentAdmin) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-center">
        <div className="h-12 w-12 rounded-full bg-rota-gold mx-auto"></div>
        <p className="mt-4 text-rota-darkgold">Carregando...</p>
      </div>
    </div>
  )
}

return (
  <div className="flex flex-col h-screen">
    <div className="flex-1 overflow-y-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Gestão de Usuários</h2>
          <p className="text-rota-darkgold">Administração de acessos ao sistema.</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2 bg-rota-gold text-black hover:bg-amber-500">
          <UserPlus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </Button>
      </div>

      {(errorMessage || successMessage) && (
        <div className="mb-6">
          {errorMessage && (
            <AlertError message={errorMessage} onClose={() => setErrorMessage("")} />
          )}
          {successMessage && (
            <AlertSuccess message={successMessage} onClose={() => setSuccessMessage("")} />
          )}
        </div>
      )}

      <Tabs defaultValue="usuarios" className="mb-8 w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios" className="mt-8 space-y-8 w-full">
          <Card className="bg-rota-gray border-rota-darkgold">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuário..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativos</SelectItem>
                      <SelectItem value="Inativo">Inativos</SelectItem>
                      <SelectItem value="Bloqueado">Bloqueados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full text-rota-gold border-rota-gold"
                    onClick={() => {
                      setSearchTerm("")
                      setFiltroStatus("todos")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border shadow-md overflow-hidden mb-4 w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-rota-gray">
                  <TableHead className="cursor-pointer text-[#ffbf00]" onClick={() => handleSort("nome")}>
                    Nome {sortField === "nome" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead className="cursor-pointer text-[#ffbf00]" onClick={() => handleSort("email")}>
                    Email {sortField === "email" && (sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead className="text-[#ffbf00]">Status</TableHead>
                  <TableHead className="text-right text-[#ffbf00]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-rota-gold">Carregando...</TableCell>
                  </TableRow>
                ) : filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-rota-gold">Nenhum usuário encontrado.</TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium text-rota-gold">{usuario.nome}</TableCell>
                      <TableCell className="text-rota-gold">{usuario.email}</TableCell>
                      <TableCell className="text-rota-gold">
                        <Badge className={getStatusColor(usuario.status)}>
                          {usuario.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewUsuario(usuario)}
                          className="text-rota-gold border-rota-gold hover:bg-rota-gold hover:text-black"
                        >
                          Ver Detalhes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditUser(usuario)}
                          className="text-rota-gold border-rota-gold hover:bg-rota-gold hover:text-black"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteUser(usuario)}
                          className="text-rota-gold border-rota-gold hover:bg-red-600 hover:text-white hover:border-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="permissoes" className="mt-6">
          <Card className="bg-rota-gray border-rota-darkgold">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Configuração de Permissões</CardTitle>
              <CardDescription className="text-rota-darkgold">
                Gerencie as permissões de acesso dos usuários administrativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentAdmin ? (
                <AdminPermissions currentAdmin={currentAdmin} />
              ) : (
                <div className="text-center py-8 text-rota-gold">Carregando permissões...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para adicionar/editar usuário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedUsuario ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              {selectedUsuario
                ? "Atualize as informações do usuário no formulário abaixo."
                : "Preencha o formulário abaixo para adicionar um novo usuário administrativo."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-rota-gold">
                Nome Completo*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-black border-rota-darkgold text-rota-lightgold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-rota-gold">
                E-mail*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-black border-rota-darkgold text-rota-lightgold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-rota-gold">
                  Cargo*
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-rota-darkgold bg-black px-3 py-2 text-sm text-rota-lightgold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="admin">Administrador (Acesso Total)</option>
                  <option value="moderador">Moderador (Acesso Parcial)</option>
                  <option value="operador">Operador (Acesso Básico)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patente" className="text-rota-gold">
                  Patente (opcional)
                </Label>
                <Input
                  id="patente"
                  name="patente"
                  value={formData.patente}
                  onChange={handleInputChange}
                  className="bg-black border-rota-darkgold text-rota-lightgold"
                />
              </div>
            </div>

            {!selectedUsuario && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-rota-gold">
                      Senha*
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-black border-rota-darkgold text-rota-lightgold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-rota-gold">
                      Confirmar Senha*
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-black border-rota-darkgold text-rota-lightgold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoConvite" className="text-rota-gold">
                    Código de Convite*
                  </Label>
                  <Input
                    id="codigoConvite"
                    value={codigoConvite}
                    onChange={(e) => setCodigoConvite(e.target.value)}
                    className="bg-black border-rota-darkgold text-rota-lightgold"
                    required
                  />
                  <p className="text-xs text-rota-darkgold">Para demonstração, use o código: BTE2023</p>
                </div>
              </>
            )}

            {selectedUsuario && (
              <div className="bg-black p-4 rounded-md border border-rota-darkgold">
                <p className="text-sm text-rota-darkgold">
                  <Shield className="inline-block h-4 w-4 mr-1" />
                  Para alterar a senha, use a funcionalidade de redefinição de senha.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveUser}
              className="bg-rota-gold text-black hover:bg-amber-500"
            >
              {selectedUsuario ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmar exclusão */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-rota-gray border-rota-darkgold text-rota-gold sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-rota-darkgold">
              Tem certeza que deseja excluir o usuário {selectedUsuario?.nome}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-rota-darkgold text-rota-gold hover:bg-rota-black"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUsuario && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 border-2 border-rota-gold">
                  <AvatarImage src={selectedUsuario.avatarUrl || undefined} />
                  <AvatarFallback className="bg-rota-darkgold text-3xl">
                    {selectedUsuario.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{selectedUsuario.nome}</h3>
                  <Badge className={getStatusColor(selectedUsuario.status)}>
                    {selectedUsuario.status}
                  </Badge>
                </div>
                
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedUsuario.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RG:</span>
                    <span>{selectedUsuario.rg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graduação:</span>
                    <span>{selectedUsuario.graduacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unidade:</span>
                    <span>{selectedUsuario.unidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Função:</span>
                    <span>{selectedUsuario.funcao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span>{selectedUsuario.telefone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Ingresso:</span>
                    <span>{selectedUsuario.dataIngresso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Último Acesso:</span>
                    <span>{selectedUsuario.ultimoAcesso}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {selectedUsuario.status === "Ativo" ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedUsuario, "Inativo")}
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Desativar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedUsuario, "Bloqueado")}
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Bloquear
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleStatusChange(selectedUsuario, "Ativo")}
                  >
                    <Unlock className="h-4 w-4 mr-1" />
                    Ativar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  </div>
})
