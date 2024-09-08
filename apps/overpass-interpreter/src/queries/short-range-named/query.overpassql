[out:json];

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

out body;
