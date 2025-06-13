import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllVideos, 
  getVideoById, 
  addVideo, 
  updateVideo, 
  deleteVideo 
} from '@/lib/videos';

// Configuração para desabilitar cache da API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Rota GET para listar todos os vídeos ou obter um único vídeo por ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    if (id) {
      const video = await getVideoById(id);
      
      if (!video) {
        return NextResponse.json(
          { error: 'Vídeo não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(video, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      });
    } else {
      const videos = await getAllVideos();
      return NextResponse.json(videos, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vídeos' },
      { status: 500 }
    );
  }
}

// Rota POST para adicionar um novo vídeo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeId } = body;
    
    if (!title || !description || !youtubeId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não fornecidos' },
        { status: 400 }
      );
    }
    
    // Verificar se o ID do YouTube é válido (formato básico)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
      return NextResponse.json(
        { error: 'ID do YouTube inválido' },
        { status: 400 }
      );
    }
    
    const newVideo = await addVideo({
      title,
      description,
      youtubeId,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    });
    
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar vídeo' },
      { status: 500 }
    );
  }
}

// Rota PUT para atualizar um vídeo existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, youtubeId } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do vídeo não fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se existe pelo menos um campo para atualizar
    if (!title && !description && !youtubeId) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar fornecido' },
        { status: 400 }
      );
    }
    
    // Verificar se o ID do YouTube é válido (formato básico), se fornecido
    if (youtubeId && !/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
      return NextResponse.json(
        { error: 'ID do YouTube inválido' },
        { status: 400 }
      );
    }
    
    // Criar objeto com os campos a atualizar
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (youtubeId) {
      updateData.youtubeId = youtubeId;
      updateData.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    
    try {
      const updatedVideo = await updateVideo(id, updateData);
      return NextResponse.json(updatedVideo);
    } catch (e) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar vídeo' },
      { status: 500 }
    );
  }
}

// Rota DELETE para remover um vídeo
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID não fornecido' },
      { status: 400 }
    );
  }
  
  try {
    const removedVideo = await deleteVideo(id);
    
    if (removedVideo) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro ao excluir vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir vídeo' },
      { status: 500 }
    );
  }
} 