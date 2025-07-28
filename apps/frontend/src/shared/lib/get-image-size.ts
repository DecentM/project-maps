export const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
  // using an image element to get the size
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = (err) => {
      reject(err)
    }

    img.src = url
  })
}
