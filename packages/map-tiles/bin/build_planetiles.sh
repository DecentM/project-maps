#!/bin/sh -e

REGION="$1"
OUTPUT_DIR="$2"
PLANETILER_JAR="$3"
IMAGE_FORMAT="$4"

if [ -z "$REGION" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$PLANETILER_JAR" ] || [ -z "$IMAGE_FORMAT" ]; then
  echo "Usage: $0 <region> <output-dir> <planetiler-jar> <image-format>"
  exit 1
fi

if [ ! -f "$PLANETILER_JAR" ]; then
  echo "Error: Planetiler JAR file not found at $PLANETILER_JAR"
  exit 1
fi

if [ "$IMAGE_FORMAT" != "png" ] && [ "$IMAGE_FORMAT" != "pbf" ]; then
  echo "Error: Invalid image format '$IMAGE_FORMAT'. Supported formats are 'png' and 'pbf'."
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

TEMP_DIR=$(mktemp -d -p ~/)

mkdir -p "$TEMP_DIR/download"

java -Xmx4g -jar "$PLANETILER_JAR" src/vector/shortbread.yml \
  --download \
  --area="$REGION" \
  --minzoom=0 \
  --maxzoom=14 \
  --render_maxzoom=14 \
  --tile_compression=none \
  --fetch_wikidata=true \
  --download_osm_tile_weights=true \
  --compress_temp=true \
  --tile_write_threads=2 \
  --feature_read_threads=2 \
  --output="$OUTPUT_DIR/{z}/{x}/{y}.pbf"

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
