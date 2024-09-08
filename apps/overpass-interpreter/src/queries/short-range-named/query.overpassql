[out:json];

(
  node
  	(around:{{radius}}, {{lng}}, {{lat}})
    [name];

  way
  	(around:{{radius}}, {{lng}}, {{lat}})
    [name];

  relation
  	(around:{{radius}}, {{lng}}, {{lat}})
    [name];
);

out body;
