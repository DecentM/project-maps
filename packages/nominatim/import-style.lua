local flex = require('flex-base')

flex.add_for_extratags{
  "addr:city",
  "addr:housenumber",
  "addr:postcode",
  "addr:state",
  "addr:street",
  "name:latin",
  "name:en",
  "amenity",
  "phone",
  "website",
  "contact:website",
  "leisure",
  "shop",
  "barrier",
  "wheelchair",
  "tourism",
  "artwork_type",
  "landuse",
  "opening_hours",
  "bench",
  "bin",
  "bus",
  "highway",
  "lit",
  "brand:wikidata",
  "subject:wikidata",
  "access",
  "defibrillator:location",
  "defibrillator:location:en",
  "emergency",
  "emergency:phone",
  "defibrillator:code",
  "indoor",
  "locked",
  "locked:conditional",
  "description",
  "manufacturer",
  "model"
}

flex.load_topic('full', {with_extratags = true})

return flex
