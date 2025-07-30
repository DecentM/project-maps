#!/bin/sh -ex

DOWNLOAD_URL="$1"
OCEAN_URL="$2"
ADMIN_POINTS_URL="$3"
OUTPUT_DIR="$4"
PLANETILER_JAR="$5"
CACHE_DIR="$6"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$PLANETILER_JAR" ] || [ -z "$OCEAN_URL" ] || [ -z "$ADMIN_POINTS_URL" ]; then
  echo "Usage: $0 <download-url> <ocean-url> <admin-points-url> <output-dir> <planetiler-jar>"
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

TEMP_DIR="$(mktemp -d -p ~/)"

if [ ! -d "$TEMP_DIR/download" ]; then
  mkdir -p "$TEMP_DIR/download"
fi

if [ -n "$CACHE_DIR" ]; then
  echo "Using cache directory: $CACHE_DIR"
  mkdir -p "$CACHE_DIR"
else
  CACHE_DIR="$TEMP_DIR/cache"
  echo "No cache directory specified, using temporary cache: $CACHE_DIR"
  mkdir -p "$CACHE_DIR"
fi

WORKDIR="$(pwd)"

cd "$CACHE_DIR"

java -Xmx4g -jar "$PLANETILER_JAR" "$WORKDIR/src/vector/shortbread.yml" \
  --force \
  --tmpdir="$TEMP_DIR" \
  \
  --ocean_url="$OCEAN_URL" \
  --admin_points_url="$ADMIN_POINTS_URL" \
  \
  --download \
  --download_osm_tile_weights=true \
  --download_dir="$TEMP_DIR/download" \
  \
  --minzoom=0 \
  --maxzoom=14 \
  --render_maxzoom=14 \
  \
  --mmap_temp=true \
  --skip_filled_tiles=true \
  --tile_compression=none \
  --compress_temp=true \
  \
  --refresh_sources=true \
  --fetch_wikidata=true \
  \
  --threads=4 \
  --process_threads=3 \
  --download_threads=1 \
  --write_threads=1 \
  --tile_write_threads=1 \
  --feature_read_threads=1 \
  --sort_max_readers=4 \
  --sort_max_writers=4 \
  \
  --refresh_water_polygons=true \
  --refresh_lake_centerlines=true \
  --refresh_natural_earth=true \
  \
  --osm_url="$DOWNLOAD_URL" \
  --osm_path="$TEMP_DIR/download.osm.pbf" \
  --refresh_osm=true \
  --free_osm_after_read=true \
  --output="$WORKDIR/$OUTPUT_DIR/{z}/{x}/{y}.pbf"

cd -

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
