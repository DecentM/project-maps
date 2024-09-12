const amenityIcons = {
  pub: 'mdi-glass-mug',
  post_box: 'mdi-mailbox',
  toilets: 'mdi-toilet',
  bicycle_rental: 'mdi-bike',
  school: 'mdi-school',
  bicycle_parking: 'mdi-parking',
  cafe: 'mdi-coffee',
  parking: 'mdi-parking',
  bank: 'mdi-bank',
  post_office: 'mdi-mailbox',
  kindergarten: 'mdi-baby-buggy',
  grave_yard: 'mdi-grave-stone',
  motorcycle_parking: 'mdi-parking',
  pharmacy: 'mdi-medical-bag',
} as const

export const getAmenityIcon = (amenity: string): string => {
  if (amenity in amenityIcons) {
    return amenityIcons[amenity as keyof typeof amenityIcons]
  }

  return 'mdi-map-marker'
}
