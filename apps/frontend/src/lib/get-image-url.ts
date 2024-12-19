import type { ImageUrl } from '@project-maps/proto/metadata'

export const getImageUrl = (
  input: ReturnType<ImageUrl['toObject']>,
  config: 'canonical' | 'large' | 'medium' | 'small'
): string | null => {
  switch (config) {
    case 'large':
      return input.large || input.canonical || input.medium || input.small || null
    case 'medium':
      return input.medium || input.large || input.canonical || input.small || null
    case 'small':
      return input.small || input.medium || input.large || input.canonical || null
    case 'canonical':
      return input.canonical || input.large || input.medium || input.small || null
  }
}
