[out:csv(
  'wikidata',
  'brand:wikidata'
  ; // columns
  false; // headers
  ";" // separator
)]
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
