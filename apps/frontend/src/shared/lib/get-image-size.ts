export const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
  // using an image element to get the size
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.addEventListener('load', () => {
      resolve({ width: img.width, height: img.height })
    })

    img.addEventListener('error', (err) => {
      reject(err)
    })

    img.src = url
  })
}
