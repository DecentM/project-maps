// [out:csv(
//   ::id,
//   ::type,
//   ::lat,
//   ::lon,
//   'addr:city',
//   'addr:housenumber',
//   'addr:postcode',
//   'addr:state',
//   'addr:street',
//   'name',
//   'name:latin',
//   'name:en',
//   'amenity',
//   'phone',
//   'website'
//   ; // columns
//   false; // headers
//   ";" // separator
// )]
// [timeout:30];
[out:csv(::id, ::type, ::lat, ::lon, {{tags}}; false; ";")]
[timeout:30];

(
  node
  	(around:{{range}}, {{coordinates.lat}}, {{coordinates.lng}})
    [name];

  way
  	(around:{{range}}, {{coordinates.lat}}, {{coordinates.lng}})
    [name];

  relation
  	(around:{{range}}, {{coordinates.lat}}, {{coordinates.lng}})
    [name];
);
out body 10;

// Recurse into the relations and add nodes from it into the result
(._; >;);
out body 25;
