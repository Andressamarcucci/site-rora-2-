import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getAllVideos } from "@/lib/videos"
import { cn } from "@/lib/utils"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Calendar, Play, Users, UserPlus } from "lucide-react"

// Configuração para desabilitar cache da página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Videos() {
  // Buscar os dados dos vídeos
  const videos = await getAllVideos();
  
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

      {/* Videos Content */}
      <main className="flex-1 py-12 px-4 bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Vídeos Táticos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id} className="bg-rota-gray rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                  <div className="aspect-video bg-gray-800">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-rota-gold">{video.title}</h3>
                    <p className="text-sm text-rota-lightgold mt-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback para quando não houver vídeos
              <>
                <div className="bg-rota-gray rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rota-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <img
                        src="/images/operacoes-taticas.jpg"
                        alt="Vídeo thumbnail"
                        className="w-full h-full object-cover opacity-50"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-rota-gold">Operação Especial</h3>
                    <p className="text-sm text-rota-lightgold mt-2">
                      Vídeo demonstrativo de uma operação tática realizada pelo Batalhão.
                    </p>
                  </div>
                </div>
                <div className="bg-rota-gray rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rota-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <img
                        src="/images/treinamento-especializado.jpg"
                        alt="Vídeo thumbnail"
                        className="w-full h-full object-cover opacity-50"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-rota-gold">Treinamento de Tactical</h3>
                    <p className="text-sm text-rota-lightgold mt-2">
                      Vídeo mostrando o treinamento tático e de tiro dos nossos agentes.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-rota-gold text-center">Adicionar Novos Vídeos</h3>
            <div className="bg-rota-gray p-6 rounded-lg border border-rota-darkgold max-w-xl mx-auto">
              <p className="text-rota-lightgold mb-4">
                Para adicionar novos vídeos à galeria, entre em contato com o administrador do sistema ou acesse a área administrativa.
              </p>
              <div className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-rota-gold border border-rota-gold hover:bg-rota-gold hover:text-black">
                      Acessar Área Administrativa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-rota-gray border-rota-darkgold">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold mb-2 text-[#ffbf00]">Escolha seu tipo de acesso</DialogTitle>
                      <DialogDescription className="text-rota-darkgold">
                        Selecione o tipo de acesso para fazer login no sistema.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Link href="/login" className="w-full">
                        <Button className="w-full bg-black border border-rota-darkgold text-[#ffbf00] hover:bg-rota-gray">
                          <Users className="h-4 w-4 mr-2" />
                          Policial
                        </Button>
                      </Link>
                      <Link href="/admin/login" className="w-full">
                        <Button className="w-full bg-[#ffbf00] text-black hover:bg-amber-500">
                          <Users className="h-4 w-4 mr-2" />
                          Comando
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="my-4 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-rota-darkgold"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-rota-gray text-rota-darkgold text-sm">OU</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-4 border border-rota-darkgold">
                      <h3 className="text-[#ffbf00] font-medium text-center mb-2">Novo Membro?</h3>
                      <p className="text-sm text-rota-darkgold mb-3 text-center">
                        Ainda não faz parte do Batalhão? Crie sua conta para solicitar acesso ao sistema.
                      </p>
                      <Link href="/registrar" prefetch={true} className="w-full">
                        <Button variant="outline" className="w-full border-rota-darkgold text-rota-gold hover:bg-black">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Registrar como Novo Membro
                        </Button>
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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