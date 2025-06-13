import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllImages, 
  addImage, 
  deleteImage, 
  getImagesByCategory 
} from '@/lib/gallery';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'uploads');

// Função para garantir que o diretório de uploads existe
const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Rota GET para listar todas as imagens ou filtrar por categoria
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    if (category) {
      const images = await getImagesByCategory(category);
      return NextResponse.json(images);
    } else {
      const images = await getAllImages();
      return NextResponse.json(images);
    }
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imagens' },
      { status: 500 }
    );
  }
}

// Rota POST para adicionar uma nova imagem
export async function POST(request: NextRequest) {
  ensureUploadDir();
  
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const file = formData.get('file') as File;
    
    if (!title || !category || !file) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não fornecidos' },
        { status: 400 }
      );
    }
    
    // Validar categoria
    if (!['operacoes', 'treinamentos', 'sede'].includes(category)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      );
    }
    
    // Processar o upload do arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Gerar nome de arquivo único
    const fileExt = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    // Salvar arquivo
    await writeFile(filePath, buffer);
    
    // Salvar referência no JSON
    const relativeFilePath = `/images/uploads/${fileName}`;
    const newImage = await addImage({
      title,
      description,
      filename: relativeFilePath,
      category: category as 'operacoes' | 'treinamentos' | 'sede'
    });
    
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload da imagem' },
      { status: 500 }
    );
  }
}

// Rota DELETE para remover uma imagem
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
    const removedImage = await deleteImage(id);
    
    if (removedImage) {
      // Remover o arquivo físico, se for na pasta uploads
      const filePath = path.join(process.cwd(), 'public', removedImage.filename);
      if (filePath.includes('uploads') && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir imagem' },
      { status: 500 }
    );
  }
} 