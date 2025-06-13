import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getAllImages, getImagesByCategory } from "@/lib/gallery"

export default async function Galeria() {
  // Buscar os dados das imagens
  const operacoesImages = await getImagesByCategory('operacoes');
  const treinamentosImages = await getImagesByCategory('treinamentos');
  const sedeImages = await getImagesByCategory('sede');
  
  // Usar as primeiras 6 imagens para cada categoria, ou todas, se menos que 6
  const limitedOperacoes = operacoesImages.slice(0, 6);
  const limitedTreinamentos = treinamentosImages.slice(0, 6);
  const limitedSede = sedeImages.slice(0, 4);
  
  return (
    <div className="min-h-screen flex flex-col bg-rota-black text-rota-gold">
      {/* Header */}
      <header className="border-b border-rota-darkgold bg-[#ffbf00] py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rota-logo">
              <Image
                src="/images/rota-dignidade.png"
                alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Batalhão Tático Especial</h1>
              <p className="text-xs text-black">RONDAS OSTENSIVAS TOBIAS DE AGUIAR</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-[#ffbf00]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </header>

      {/* Gallery Content */}
      <main className="flex-1 py-12 px-4 bg-rota-gray tactical-pattern">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Galeria de Fotos</h2>
          
          {/* Operações Táticas */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4 text-rota-gold">Operações Táticas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mostrar imagens da categoria operações */}
              {limitedOperacoes.length > 0 ? (
                limitedOperacoes.map((item) => (
                  <div key={item.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <img
                        src={item.filename}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-rota-lightgold">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback para quando não houver imagens
                <div className="col-span-full text-center py-8">
                  <p className="text-rota-lightgold">Nenhuma imagem de operações táticas disponível.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Treinamentos */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4 text-rota-gold">Treinamentos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mostrar imagens da categoria treinamentos */}
              {limitedTreinamentos.length > 0 ? (
                limitedTreinamentos.map((item) => (
                  <div key={item.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <img
                        src={item.filename}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-rota-lightgold">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback para quando não houver imagens
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`tr-${index}`} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <img
                        src="/images/treinamento-especializado.jpg"
                        alt={`Treinamento ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-rota-lightgold">Treinamento especializado {index + 1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Sede e Equipamentos */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4 text-rota-gold">Sede e Equipamentos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mostrar imagens da categoria sede */}
              {limitedSede.length > 0 ? (
                limitedSede.map((item) => (
                  <div key={item.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <img
                        src={item.filename}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-rota-lightgold">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback para quando não houver imagens
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`hq-${index}`} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                    <div className="h-48 bg-gray-700 flex items-center justify-center">
                      <img
                        src="/images/headquarters.png"
                        alt={`Sede ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-rota-lightgold">Sede do Batalhão {index + 1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 px-4 mt-auto border-t border-rota-darkgold">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16">
              <Image
                src="/images/rota-dignidade.png"
                alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-rota-gold">© {new Date().getFullYear()} Batalhão Tático Especial - GTA Roleplay</p>
          <p className="mt-2 text-sm text-rota-darkgold">
            Este é um site fictício para uso em roleplay. Não representa nenhuma organização real.
          </p>
          <p className="mt-4 text-xs text-rota-darkgold italic">"DIGNIDADE ACIMA DE TUDO"</p>
        </div>
      </footer>
    </div>
  )
} 