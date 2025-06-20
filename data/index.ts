import { Hierarquia, Permission } from "@/lib/types"

export const hierarquiasIniciais: Hierarquia[] = [
  {
    id: "1",
    nome: "Coronel",
    nivel: 1,
    descricao: "Patente mais alta do batalhão, responsável pelo comando geral.",
    permissoes: ["gerenciar_usuarios", "gerenciar_membros", "gerenciar_hierarquias"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "1",
    patente: "Coronel",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    nome: "Tenente-Coronel",
    nivel: 2,
    descricao: "Segunda patente mais alta, auxilia o comando geral.",
    permissoes: ["comando_operacional", "aprovar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "2",
    patente: "Tenente-Coronel",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    nome: "Major",
    nivel: 3,
    descricao: "Responsável por comandar batalhões ou companhias.",
    permissoes: ["comando_operacional", "gerenciar_membros"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "3",
    patente: "Major",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    nome: "Capitão",
    nivel: 4,
    descricao: "Responsável por comandar pelotões ou seções.",
    permissoes: ["gerenciar_membros", "gerenciar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "4",
    patente: "Capitão",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "5",
    nome: "Tenente",
    nivel: 5,
    descricao: "Responsável por comandar equipes ou grupos.",
    permissoes: ["gerenciar_operacoes", "executar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "5",
    patente: "Tenente",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "6",
    nome: "Aspirante",
    nivel: 6,
    descricao: "Oficial em formação, em estágio probatório.",
    permissoes: ["executar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "6",
    patente: "Aspirante",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "7",
    nome: "Sargento",
    nivel: 7,
    descricao: "Soldado graduado, liderança de equipe.",
    permissoes: ["executar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "7",
    patente: "Sargento",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "8",
    nome: "Cabo",
    nivel: 8,
    descricao: "Soldado graduado, liderança de grupo.",
    permissoes: ["executar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "8",
    patente: "Cabo",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: "9",
    nome: "Soldado",
    nivel: 9,
    descricao: "Soldado recruta, em formação inicial.",
    permissoes: ["executar_operacoes"],
    createdAt: "2022-01-10",
    updatedAt: "2023-03-15",
    policial: "9",
    patente: "Soldado",
    dataIngresso: "2022-01-10",
    avatar: "https://via.placeholder.com/150",
  }
]
