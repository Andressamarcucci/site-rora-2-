export interface Advertencia {
  id: string
  policialId: string
  tipo: "advertencia" | "suspensao" | "expulsao"
  descricao: string
  data: string
  validade?: string
  status: "ativo" | "inativo" | "cumprido"
  criadoPor: string
  atualizadoPor?: string
  createdAt: string
  updatedAt?: string
}

export type AdvertenciaStatus = Advertencia["status"]
export type AdvertenciaTipo = Advertencia["tipo"]
