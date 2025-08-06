export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.addEventListener('load', () => resolve())
    img.addEventListener('error', (error) => reject(error))

    img.src = url
  })
}
