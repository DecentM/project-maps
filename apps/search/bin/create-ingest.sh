#!/bin/sh

set -e

bin/osmconvert64 \
  ../../packages/map-tiles/dist/greater-london-latest.osm.pbf \
  --all-to-nodes \
  --csv="@id addr:city addr:housenumber addr:postcode addr:state addr:street name name_int name:latin name:en amenity phone website leisure shop barrier wheelchair tourism artwork_type landuse opening_hours bus highway lit" \
  --csv-headline | pnpm tsx bin/clean-csv.ts
