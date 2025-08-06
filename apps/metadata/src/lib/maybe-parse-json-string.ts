export const maybeParseJsonString = (value: string): string => {
  try {
    const parsed = JSON.parse(value)

    if (typeof parsed === 'string') {
      return parsed
    }

    return value
  } catch {
    return value
  }
}
