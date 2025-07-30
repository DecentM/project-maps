#!/bin/sh -ex

DOWNLOAD_URL="$1"
OUTPUT_DIR="$2"
PLANETILER_JAR="$3"
CACHE_DIR="$4"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$PLANETILER_JAR" ]; then
  echo "Usage: $0 <download-url> <output-dir> <planetiler-jar>"
  exit 1
fi

if ! echo "$DOWNLOAD_URL" | grep -qE '^https?://'; then
  echo "Error: Invalid download URL '$DOWNLOAD_URL'. It should start with 'http://' or 'https://'."
  exit 1
fi

if [ ! -f "$PLANETILER_JAR" ]; then
  echo "Error: Planetiler JAR file not found at $PLANETILER_JAR"
  exit 1
fi

if ! command -v java >/dev/null 2>&1; then
  echo "Java is not installed. Please install it first."
  exit 1
fi

if [ -d "$OUTPUT_DIR" ]; then
  echo "Output directory $OUTPUT_DIR already exists. Please remove it or choose a different directory."
  exit 1
fi

if [ ! -f src/vector/shortbread.yml ]; then
  echo "Error: Configuration file src/vector/shortbread.yml not found."
  exit 1
fi

set -u

TEMP_DIR="${CACHE_DIR:-$(mktemp -d -p ~/)}"

if [ ! -d "$TEMP_DIR/download" ]; then
  mkdir -p "$TEMP_DIR/download"
fi

java -Xmx4g -jar "$PLANETILER_JAR" src/vector/shortbread.yml \
  --download \
  --download_threads=1 \
  --refresh_sources=true \
  --skip_filled_tiles=true \
  --osm_url="$DOWNLOAD_URL" \
  --minzoom=0 \
  --maxzoom=14 \
  --render_maxzoom=14 \
  --tile_compression=none \
  --fetch_wikidata=true \
  --download_osm_tile_weights=true \
  --compress_temp=true \
  --tile_write_threads=2 \
  --feature_read_threads=2 \
  --free_natural_earth_after_read=true \
  --free_osm_after_read=true \
  --free_water_polygons_after_read=true \
  --free_lake_centerlines_after_read=true \
  --tmpdir="$TEMP_DIR" \
  --temp_nodes="$TEMP_DIR/node.db" \
  --temp_multipolygons="$TEMP_DIR/multipolygon.db" \
  --temp_features="$TEMP_DIR/feature.db" \
  --output="$OUTPUT_DIR/{z}/{x}/{y}.pbf"

if [ -n "$CACHE_DIR" ]; then
  echo "Leaving cache directory behind: $CACHE_DIR"
  exit 0
fi

# safety checks for rm -rf:
# - check if the directory exists
# - check if the directory is not the root directory
# - check if the directory is not a symlink
# - check if the directory is not the home directory
# - check if the directory is not the current directory
# - check if the directory is not empty
if [ -d "$TEMP_DIR" ] && [ "$TEMP_DIR" != "/" ] && [ ! -L "$TEMP_DIR" ] && [ "$TEMP_DIR" != "$HOME" ] && [ "$TEMP_DIR" != "$(pwd)" ] && [ "$(ls -A "$TEMP_DIR")" ]; then
  rm -rf "$TEMP_DIR"
else
  echo "Error: Temporary directory $TEMP_DIR is not safe to clean up!"
  exit 1
fi
