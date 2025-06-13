"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Upload, PlusCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GalleryImage } from "@/lib/gallery"
import { useToast } from "@/components/ui/use-toast"

// Lista de categorias (hardcoded para evitar Server Component no cliente)
const GALLERY_CATEGORIES = [
  { id: 'operacoes', label: 'Operações Táticas' },
  { id: 'treinamentos', label: 'Treinamentos' },
  { id: 'sede', label: 'Sede e Equipamentos' }
];

export default function GerenciamentoGaleria() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categories] = useState(GALLERY_CATEGORIES);
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Carregar imagens ao iniciar
  useEffect(() => {
    fetchImages();
  }, []);
  
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/galeria');
      if (!response.ok) throw new Error('Falha ao carregar imagens');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as imagens.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipular upload de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Verificar se é uma imagem
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  // Manipular alterações nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  // Manipular alteração de categoria
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !file) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios e selecione uma imagem.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('file', file);
      
      const response = await fetch('/api/galeria', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (!response.ok) throw new Error('Falha ao enviar imagem');
      
      // Limpar formulário
      setFormData({
        title: '',
        description: '',
        category: ''
      });
      setFile(null);
      setPreviewUrl('');
      setShowForm(false);
      
      // Recarregar imagens
      fetchImages();
      
      toast({
        title: "Sucesso",
        description: "Imagem adicionada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a imagem.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Excluir imagem
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
    
    try {
      const response = await fetch(`/api/galeria?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Falha ao excluir imagem');
      
      // Atualizar estado local
      setImages(images.filter(img => img.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Imagem excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a imagem.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-rota-gold">Gerenciamento de Galeria</h1>
        <Button 
          className="bg-rota-gold text-black hover:bg-rota-lightgold"
          onClick={() => setShowForm(!showForm)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {showForm ? 'Cancelar' : 'Adicionar Imagem'}
        </Button>
      </div>

      {/* Upload de imagem */}
      {showForm && (
        <div className="bg-rota-gray border border-rota-darkgold rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-rota-gold mb-4">Upload de Nova Imagem</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Label htmlFor="title" className="text-rota-lightgold">Título da Imagem *</Label>
                  <Input 
                    id="title" 
                    placeholder="Digite o título da imagem" 
                    className="bg-black border-rota-darkgold text-white mt-1"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="description" className="text-rota-lightgold">Descrição</Label>
                  <Input 
                    id="description" 
                    placeholder="Digite uma breve descrição" 
                    className="bg-black border-rota-darkgold text-white mt-1"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="category" className="text-rota-lightgold">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger className="bg-black border-rota-darkgold text-white mt-1">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-rota-darkgold text-white">
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="h-48 w-full bg-black border border-rota-darkgold rounded-lg mb-4 overflow-hidden">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-black border border-dashed border-rota-darkgold rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Upload className="h-10 w-10 text-rota-darkgold mx-auto mb-2" />
                      <p className="text-rota-lightgold">Arraste e solte a imagem aqui ou clique para fazer upload</p>
                    </div>
                  </div>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button"
                  className="bg-black border border-rota-gold text-rota-gold hover:bg-rota-darkgold"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
            <div className="mt-6 text-right">
              <Button 
                type="submit" 
                className="bg-rota-gold text-black hover:bg-rota-lightgold"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : 'Salvar Imagem'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de imagens existentes */}
      <div>
        <h2 className="text-xl font-bold text-rota-gold mb-4">Imagens Existentes</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-rota-gold animate-spin" />
            <span className="ml-2 text-rota-lightgold">Carregando imagens...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-rota-gray p-8 rounded-lg text-center">
            <p className="text-rota-lightgold">Nenhuma imagem encontrada. Adicione imagens usando o botão acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-rota-darkgold">
                <div className="h-48 bg-gray-800 flex items-center justify-center relative group">
                  <img
                    src={image.filename}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="mr-2"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-rota-gold">{image.title}</p>
                  <p className="text-xs text-rota-darkgold mt-1">Categoria: {image.categoryLabel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 