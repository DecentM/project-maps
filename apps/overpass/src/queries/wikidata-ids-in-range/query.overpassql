[out:csv(::id, ::type, ::lat, ::lon, {{tags}}; false; "🅰")]
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
