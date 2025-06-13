"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Advertencia {
  id: string
  policial: string
  policialId: string
  matricula: string
  rg: string
  graduacao: string
  motivo: string
  data: string
  aplicadaPor: string
  status: string
  visualizada: boolean
}

interface AdvertenciaNotificationProps {
  policialId: string
}

export function AdvertenciaNotification({ policialId }: AdvertenciaNotificationProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [advertencias, setAdvertencias] = useState<Advertencia[]>([])

  useEffect(() => {
    // Verificar se há advertências novas para este policial
    const storedAdvertencias = localStorage.getItem('advertencias')
    if (storedAdvertencias) {
      const parsedAdvertencias = JSON.parse(storedAdvertencias) as Advertencia[]
      const novasAdvertencias = parsedAdvertencias.filter((adv: Advertencia) => 
        adv.policialId === policialId && 
        !adv.visualizada
      )
      
      if (novasAdvertencias.length > 0) {
        setAdvertencias(novasAdvertencias)
        setShowNotification(true)
      }
    }
  }, [policialId])

  const handleDismiss = () => {
    setShowNotification(false)
    // Marcar advertências como visualizadas
    const storedAdvertencias = localStorage.getItem('advertencias')
    if (storedAdvertencias) {
      const parsedAdvertencias = JSON.parse(storedAdvertencias) as Advertencia[]
      const updatedAdvertencias = parsedAdvertencias.map((adv: Advertencia) => {
        if (adv.policialId === policialId && !adv.visualizada) {
          return { ...adv, visualizada: true }
        }
        return adv
      })
      localStorage.setItem('advertencias', JSON.stringify(updatedAdvertencias))
    }
  }

  if (!showNotification || advertencias.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert className="bg-red-900 border-red-700 text-white">
        <AlertTitle className="flex items-center justify-between">
          <span>Advertência Recebida</span>
          <X onClick={handleDismiss} className="cursor-pointer hover:text-red-400" />
        </AlertTitle>
        <AlertDescription className="mt-2">
          <div className="space-y-2">
            {advertencias.map((adv: Advertencia, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="destructive">{adv.motivo}</Badge>
                <span>Aplicada por: {adv.aplicadaPor}</span>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
}
