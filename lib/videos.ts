'use server';

import fs from 'fs';
import path from 'path';

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
  createdAt: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

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

// Carregar todos os vídeos
export async function getAllVideos(): Promise<Video[]> {
  ensureDataDir();
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents) as Video[];
  } catch (error) {
    console.error('Erro ao carregar vídeos:', error);
    return [];
  }
}

// Obter um vídeo específico
export async function getVideoById(id: string): Promise<Video | null> {
  const videos = await getAllVideos();
  return videos.find(video => video.id === id) || null;
}

// Adicionar um novo vídeo
export async function addVideo(video: Omit<Video, 'id' | 'createdAt'>): Promise<Video> {
  ensureDataDir();
  try {
    const videos = await getAllVideos();
    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      // Se não tiver thumbnail, usa a do YouTube
      thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
    };
    const updatedVideos = [...videos, newVideo];
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedVideos, null, 2));
    return newVideo;
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    throw new Error('Falha ao adicionar vídeo');
  }
}

// Atualizar um vídeo existente
export async function updateVideo(id: string, updatedData: Partial<Omit<Video, 'id' | 'createdAt'>>): Promise<Video> {
  ensureDataDir();
  try {
    const videos = await getAllVideos();
    const videoIndex = videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      throw new Error('Vídeo não encontrado');
    }
    
    // Se o ID do YouTube foi alterado e não foi fornecido um novo thumbnail,
    // atualiza para o thumbnail do novo vídeo
    if (updatedData.youtubeId && updatedData.youtubeId !== videos[videoIndex].youtubeId && !updatedData.thumbnail) {
      updatedData.thumbnail = `https://img.youtube.com/vi/${updatedData.youtubeId}/maxresdefault.jpg`;
    }
    
    videos[videoIndex] = {
      ...videos[videoIndex],
      ...updatedData
    };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
    return videos[videoIndex];
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    throw new Error('Falha ao atualizar vídeo');
  }
}

// Excluir um vídeo
export async function deleteVideo(id: string): Promise<Video | undefined> {
  ensureDataDir();
  try {
    const videos = await getAllVideos();
    const updatedVideos = videos.filter(video => video.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedVideos, null, 2));
    
    // Retorna o vídeo removido
    return videos.find(video => video.id === id);
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    throw new Error('Falha ao excluir vídeo');
  }
} 