export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const nextTick = (): Promise<void> => {
  return new Promise((resolve) => process.nextTick(resolve))
}
