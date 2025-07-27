import type { ImageUrl } from '@project-maps/proto/metadata/web'

export const getImageUrl = (
  input: ImageUrl,
  config: 'canonical' | 'large' | 'medium' | 'small'
): string | undefined => {
  switch (config) {
    case 'large':
      return input.large || input.canonical || input.medium || input.small || undefined
    case 'medium':
      return input.medium || input.large || input.canonical || input.small || undefined
    case 'small':
      return input.small || input.medium || input.large || input.canonical || undefined
    case 'canonical':
      return input.canonical || input.large || input.medium || input.small || undefined
  }
}
