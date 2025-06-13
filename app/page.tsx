import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, LogIn, UserPlus } from "lucide-react"
import { getAllVideos } from "@/lib/videos"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"

// Configuração para desabilitar cache da página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Buscar os vídeos mais recentes para exibir na home
  const allVideos = await getAllVideos();
  // Mostrar apenas os 2 vídeos mais recentes
  const recentVideos = allVideos.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-rota-black text-rota-gold">
      {/* Header */}
      <header className="border-b border-rota-darkgold bg-gradient-to-r from-[#d4af37] to-[#b8860b] py-2">
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
              <h1 className="text-2xl font-bold text-black drop-shadow">Batalhão Tático Especial</h1>
              <p className="text-xs text-black drop-shadow">RONDAS OSTENSIVAS TOBIAS DE AGUIAR</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-black font-semibold hover:text-white transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/galeria" className="text-black hover:text-white transition-colors">
                    Galeria
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="text-black hover:text-white transition-colors">
                    Vídeos
                  </Link>
                </li>
              </ul>
            </nav>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-[#ffbf00]">
                  <LogIn className="h-4 w-4 mr-2" />
                  Área Restrita
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
      </header>

      {/* Hero Section */}
      <section 
        className="relative py-32 px-6 md:px-12 text-white text-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url("/images/headquarters.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative h-32 w-32 rota-logo">
              <Image
                src="/images/rota-dignidade.png"
                alt="ROTA - Rondas Ostensivas Tobias de Aguiar"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-rota-gold">Batalhão Tático Especial</h2>
          <p className="text-xl mb-8 text-rota-lightgold">
            Elite da força policial dedicada à proteção e segurança da cidade
          </p>
          <p className="text-lg mb-12 italic text-rota-lightgold">"DIGNIDADE ACIMA DE TUDO"</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-rota-gray bg-opacity-80 p-6 rounded-lg border border-rota-darkgold">
              <div className="h-12 w-12 mx-auto mb-4 text-rota-gold flex items-center justify-center rounded-full border-2 border-rota-gold">
                <span className="text-2xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-rota-gold">Missão</h3>
              <p className="text-rota-lightgold">Proteger e servir a comunidade com excelência e integridade</p>
            </div>
            <div className="bg-rota-gray bg-opacity-80 p-6 rounded-lg border border-rota-darkgold">
              <div className="h-12 w-12 mx-auto mb-4 text-rota-gold flex items-center justify-center rounded-full border-2 border-rota-gold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-rota-gold">Equipe</h3>
              <p className="text-rota-lightgold">Profissionais altamente treinados e dedicados à segurança pública</p>
            </div>
            <div className="bg-rota-gray bg-opacity-80 p-6 rounded-lg border border-rota-darkgold">
              <div className="h-12 w-12 mx-auto mb-4 text-rota-gold flex items-center justify-center rounded-full border-2 border-rota-gold">
                <span className="text-2xl font-bold">V</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-rota-gold">Valores</h3>
              <p className="text-rota-lightgold">Honra, disciplina, respeito e comprometimento com a lei</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-rota-gray tactical-pattern">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-rota-gold">Destaques da Rota</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-64 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/operacoes-taticas.jpg"
                  alt="Operação tática"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-rota-gold">Operações Táticas</h3>
                <p className="text-rota-lightgold">
                  Nossas equipes realizam operações táticas de alta complexidade para garantir a segurança da cidade.
                </p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-64 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/treinamento-especializado.jpg"
                  alt="Treinamento especializado"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-rota-gold">Treinamento Especializado</h3>
                <p className="text-rota-lightgold">
                  Nossos agentes passam por treinamentos rigorosos para estarem sempre preparados para qualquer
                  situação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Regras Básicas</h2>
          <div className="bg-rota-gray p-6 rounded-lg border border-rota-darkgold">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-rota-gold rounded-full p-1 mt-1">
                  <span className="block h-2 w-2 rounded-full bg-black"></span>
                </div>
                <p className="text-rota-lightgold">
                  Respeito à hierarquia e às ordens dos superiores em todas as situações.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-rota-gold rounded-full p-1 mt-1">
                  <span className="block h-2 w-2 rounded-full bg-black"></span>
                </div>
                <p className="text-rota-lightgold">Uso do uniforme completo e adequado durante o serviço.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-rota-gold rounded-full p-1 mt-1">
                  <span className="block h-2 w-2 rounded-full bg-black"></span>
                </div>
                <p className="text-rota-lightgold">
                  Comunicação clara e objetiva pelo rádio, seguindo os protocolos estabelecidos.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-rota-gold rounded-full p-1 mt-1">
                  <span className="block h-2 w-2 rounded-full bg-black"></span>
                </div>
                <p className="text-rota-lightgold">Participação obrigatória nos treinamentos e reuniões agendadas.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-rota-gold rounded-full p-1 mt-1">
                  <span className="block h-2 w-2 rounded-full bg-black"></span>
                </div>
                <p className="text-rota-lightgold">
                  Conduta exemplar dentro e fora de serviço, representando a corporação com honra.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 bg-rota-gray tactical-pattern">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Galeria</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Imagens de exemplo - estes serão substituídos por imagens reais */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/operacoes-taticas.jpg"
                  alt="Galeria imagem 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-rota-lightgold">Operação tática em andamento</p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/treinamento-especializado.jpg"
                  alt="Galeria imagem 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-rota-lightgold">Treinamento de campo</p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/headquarters.png"
                  alt="Galeria imagem 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-rota-lightgold">Sede do Batalhão</p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <img
                  src="/images/rota-logo.png"
                  alt="Galeria imagem 4"
                  className="w-full h-full object-cover bg-black"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-rota-lightgold">Símbolo do batalhão</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/galeria">
              <Button className="bg-black text-rota-gold border border-rota-gold hover:bg-rota-gold hover:text-black">
                Ver Galeria Completa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Vídeos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frames de vídeo de exemplo - serão substituídos por embeds reais do YouTube */}
            <div className="bg-rota-gray rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Aqui iria um iframe do YouTube, substituindo por uma imagem placeholder */}
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
                  {/* Aqui iria um iframe do YouTube, substituindo por uma imagem placeholder */}
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
          </div>
          <div className="text-center mt-8">
            <Link href="/videos">
              <Button className="bg-black text-rota-gold border border-rota-gold hover:bg-rota-gold hover:text-black">
                Ver Todos os Vídeos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Adicionar uma nova seção para os vídeos destacados antes do Call to Action */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-rota-gold">Vídeos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentVideos.length > 0 ? (
              recentVideos.map((video) => (
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
                    <h3 className="text-xl font-bold mb-2 text-rota-gold">{video.title}</h3>
                    <p className="text-rota-lightgold">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback para quando não houver vídeos */}
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
                    <h3 className="text-xl font-bold mb-2 text-rota-gold">Operações Táticas</h3>
                    <p className="text-rota-lightgold">
                      Nenhum vídeo disponível no momento. Visite a seção completa de vídeos.
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
                    <h3 className="text-xl font-bold mb-2 text-rota-gold">Treinamentos</h3>
                    <p className="text-rota-lightgold">
                      Nenhum vídeo disponível no momento. Visite a seção completa de vídeos.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="text-center mt-6">
            <Link href="/videos">
              <Button variant="outline" className="mt-4 border-rota-gold text-rota-gold hover:bg-rota-gold hover:text-black">
                Ver Todos os Vídeos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-rota-gold">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-black">Área Administrativa</h2>
          <p className="mb-8 max-w-2xl mx-auto text-black">
            Acesse o sistema interno para gerenciar membros, hierarquias, fardamentos e viaturas do batalhão.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-black text-rota-gold hover:bg-rota-gray border-2 border-black">
                Acessar Sistema
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
      </section>

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
