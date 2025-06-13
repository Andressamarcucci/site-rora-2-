export type UserRole = "admin" | "moderador" | "operador"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  patente?: string
  createdAt: string
  lastLogin?: string
  permissions: Permission[]
}

export type Permission =
  | "gerenciar_usuarios"
  | "gerenciar_membros"
  | "gerenciar_hierarquias"
  | "gerenciar_fardamentos"
  | "gerenciar_viaturas"
  | "visualizar_relatorios"

export interface Permissao {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface Hierarquia {
  id: string
  nome: string
  nivel: number
  descricao: string
  insignia?: string
  permissoes: Permission[]
  createdAt: string
  updatedAt?: string
  policial?: string
  patente?: string
  dataIngresso: string
  avatar?: string
}

export type AdvertenciaStatus = "pendente" | "aprovada" | "rejeitada";

export interface Advertencia {
  id: string;
  status: AdvertenciaStatus;
  descricao: string;
  policialId: string;
  data: string;
}

export const defaultPermissions: Record<UserRole, Permission[]> = {
  admin: [
    "gerenciar_usuarios",
    "gerenciar_membros",
    "gerenciar_hierarquias",
    "gerenciar_fardamentos",
    "gerenciar_viaturas",
    "visualizar_relatorios",
  ],
  moderador: [
    "gerenciar_membros",
    "gerenciar_hierarquias",
    "gerenciar_fardamentos",
    "gerenciar_viaturas",
    "visualizar_relatorios",
  ],
  operador: [
    "gerenciar_membros",
    "visualizar_relatorios",
  ]
}

export interface AdminSettings {
  registrationEnabled: boolean
  requireApproval: boolean
}
