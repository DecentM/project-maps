#!/bin/sh -e

DOWNLOAD_URL="$1"
OUTPUT_DIR="$2"
PROJECTION="$3"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$PROJECTION" ]; then
  echo "Usage: $0 <download-url> <output-dir> <projection>"
  exit 1
fi

if ! echo "$DOWNLOAD_URL" | grep -q '\.zip$'; then
  echo "Error: The provided URL does not point to a .zip file."
  exit 1
fi

if ! command -v tippecanoe >/dev/null 2>&1; then
  echo "tippecanoe is not installed. Please install it first."
  exit 1
fi

if ! command -v ogr2ogr >/dev/null 2>&1; then
  echo "ogr2ogr is not installed. Please install it first."
  exit 1
fi

if [ -d "$OUTPUT_DIR" ]; then
  echo "Output directory $OUTPUT_DIR already exists. Please remove it or choose a different directory."
  exit 1
fi

set -u

TEMP_DIR=$(mktemp -d -p ~/)

echo "Downloading water data from $DOWNLOAD_URL to $TEMP_DIR"
curl --output-dir "$TEMP_DIR" -L -o download.zip "$DOWNLOAD_URL"
unzip -o -d "$TEMP_DIR/extract" "$TEMP_DIR/download.zip"
rm -f "$TEMP_DIR/download.zip"

echo "Extracting water data from shapefile in $TEMP_DIR"
SHAPE_FILE=$(find "$TEMP_DIR/extract" -type f -name "*.shp" | head -n 1)
ogr2ogr -f GeoJSON "$TEMP_DIR/water.json" "$SHAPE_FILE"

echo "Building MBTiles from GeoJSON in $TEMP_DIR"
tippecanoe -o "$TEMP_DIR/water.mbtiles" "--projection=$PROJECTION" -l water -Z 0 -z 12 --drop-densest-as-needed --extend-zooms-if-still-dropping "$TEMP_DIR/water.json"

echo "Converting MBTiles to PBF format in $OUTPUT_DIR"
mb-util --image_format=pbf --do_compression --silent "$TEMP_DIR/water.mbtiles" "$OUTPUT_DIR"

echo "Renaming .pbf files to .gz in $OUTPUT_DIR"
find "$OUTPUT_DIR" -name "*.pbf" -exec mv {} {}.gz \;

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
