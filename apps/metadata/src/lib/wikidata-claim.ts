import type { SimplifiedEntity, SimplifiedPropertyClaims } from 'wikibase-sdk'

export const getClaims = (
  entity: SimplifiedEntity,
  claims: ClaimId[]
): SimplifiedPropertyClaims => {
  const value: SimplifiedPropertyClaims = []

  for (const claim of claims) {
    if (!entity.claims || !entity.claims[claim]) continue

    for (const claimProperty of entity.claims[claim]) {
      value.push(claimProperty)
    }
  }

  return value
}

export const ClaimId = {
  Image: 'P18',
  LogoImage: 'P154',
  SmallLogo: 'P8972',
  OfficialWebsite: 'P856',
  InstagramUsername: 'P2003',
  LinkedinCompanyPage: 'P4264',
  PinterestUsername: 'P3836',
  XUsername: 'P2002',
  FacebookUsername: 'P2013',
  BBCNewsTopicId: 'P6200',
  ParentOrganization: 'P749',
  NighttimeView: 'P3451',
  PanoramicView: 'P4291',
  CommonsGallery: 'P935',
  CommonsCategory: 'P373',
  ImageOfInterior: 'P5775',
  PlaqueImage: 'P1801',
} as const

export type ClaimId = (typeof ClaimId)[keyof typeof ClaimId]
