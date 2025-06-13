import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rota-black p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Página não encontrada</h2>
        <p className="text-rota-darkgold">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            asChild
            className="bg-[#ffbf00] text-black hover:bg-amber-500"
          >
            <Link href="/">
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 