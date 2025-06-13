"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, AlertCircle } from "lucide-react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminUsersListProps {
  currentAdmin: User
}

export function AdminUsersList({ currentAdmin }: AdminUsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPatente, setEditPatente] = useState("")
  const [editRole, setEditRole] = useState<string>("operador")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Carregar usuários administrativos
    const admins = localStorage.getItem("admins")
    if (admins) {
      setUsers(JSON.parse(admins))
    }
  }, [])

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditPatente(user.patente || "")
    setEditRole(user.role)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return

    // Não permitir excluir o próprio usuário
    if (selectedUser.id === currentAdmin.id) {
      setError("Você não pode excluir seu próprio usuário.")
      return
    }

    // Filtrar o usuário da lista
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
    setUsers(updatedUsers)

    // Atualizar no localStorage
    localStorage.setItem("admins", JSON.stringify(updatedUsers))

    setIsDeleteDialogOpen(false)
    setSuccess(`Usuário ${selectedUser.name} excluído com sucesso.`)

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const confirmEditUser = () => {
    if (!selectedUser) return

    // Validar email
    if (!editEmail.includes("@")) {
      setError("Email inválido.")
      return
    }

    // Verificar se o email já existe (exceto para o usuário atual)
    const emailExists = users.some((user) => user.email === editEmail && user.id !== selectedUser.id)

    if (emailExists) {
      setError("Este email já está em uso por outro usuário.")
      return
    }

    // Atualizar usuário
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: editName,
          email: editEmail,
          patente: editPatente,
          role: editRole as User["role"],
        }
      }
      return user
    })

    setUsers(updatedUsers)

    // Atualizar no localStorage
    localStorage.setItem("admins", JSON.stringify(updatedUsers))

    // Se o usuário editado é o atual, atualizar também no currentAdmin
    if (selectedUser.id === currentAdmin.id) {
      const updatedCurrentAdmin = {
        ...currentAdmin,
        name: editName,
        email: editEmail,
        patente: editPatente,
        role: editRole as User["role"],
      }
      localStorage.setItem("currentAdmin", JSON.stringify(updatedCurrentAdmin))
    }

    setIsEditDialogOpen(false)
    setSuccess(`Usuário ${editName} atualizado com sucesso.`)

    // Limpar mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="space-y-4">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Patente</TableHead>
              <TableHead>Nível de Acesso</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.patente || "-"}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? "Administrador" : user.role === "moderador" ? "Moderador" : "Operador"}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.id === currentAdmin.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário administrativo encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de confirmação para excluir */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize as informações do usuário administrativo.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-patente">Patente (opcional)</Label>
              <Input id="edit-patente" value={editPatente} onChange={(e) => setEditPatente(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Nível de Acesso</Label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="admin">Administrador (Acesso Total)</option>
                <option value="moderador">Moderador (Acesso Parcial)</option>
                <option value="operador">Operador (Acesso Básico)</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmEditUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
