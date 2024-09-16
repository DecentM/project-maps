// [out:csv(
//   'wikidata',
//   'brand:wikidata'
//   ; // columns
//   false; // headers
//   ";" // separator
// )]
[out:csv(::id, ::type, ::lat, ::lon, {{tags}}; false; ";")]
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
