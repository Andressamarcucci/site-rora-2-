import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

const [currentAdmin, setCurrentAdmin] = useState<any>(null)
const [formData, setFormData] = useState({
  name: "",
  email: "",
  avatar: "",
  // ... outros campos ...
})

useEffect(() => {
  const admin = localStorage.getItem("currentAdmin")
  if (admin) {
    const parsed = JSON.parse(admin)
    setCurrentAdmin(parsed)
    setFormData((prev: any) => ({
      ...prev,
      name: parsed.name || "",
      email: parsed.email || "",
      avatar: parsed.avatar || "",
      // ... outros campos se necessário ...
    }))
  }
}, [])

const handleSaveProfile = () => {
  if (!currentAdmin) return

  try {
    // Atualizar informações do administrador
    const updatedAdmin = {
      ...currentAdmin,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    }
    setCurrentAdmin(updatedAdmin)
    localStorage.setItem("currentAdmin", JSON.stringify(updatedAdmin))

    // Atualizar avatar na lista de policiais
    const storedPoliciais = localStorage.getItem("policiais")
    if (storedPoliciais) {
      const policiais = JSON.parse(storedPoliciais)
      const updatedPoliciais = policiais.map((p: any) => {
        if (p.id === currentAdmin.id) {
          return {
            ...p,
            avatar: formData.avatar
          }
        }
        return p
      })
      localStorage.setItem("policiais", JSON.stringify(updatedPoliciais))
    }

    // Atualizar avatar na lista de hierarquias
    const storedHierarquias = localStorage.getItem("hierarquias")
    if (storedHierarquias) {
      const hierarquias = JSON.parse(storedHierarquias)
      const updatedHierarquias = hierarquias.map((h: any) => {
        if (h.policial === currentAdmin.name) {
          return {
            ...h,
            avatar: formData.avatar
          }
        }
        return h
      })
      localStorage.setItem("hierarquias", JSON.stringify(updatedHierarquias))
    }

    setSuccess("Perfil atualizado com sucesso!")
    setTimeout(() => setSuccess(""), 3000)
  } catch (err) {
    setError("Ocorreu um erro ao salvar. Tente novamente.")
  }
}

return (
  <div className="space-y-8">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <label htmlFor="avatar" className="cursor-pointer group">
          {formData.avatar ? (
            <img 
              src={formData.avatar} 
              alt="Foto de Perfil" 
              className="w-32 h-32 rounded-full object-cover border-4 border-rota-gold group-hover:brightness-75 transition-all"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-rota-darkgold flex items-center justify-center text-4xl font-bold text-black border-4 border-rota-gold group-hover:brightness-75 transition-all">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-rota-gold rounded-full p-2 border-2 border-black group-hover:bg-amber-500 transition-all">
            <Camera className="w-5 h-5 text-black" />
          </div>
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          name="avatar"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                setFormData(prev => ({
                  ...prev,
                  avatar: reader.result as string
                }))
              }
              reader.readAsDataURL(file)
            }
          }}
        />
      </div>
      <p className="text-sm text-rota-darkgold">Clique na foto para alterar</p>
    </div>

    {/* Resto do formulário */}
    // ... existing code ...
  </div>
) 