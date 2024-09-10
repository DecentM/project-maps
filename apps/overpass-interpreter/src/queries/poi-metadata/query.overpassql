[out:csv(
  ::id,
  ::type,
  ::lat,
  ::lon,
  'addr:city',
  'addr:housenumber',
  'addr:postcode',
  'addr:state',
  'addr:street',
  'name',
  'name:latin',
  'name:en',
  'amenity',
  'phone',
  'website'
  ; // columns
  false; // headers
  ";" // separator
)]
[timeout:30];

(
  node
    (id:{{id}});

  way
  	(id:{{id}});

  relation
  	(id:{{id}});
);

out body 10;
