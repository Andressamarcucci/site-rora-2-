'use server';

import fs from 'fs';
import path from 'path';

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  filename: string;
  category: 'operacoes' | 'treinamentos' | 'sede';
  categoryLabel?: string;
  createdAt: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'gallery.json');

// Certificar que o diretório de dados existe
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
};

// Carregar todas as imagens
export async function getAllImages(): Promise<GalleryImage[]> {
  ensureDataDir();
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const images = JSON.parse(fileContents) as GalleryImage[];
    
    // Usar uma versão síncrona para o getCategoryLabel
    // Não precisamos realmente usar a versão assíncrona aqui
    const categoryMap: Record<string, string> = {
      'operacoes': 'Operações Táticas',
      'treinamentos': 'Treinamentos',
      'sede': 'Sede e Equipamentos'
    };
    
    // Adicionar os labels das categorias
    return images.map(img => ({
      ...img,
      categoryLabel: categoryMap[img.category] || 'Categoria Desconhecida'
    }));
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
    return [];
  }
}

// Carregar imagens por categoria
export async function getImagesByCategory(category: string): Promise<GalleryImage[]> {
  const images = await getAllImages();
  return images.filter(img => img.category === category);
}

// Adicionar uma nova imagem
export async function addImage(image: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> {
  ensureDataDir();
  try {
    const images = await getAllImages();
    const newImage: GalleryImage = {
      ...image,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedImages = [...images, newImage];
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedImages, null, 2));
    return newImage;
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error);
    throw new Error('Falha ao adicionar imagem');
  }
}

// Excluir uma imagem
export async function deleteImage(id: string): Promise<GalleryImage | undefined> {
  ensureDataDir();
  try {
    const images = await getAllImages();
    const updatedImages = images.filter(img => img.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedImages, null, 2));
    
    // Retorna a imagem que foi removida para que o arquivo possa ser excluído
    const removedImage = images.find(img => img.id === id);
    return removedImage;
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    throw new Error('Falha ao excluir imagem');
  }
}

// Utilidade para obter o label legível das categorias
export async function getCategoryLabel(category: string): Promise<string> {
  const categoryMap: Record<string, string> = {
    'operacoes': 'Operações Táticas',
    'treinamentos': 'Treinamentos',
    'sede': 'Sede e Equipamentos'
  };
  
  return categoryMap[category] || 'Categoria Desconhecida';
}

// Obter todas as categorias disponíveis
export async function getCategories() {
  return [
    { id: 'operacoes', label: 'Operações Táticas' },
    { id: 'treinamentos', label: 'Treinamentos' },
    { id: 'sede', label: 'Sede e Equipamentos' }
  ];
} 