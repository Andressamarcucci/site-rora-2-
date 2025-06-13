export async function getCroppedImg(imageSrc: string, croppedAreaPixels: { x: number; y: number; width: number; height: number }) {
  try {
    const image = document.createElement('img')
    image.src = imageSrc
    await new Promise((resolve) => {
      image.onload = resolve
    })

    const canvas = document.createElement('canvas')
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Não foi possível criar o contexto do canvas')
    }

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    const base64Image = canvas.toDataURL('image/jpeg')
    return base64Image
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
    return null
  }
}
