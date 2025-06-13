import { Loader2 } from "lucide-react"

export default function PerfilLoading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-rota-gold" />
        <p className="text-muted-foreground">Carregando informações do perfil...</p>
      </div>
    </div>
  )
}
