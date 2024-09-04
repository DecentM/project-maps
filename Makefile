test_pbf:
	curl -L -o ./.ignored/pbfs/greater-london-latest.osm.pbf "https://download.geofabrik.de/europe/united-kingdom/england/greater-london-latest.osm.pbf"

test_pmtiles: test_pbf
	docker compose up tilemaker
	rm -f ./.ignored/pbfs/greater-london-latest.osm.pbf
