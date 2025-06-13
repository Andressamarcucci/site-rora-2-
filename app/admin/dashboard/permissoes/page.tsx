"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShieldAlert, UserPlus } from "lucide-react"
import type { User, UserRole, Permission } from "@/lib/types"
import { defaultPermissions } from "@/lib/types"

export default function PermissoesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [accessRequests, setAccessRequests] = useState<any[]>([])
  const [permissionsByRole, setPermissionsByRole] = useState<Record<UserRole, Permission[]>>(
    JSON.parse(JSON.stringify(defaultPermissions))
  )
  const [editingRole, setEditingRole] = useState<UserRole | null>(null)

  // Verificador para saber se houve mudanças nas permissões
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Carregar usuários e solicitações de acesso
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Simulação - Em produção substituir por chamadas de API reais
        // Carregar dados do localStorage para demonstração
        const storedUsers = localStorage.getItem("admins")
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
        }

        // Carregar solicitações de acesso
        const storedRequests = localStorage.getItem("accessRequests")
        if (storedRequests) {
          setAccessRequests(JSON.parse(storedRequests))
        } else {
          // Inicializar com array vazio se não existir
          setAccessRequests([])
        }

        // Carregar configurações de permissões personalizadas se existirem
        const storedPermissions = localStorage.getItem("permissionsByRole")
        if (storedPermissions) {
          setPermissionsByRole(JSON.parse(storedPermissions))
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Tente novamente.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Salvar permissões atualizadas
  const savePermissions = () => {
    try {
      localStorage.setItem("permissionsByRole", JSON.stringify(permissionsByRole))
      setHasChanges(false)
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar permissões:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as permissões.",
        variant: "destructive"
      })
    }
  }

  // Resetar permissões para os valores padrão
  const resetPermissions = () => {
    setPermissionsByRole(JSON.parse(JSON.stringify(defaultPermissions)))
    setHasChanges(true)
  }

  // Atualizar permissão específica para um cargo
  const togglePermission = (role: UserRole, permission: Permission) => {
    setPermissionsByRole(prev => {
      const updatedPermissions = { ...prev }
      
      if (updatedPermissions[role].includes(permission)) {
        // Remover permissão
        updatedPermissions[role] = updatedPermissions[role].filter(p => p !== permission)
      } else {
        // Adicionar permissão
        updatedPermissions[role] = [...updatedPermissions[role], permission]
      }
      
      setHasChanges(true)
      return updatedPermissions
    })
  }

  // Aprovar solicitação de acesso
  const approveRequest = (requestId: string, role: UserRole = "operador") => {
    try {
      // Encontrar a solicitação
      const request = accessRequests.find(req => req.id === requestId)
      if (!request) return

      // Criar novo usuário
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: request.nome,
        email: request.email,
        role: role,
        patente: request.patente || "",
        permissions: permissionsByRole[role],
        createdAt: new Date().toISOString()
      }

      // Adicionar usuário à lista
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("admins", JSON.stringify(updatedUsers))

      // Remover solicitação
      const updatedRequests = accessRequests.filter(req => req.id !== requestId)
      setAccessRequests(updatedRequests)
      localStorage.setItem("accessRequests", JSON.stringify(updatedRequests))

      toast({
        title: "Sucesso",
        description: `Acesso aprovado para ${request.nome}.`,
      })
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a solicitação.",
        variant: "destructive"
      })
    }
  }

  // Rejeitar solicitação de acesso
  const rejectRequest = (requestId: string) => {
    try {
      // Remover solicitação
      const updatedRequests = accessRequests.filter(req => req.id !== requestId)
      setAccessRequests(updatedRequests)
      localStorage.setItem("accessRequests", JSON.stringify(updatedRequests))

      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação de acesso foi rejeitada.",
      })
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a solicitação.",
        variant: "destructive"
      })
    }
  }

  // Adicionar nova solicitação de acesso (somente para demonstração)
  const addDemoRequest = () => {
    const demoRequest = {
      id: `req-${Date.now()}`,
      nome: "Policial Demonstração",
      email: `policial${Math.floor(Math.random() * 1000)}@rota.com`,
      patente: "Soldado",
      dataSolicitacao: new Date().toISOString()
    }

    const updatedRequests = [...accessRequests, demoRequest]
    setAccessRequests(updatedRequests)
    localStorage.setItem("accessRequests", JSON.stringify(updatedRequests))

    toast({
      title: "Solicitação criada",
      description: "Uma solicitação de demonstração foi criada.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-rota-gold" />
          <p className="mt-2 text-rota-darkgold">Carregando permissões...</p>
        </div>
      </div>
    )
  }

  const allPermissions: Permission[] = [
    "gerenciar_usuarios",
    "gerenciar_membros",
    "gerenciar_hierarquias",
    "gerenciar_fardamentos",
    "gerenciar_viaturas",
    "visualizar_relatorios"
  ]

  const permissionLabels: Record<Permission, string> = {
    "gerenciar_usuarios": "Gerenciar Usuários do Painel",
    "gerenciar_membros": "Gerenciar Membros (Policiais)",
    "gerenciar_hierarquias": "Gerenciar Hierarquias",
    "gerenciar_fardamentos": "Gerenciar Fardamentos",
    "gerenciar_viaturas": "Gerenciar Viaturas",
    "visualizar_relatorios": "Visualizar Relatórios"
  }

  return (
    <div className="space-y-8 min-h-[calc(100vh-16rem)] w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Gerenciamento de Permissões</h2>
        <p className="text-rota-darkgold">
          Configure permissões de acesso e aprove novas solicitações de acesso ao sistema.
        </p>
      </div>

      <Tabs defaultValue="permissoes" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="permissoes">Permissões por Cargo</TabsTrigger>
          <TabsTrigger value="solicitacoes">
            Solicitações de Acesso
            {accessRequests.length > 0 && (
              <span className="ml-2 bg-rota-gold text-black px-2 py-0.5 rounded-full text-xs">
                {accessRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Aba de Permissões por Cargo */}
        <TabsContent value="permissoes" className="space-y-6">
          <Card className="bg-rota-gray border-rota-darkgold">
            <CardHeader>
              <CardTitle className="text-[#ffbf00]">Configuração de Permissões</CardTitle>
              <CardDescription className="text-rota-darkgold">
                Defina quais permissões cada cargo terá no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Permissões para Admin */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#ffbf00]">Administrador</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-rota-gold text-rota-darkgold hover:bg-rota-gray/50"
                      onClick={() => setEditingRole(editingRole === "admin" ? null : "admin")}
                    >
                      {editingRole === "admin" ? "Fechar" : "Editar"}
                    </Button>
                  </div>
                  
                  {editingRole === "admin" ? (
                    <div className="bg-black/40 p-4 rounded-md space-y-2">
                      {allPermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`admin-${permission}`}
                            checked={permissionsByRole.admin.includes(permission)}
                            onCheckedChange={() => togglePermission("admin", permission)}
                            className="border-rota-darkgold data-[state=checked]:bg-rota-gold data-[state=checked]:text-black"
                          />
                          <label
                            htmlFor={`admin-${permission}`}
                            className="text-sm text-white cursor-pointer"
                          >
                            {permissionLabels[permission]}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {permissionsByRole.admin.map(permission => (
                        <span key={permission} className="bg-rota-gold/20 text-rota-gold text-xs px-2 py-1 rounded">
                          {permissionLabels[permission]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Permissões para Moderador */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#ffbf00]">Moderador</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-rota-gold text-rota-darkgold hover:bg-rota-gray/50"
                      onClick={() => setEditingRole(editingRole === "moderador" ? null : "moderador")}
                    >
                      {editingRole === "moderador" ? "Fechar" : "Editar"}
                    </Button>
                  </div>
                  
                  {editingRole === "moderador" ? (
                    <div className="bg-black/40 p-4 rounded-md space-y-2">
                      {allPermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`moderador-${permission}`}
                            checked={permissionsByRole.moderador.includes(permission)}
                            onCheckedChange={() => togglePermission("moderador", permission)}
                            className="border-rota-darkgold data-[state=checked]:bg-rota-gold data-[state=checked]:text-black"
                          />
                          <label
                            htmlFor={`moderador-${permission}`}
                            className="text-sm text-white cursor-pointer"
                          >
                            {permissionLabels[permission]}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {permissionsByRole.moderador.map(permission => (
                        <span key={permission} className="bg-rota-gold/20 text-rota-gold text-xs px-2 py-1 rounded">
                          {permissionLabels[permission]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Permissões para Operador */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#ffbf00]">Operador</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-rota-gold text-rota-darkgold hover:bg-rota-gray/50"
                      onClick={() => setEditingRole(editingRole === "operador" ? null : "operador")}
                    >
                      {editingRole === "operador" ? "Fechar" : "Editar"}
                    </Button>
                  </div>
                  
                  {editingRole === "operador" ? (
                    <div className="bg-black/40 p-4 rounded-md space-y-2">
                      {allPermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`operador-${permission}`}
                            checked={permissionsByRole.operador.includes(permission)}
                            onCheckedChange={() => togglePermission("operador", permission)}
                            className="border-rota-darkgold data-[state=checked]:bg-rota-gold data-[state=checked]:text-black"
                          />
                          <label
                            htmlFor={`operador-${permission}`}
                            className="text-sm text-white cursor-pointer"
                          >
                            {permissionLabels[permission]}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {permissionsByRole.operador.map(permission => (
                        <span key={permission} className="bg-rota-gold/20 text-rota-gold text-xs px-2 py-1 rounded">
                          {permissionLabels[permission]}
                        </span>
                      ))}
                      {permissionsByRole.operador.length === 0 && (
                        <span className="text-rota-darkgold text-xs italic">
                          Nenhuma permissão atribuída.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-4 pt-4 border-t border-rota-darkgold">
                  <Button
                    variant="outline"
                    className="border-rota-gold text-rota-gold hover:bg-rota-gray/50"
                    onClick={resetPermissions}
                  >
                    Restaurar Padrões
                  </Button>
                  <Button
                    className="bg-rota-gold text-black hover:bg-amber-500"
                    onClick={savePermissions}
                    disabled={!hasChanges}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Solicitações de Acesso */}
        <TabsContent value="solicitacoes" className="space-y-6">
          <Card className="bg-rota-gray border-rota-darkgold">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#ffbf00]">Solicitações de Acesso</CardTitle>
                <CardDescription className="text-rota-darkgold">
                  Aprove ou rejeite solicitações de acesso ao sistema.
                </CardDescription>
              </div>
              
              {/* Botão para adicionar uma solicitação de demonstração */}
              <Button
                onClick={addDemoRequest}
                variant="outline"
                className="border-rota-gold text-rota-gold hover:bg-rota-gray/50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Demo: Nova Solicitação
              </Button>
            </CardHeader>
            <CardContent>
              {accessRequests.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-rota-darkgold rounded-md">
                  <ShieldAlert className="h-12 w-12 mx-auto text-rota-darkgold opacity-50" />
                  <p className="mt-2 text-rota-darkgold">Nenhuma solicitação de acesso pendente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {accessRequests.map(request => (
                    <div 
                      key={request.id} 
                      className="p-4 border border-rota-darkgold rounded-md bg-black/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-medium text-rota-gold">{request.nome}</h4>
                        <p className="text-sm text-rota-darkgold">{request.email}</p>
                        <p className="text-xs text-rota-darkgold">
                          Patente: {request.patente || "Não informado"} • 
                          Solicitado em {new Date(request.dataSolicitacao).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select 
                          defaultValue="operador"
                          onValueChange={() => {}}
                        >
                          <SelectTrigger className="w-full sm:w-36 bg-black border-rota-darkgold text-white">
                            <SelectValue placeholder="Cargo" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-rota-darkgold text-white">
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="moderador">Moderador</SelectItem>
                            <SelectItem value="operador">Operador</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => approveRequest(request.id)}
                            className="bg-green-700 hover:bg-green-600 text-white"
                          >
                            Aprovar
                          </Button>
                          <Button 
                            onClick={() => rejectRequest(request.id)}
                            variant="destructive"
                          >
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 