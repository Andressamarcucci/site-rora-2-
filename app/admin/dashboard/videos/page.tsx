"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, PlusCircle, Edit2, Loader2, Check, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Video } from "@/lib/videos"
import { useToast } from "@/components/ui/use-toast"

export default function GerenciamentoVideos() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    youtubeId: '',
  });
  
  // Carregar vídeos ao iniciar
  useEffect(() => {
    fetchVideos();
  }, []);
  
  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) throw new Error('Falha ao carregar vídeos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os vídeos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipular alterações nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  // Resetar formulário
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      youtubeId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.youtubeId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Extrair o ID do YouTube a partir de uma URL completa ou manter o ID direto
    let youtubeId = formData.youtubeId;
    
    // Remover prefixo @ se existir
    let cleanUrl = youtubeId;
    if (cleanUrl.startsWith('@')) {
      cleanUrl = cleanUrl.substring(1);
    }
    
    // Verificar se é uma URL do YouTube
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      try {
        const url = new URL(cleanUrl);
        
        // Formato padrão: youtube.com/watch?v=ID
        if (url.searchParams.has('v')) {
          youtubeId = url.searchParams.get('v') || '';
        } 
        // Formato encurtado: youtu.be/ID
        else if (url.hostname.includes('youtu.be')) {
          youtubeId = url.pathname.slice(1);
        }
      } catch (error) {
        // Se não for uma URL válida, mantém o valor original
        console.error('URL inválida:', error);
      }
    }
    
    // Verificar se o ID do YouTube é válido (formato básico)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
      toast({
        title: "ID do YouTube inválido",
        description: "Por favor, insira um ID válido do YouTube (11 caracteres) ou URL completa do vídeo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (editingId) {
        // Atualizar vídeo existente
        response = await fetch('/api/videos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            description: formData.description,
            youtubeId: youtubeId,
          }),
        });
      } else {
        // Adicionar novo vídeo
        response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            youtubeId: youtubeId,
          }),
        });
      }
      
      if (!response.ok) throw new Error('Falha ao salvar vídeo');
      
      // Recarregar vídeos
      fetchVideos();
      
      // Limpar formulário
      resetForm();
      
      toast({
        title: "Sucesso",
        description: editingId ? "Vídeo atualizado com sucesso!" : "Vídeo adicionado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Excluir vídeo
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
    
    try {
      const response = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Falha ao excluir vídeo');
      
      // Atualizar estado local
      setVideos(videos.filter(video => video.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Vídeo excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o vídeo.",
        variant: "destructive"
      });
    }
  };
  
  // Editar vídeo
  const handleEdit = (video: Video) => {
    setFormData({
      id: video.id,
      title: video.title,
      description: video.description,
      youtubeId: video.youtubeId,
    });
    setEditingId(video.id);
    setShowForm(true);
    
    // Scroll para o topo para mostrar o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-rota-gold">
          {editingId ? "Editar Vídeo" : "Gerenciamento de Vídeos"}
        </h1>
        <Button 
          className="bg-rota-gold text-black hover:bg-rota-lightgold"
          onClick={() => {
            if (editingId) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
        >
          {editingId ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancelar Edição
            </>
          ) : (
            <>
              {showForm ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Vídeo
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {/* Formulário de adição/edição de vídeo */}
      {showForm && (
        <div className="bg-rota-gray border border-rota-darkgold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-rota-gold mb-4">
            {editingId ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Label htmlFor="title" className="text-rota-lightgold">Título do Vídeo *</Label>
                  <Input 
                    id="title" 
                    placeholder="Digite o título do vídeo" 
                    className="bg-black border-rota-darkgold text-white mt-1"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="description" className="text-rota-lightgold">Descrição *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Digite uma descrição para o vídeo" 
                    className="bg-black border-rota-darkgold text-white mt-1 h-24"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="youtubeId" className="text-rota-lightgold">ID ou URL do vídeo no YouTube *</Label>
                  <Input 
                    id="youtubeId" 
                    placeholder="Ex: dQw4w9WgXcQ ou @https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    className="bg-black border-rota-darkgold text-white mt-1"
                    value={formData.youtubeId}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-rota-darkgold mt-1">
                    Você pode inserir o ID do vídeo, a URL completa ou URL com prefixo @
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <Label htmlFor="preview" className="text-rota-lightgold">Preview do Vídeo</Label>
                  <div className="aspect-video bg-black border border-rota-darkgold rounded-lg mt-2 overflow-hidden">
                    {formData.youtubeId ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                        title="Preview do vídeo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-rota-darkgold">Preview do vídeo aparecerá aqui</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-rota-darkgold mt-1">
                    Após inserir o ID do YouTube, um preview do vídeo será exibido aqui.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-right">
              <Button 
                type="submit" 
                className="bg-rota-gold text-black hover:bg-rota-lightgold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingId ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingId ? "Atualizar Vídeo" : "Salvar Vídeo"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de vídeos existentes */}
      <div>
        <h2 className="text-xl font-bold text-rota-gold mb-4">Vídeos Existentes</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-rota-gold animate-spin" />
            <span className="ml-2 text-rota-lightgold">Carregando vídeos...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-rota-gray p-8 rounded-lg text-center">
            <p className="text-rota-lightgold">Nenhum vídeo encontrado. Adicione vídeos usando o botão acima.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {/* Informações */}
                  <div className="p-4 md:col-span-2 flex flex-col">
                    <h3 className="text-lg font-bold text-rota-gold">{video.title}</h3>
                    <p className="text-sm text-rota-lightgold mt-2 flex-grow">
                      {video.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-rota-darkgold">ID: {video.youtubeId}</p>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-rota-gold text-rota-gold mr-2"
                          onClick={() => handleEdit(video)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 