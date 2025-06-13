'use client'

import { useEffect } from 'react'
import { Button } from '../components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar o erro no console ou em um serviço de monitoramento
    console.error('Erro na aplicação:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rota-black p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Algo deu errado!</h2>
        <p className="text-rota-darkgold">
          Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={reset}
            className="bg-[#ffbf00] text-black hover:bg-amber-500"
          >
            Tentar novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="border-rota-darkgold text-rota-gold hover:bg-rota-gray/50"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  )
} 