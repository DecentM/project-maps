#!/bin/sh -eu

REGION="$1"
OUTPUT_DIR="$2"
PLANETILER_JAR="$3"
IMAGE_FORMAT="$4"
WATER_POLYGONS_URL="$5"

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

TEMP_DIR=$(mktemp -d)

java -jar "$PLANETILER_JAR" \
  --download \
  --download_dir="$TEMP_DIR/download" \
  --water-polygons-url="$WATER_POLYGONS_URL" \
  --area="$REGION" \
  --minzoom=0 \
  --maxzoom=15 \
  --render_maxzoom=15 \
  --tmpdir="$TEMP_DIR/tmp" \
  --tile_compression=none \
  --output="$TEMP_DIR/data.mbtiles"

echo "Converting MBTiles to $IMAGE_FORMAT format in $OUTPUT_DIR"
mb-util "--image_format=$IMAGE_FORMAT" --silent "$TEMP_DIR/data.mbtiles" "$OUTPUT_DIR"

# safety checks for rm -rf:
# - check if the directory exists
# - check if the directory is not empty
# - check if the directory is not the root directory
# - check if the directory is not a symlink
if [ -d "$TEMP_DIR" ] && [ "$TEMP_DIR" != "/" ] && [ ! -L "$TEMP_DIR" ] && [ "$(ls -A "$TEMP_DIR")" ]; then
  rm -rf "$TEMP_DIR"
else
  echo "Error: Temporary directory $TEMP_DIR is not safe to clean up!"
  exit 1
fi
