import type { SimplifiedEntity, SimplifiedPropertyClaims } from "wikibase-sdk"

export const getClaim = (entity: SimplifiedEntity, claim: ClaimId): SimplifiedPropertyClaims | null => {
  const value = entity.claims?.[claim]

  if (!value || value.length <= 0) {
    return null
  }

  return value
}

export const ClaimId = {
  Image: 'P18',
} as const

export type ClaimId = typeof ClaimId[keyof typeof ClaimId]
