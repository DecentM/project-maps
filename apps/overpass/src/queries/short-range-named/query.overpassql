[out:csv(::id, ::type, ::lat, ::lon, {{tags}}; false; "🅰")];

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
