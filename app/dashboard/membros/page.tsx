"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function MembrosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#ffbf00]">Membros</h2>
        <p className="text-rota-darkgold">Visualize os membros do batalhão</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-black border-rota-darkgold text-rota-lightgold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// ... existing code ...
      </div>
    </div>
  )
} 