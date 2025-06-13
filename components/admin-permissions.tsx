"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ShieldCheck, User } from "lucide-react"
import { type User, type Permission, defaultPermissions, type UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AdminPermissionsProps {
  currentAdmin: User
}

// Interface para Policial
interface Policial {
  id: string
  nome: string
  rg: string
  graduacao: string
  unidade: string
  funcao: string
  status: "ativo" | "inativo" | "afastado" | "ferias"
  dataIngresso: string
  ultimaAtualizacao?: string
  observacoes?: string
}

export function AdminPermissions({ currentAdmin }: AdminPermissionsProps) {
  const [users, setUsers] = useState<User[]>([])
  const [policiais, setPoliciais] = useState<Policial[]>([])
  const [permissoesPolicial, setPermissoesPolicial] = useState<{ [id: string]: string[] }>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Lista de todas as permissões disponíveis para administradores
  const allPermissions: { id: Permission; label: string }[] = [
    { id: "gerenciar_usuarios", label: "Gerenciar Usuários" },
    { id: "gerenciar_membros", label: "Gerenciar Membros" },
    { id: "gerenciar_hierarquias", label: "Gerenciar Hierarquias" },
    { id: "gerenciar_fardamentos", label: "Gerenciar Fardamentos" },
    { id: "gerenciar_viaturas", label: "Gerenciar Viaturas" },
    { id: "visualizar_relatorios", label: "Visualizar Relatórios" },
  ]

  // Lista de permissões disponíveis para policiais
  const policialPermissions: { id: string; label: string }[] = [
    { id: "patrulha", label: "Realizar Patrulha" },
    { id: "abordagem", label: "Realizar Abordagens" },
    { id: "ocorrencia", label: "Registrar Ocorrências" },
    { id: "operacao_tatica", label: "Participar de Operações Táticas" },
    { id: "lider_operacao", label: "Liderar Operações" },
    { id: "acesso_armamentos", label: "Acesso a Armamentos Especiais" },
    { id: "acesso_viaturas", label: "Acesso a Viaturas Especiais" },
    { id: "treinamento", label: "Ministrar Treinamentos" },
    { id: "administracao", label: "Funções Administrativas" }
  ]

  useEffect(() => {
    // Carregar usuários administrativos
    const admins = localStorage.getItem("admins")
    if (admins) {
      setUsers(JSON.parse(admins))
    }

    // Carregar policiais
    const policiais = localStorage.getItem("policiais")
    if (policiais) {
      setPoliciais(JSON.parse(policiais))
    }

    // Carregar permissões dos policiais
    const permissoes = localStorage.getItem("permissoesPolicial")
    if (permissoes) {
      setPermissoesPolicial(JSON.parse(permissoes))
    }
  }, [])

  const handlePermissionChange = (userId: string, permission: Permission, value: boolean) => {
    // Verificar se o usuário atual tem permissão para gerenciar usuários
    if (!currentAdmin.permissions.includes("gerenciar_usuarios")) {
      setError("Você não tem permissão para alterar permissões de usuários.")
      return
    }

    // Atualizar permissões do usuário
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        let updatedPermissions = [...user.permissions]

        if (value && !updatedPermissions.includes(permission)) {
          updatedPermissions.push(permission)
        } else if (!value && updatedPermissions.includes(permission)) {
          updatedPermissions = updatedPermissions.filter((p) => p !== permission)
        }

        return {
          ...user,
          permissions: updatedPermissions,
        }
      }
      return user
    })

    setUsers(updatedUsers)

    // Atualizar no localStorage
    localStorage.setItem("admins", JSON.stringify(updatedUsers))

    // Se o usuário editado é o atual, atualizar também no currentAdmin
    const updatedCurrentAdmin = updatedUsers.find((user) => user.id === currentAdmin.id)
    if (updatedCurrentAdmin) {
      localStorage.setItem("currentAdmin", JSON.stringify(updatedCurrentAdmin))
    }

    setSuccess("Permissões atualizadas com sucesso.")

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const resetToDefaultPermissions = (userId: string, role: UserRole) => {
    // Atualizar permissões do usuário para o padrão do cargo
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: [...defaultPermissions[role]],
        }
      }
      return user
    })

    setUsers(updatedUsers)

    // Atualizar no localStorage
    localStorage.setItem("admins", JSON.stringify(updatedUsers))

    // Se o usuário editado é o atual, atualizar também no currentAdmin
    const updatedCurrentAdmin = updatedUsers.find((user) => user.id === currentAdmin.id)
    if (updatedCurrentAdmin) {
      localStorage.setItem("currentAdmin", JSON.stringify(updatedCurrentAdmin))
    }

    setSuccess("Permissões redefinidas para o padrão do cargo.")

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Função para alterar permissão de um policial
  const handlePolicePermissionChange = (policialId: string, permissionId: string, value: boolean) => {
    // Verificar se o usuário atual tem permissão para gerenciar membros
    if (!currentAdmin.permissions.includes("gerenciar_membros")) {
      setError("Você não tem permissão para alterar permissões de policiais.")
      return
    }

    // Atualizar permissões do policial
    let updatedPermissoes = { ...permissoesPolicial }
    
    if (!updatedPermissoes[policialId]) {
      updatedPermissoes[policialId] = []
    }

    if (value && !updatedPermissoes[policialId].includes(permissionId)) {
      updatedPermissoes[policialId] = [...updatedPermissoes[policialId], permissionId]
    } else if (!value && updatedPermissoes[policialId].includes(permissionId)) {
      updatedPermissoes[policialId] = updatedPermissoes[policialId].filter(p => p !== permissionId)
    }

    setPermissoesPolicial(updatedPermissoes)
    localStorage.setItem("permissoesPolicial", JSON.stringify(updatedPermissoes))

    setSuccess("Permissões do policial atualizadas com sucesso.")

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Função para redefinir as permissões padrão com base na graduação do policial
  const resetPolicePermissions = (policial: Policial) => {
    // Definir permissões padrão baseadas na graduação
    let defaultPerms: string[] = ["patrulha", "abordagem", "ocorrencia"]
    
    // Adicionar permissões com base na graduação
    if (["Coronel", "Tenente-Coronel", "Major", "Capitão"].includes(policial.graduacao)) {
      defaultPerms = [...defaultPerms, "operacao_tatica", "lider_operacao", "acesso_armamentos", "acesso_viaturas", "treinamento", "administracao"]
    } else if (["Tenente", "Sargento"].includes(policial.graduacao)) {
      defaultPerms = [...defaultPerms, "operacao_tatica", "lider_operacao", "acesso_armamentos", "acesso_viaturas"]
    } else if (policial.graduacao === "Cabo") {
      defaultPerms = [...defaultPerms, "operacao_tatica", "acesso_viaturas"]
    }

    const updatedPermissoes = {
      ...permissoesPolicial,
      [policial.id]: defaultPerms
    }

    setPermissoesPolicial(updatedPermissoes)
    localStorage.setItem("permissoesPolicial", JSON.stringify(updatedPermissoes))

    setSuccess(`Permissões de ${policial.nome} redefinidas com base na graduação.`)

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-800 border-green-600">
          <AlertDescription className="text-white">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="administradores" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="administradores">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Administradores
          </TabsTrigger>
          <TabsTrigger value="policiais">
            <User className="mr-2 h-4 w-4" />
            Policiais
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="administradores" className="mt-6">
          <div className="rounded-md border shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800">
                  <TableHead>Usuário</TableHead>
                  {allPermissions.map((permission) => (
                    <TableHead key={permission.id} className="text-center">
                      <div className="text-xs whitespace-nowrap">{permission.label}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role === "admin" ? 
                              <Badge variant="outline" className="bg-red-950/40 text-red-400 border-red-700/30">Administrador</Badge> : 
                              user.role === "moderador" ? 
                                <Badge variant="outline" className="bg-amber-950/40 text-amber-400 border-amber-700/30">Moderador</Badge> : 
                                <Badge variant="outline" className="bg-blue-950/40 text-blue-400 border-blue-700/30">Operador</Badge>
                            }
                          </p>
                        </div>
                      </TableCell>

                      {allPermissions.map((permission) => (
                        <TableCell key={permission.id} className="text-center">
                          <Switch
                            checked={user.permissions.includes(permission.id)}
                            onCheckedChange={(value) => handlePermissionChange(user.id, permission.id, value)}
                            disabled={
                              !currentAdmin.permissions.includes("gerenciar_usuarios") ||
                              (user.role === "admin" && user.id !== currentAdmin.id) // Não permitir editar outros admins
                            }
                          />
                        </TableCell>
                      ))}

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetToDefaultPermissions(user.id, user.role)}
                          disabled={
                            !currentAdmin.permissions.includes("gerenciar_usuarios") ||
                            (user.role === "admin" && user.id !== currentAdmin.id) // Não permitir editar outros admins
                          }
                        >
                          Redefinir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={allPermissions.length + 2} className="text-center py-6 text-muted-foreground">
                      Nenhum usuário administrativo encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="policiais" className="mt-6">
          <div className="rounded-md border shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800">
                  <TableHead>Policial</TableHead>
                  {policialPermissions.map((permission) => (
                    <TableHead key={permission.id} className="text-center">
                      <div className="text-xs whitespace-nowrap">{permission.label}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policiais.length > 0 ? (
                  policiais.map((policial) => (
                    <TableRow key={policial.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{policial.nome}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="bg-slate-950/40 text-slate-300 border-slate-700/30 text-xs">
                              {policial.graduacao}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                policial.status === "ativo" ? "bg-green-950/40 text-green-400 border-green-700/30" : 
                                policial.status === "inativo" ? "bg-red-950/40 text-red-400 border-red-700/30" : 
                                policial.status === "afastado" ? "bg-yellow-950/40 text-yellow-400 border-yellow-700/30" : 
                                "bg-blue-950/40 text-blue-400 border-blue-700/30"
                              }`}
                            >
                              {policial.status === "ativo" && "Ativo"}
                              {policial.status === "inativo" && "Inativo"}
                              {policial.status === "afastado" && "Afastado"}
                              {policial.status === "ferias" && "Férias"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      {policialPermissions.map((permission) => (
                        <TableCell key={permission.id} className="text-center">
                          <Switch
                            checked={permissoesPolicial[policial.id]?.includes(permission.id) || false}
                            onCheckedChange={(value) => handlePolicePermissionChange(policial.id, permission.id, value)}
                            disabled={!currentAdmin.permissions.includes("gerenciar_membros")}
                          />
                        </TableCell>
                      ))}

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetPolicePermissions(policial)}
                          disabled={!currentAdmin.permissions.includes("gerenciar_membros")}
                        >
                          Redefinir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={policialPermissions.length + 2} className="text-center py-6 text-muted-foreground">
                      Nenhum policial encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <Card className="mt-6 bg-amber-900/10 border-amber-600/30">
            <CardHeader>
              <CardTitle className="text-sm">Guia de Permissões para Policiais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Permissões por Graduação</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Oficiais Superiores:</span>
                      <span className="text-muted-foreground">Todas as permissões</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Oficiais Intermediários:</span>
                      <span className="text-muted-foreground">Operações táticas, liderança, armamentos e viaturas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Graduados:</span>
                      <span className="text-muted-foreground">Operações táticas, viaturas básicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Soldados:</span>
                      <span className="text-muted-foreground">Patrulha, abordagem e registro de ocorrências</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Informações Importantes</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>As permissões controlam o acesso a recursos e operações no sistema</li>
                    <li>Policiais em status inativo ou afastado terão suas permissões limitadas automaticamente</li>
                    <li>Mudanças de graduação atualizam as permissões padrão</li>
                    <li>Atribuições especiais podem requerer permissões específicas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
