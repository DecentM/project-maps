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
  ParentOrganization: 'P749',
  NighttimeView: 'P3451',
  PanoramicView: 'P4291',
  CommonsGallery: 'P935',
  CommonsCategory: 'P373',
  ImageOfInterior: 'P5775',
  PlaqueImage: 'P1801',
  WinterView: 'P5252',
  YoutubeChannelId: 'P2397',
  BBCNewsTopicId: 'P6200',
  TheSunTopicId: 'P13634',
  YLETopicId: 'P8309',
  TheIndependentTopicId: 'P7284',
  PostimeesTopicId: 'P9937',
  OmniTopicId: 'P3479',
  NYTimesTopicId: 'P3221',
  NYPostTopicId: 'P13300',
  ITVNewsTopicId: 'P13135',
  HindustanTimesTopicId: 'P12997',
  TheGuardianTopicId: 'P3106',
  France24TopicId: 'P9346',
  EuronewsTopicId: 'P13526',
  EskaPlTopicId: 'P7185',
  ERRKeywordId: 'P13295',
  DerSpiegelTopicId: 'P10234',
  DagensNyheterTopicId: 'P3509',
  ChannelNewsAsiaTopicId: 'P9368',
} as const

export type ClaimId = (typeof ClaimId)[keyof typeof ClaimId]
