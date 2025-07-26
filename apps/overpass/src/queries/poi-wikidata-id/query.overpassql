[out:csv(::id, ::type, ::lat, ::lon, {{tags}}; false; "🅰")]
[timeout:30];

(
  node
    (id:{{ids}});

  way
  	(id:{{ids}});

  relation
  	(id:{{ids}});
);

out body 10;
