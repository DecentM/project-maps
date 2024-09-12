import type { SimplifiedEntity, SimplifiedPropertyClaims } from "wikibase-sdk"

export const getClaims = (entity: SimplifiedEntity, claims: ClaimId[]): SimplifiedPropertyClaims | null => {
  let value: SimplifiedPropertyClaims | null = null

  for (const claim of claims) {
    if (!entity.claims || !entity.claims[claim]) continue

    value = entity.claims?.[claim]

    if (value && value.length > 0) {
      return value
    }
  }

  return value
}

export const ClaimId = {
  Image: 'P18',
  Logo: 'P154',
  SmallLogo: 'P8972',
  OfficialWebsite: 'P856',
  InstagramUsername: 'P2003',
  LinkedinCompanyPage: 'P4264',
  PinterestUsername: 'P3836',
  XUsername: 'P2002',
  FacebookUsername: 'P2013',
  BBCNewsTopicId: 'P6200',
  ParentOrganization: 'P749',
} as const

export type ClaimId = typeof ClaimId[keyof typeof ClaimId]
