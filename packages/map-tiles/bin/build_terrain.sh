#!/bin/sh -e

DOWNLOAD_URL="$1"
OUTPUT_DIR="$2"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Usage: $0 <zip-url> <output-dir>"
  exit 1
fi

if ! echo "$DOWNLOAD_URL" | grep -q '\.zip$'; then
  echo "Error: The provided URL does not point to a .zip file."
  exit 1
fi

if ! command -v unzip >/dev/null 2>&1; then
  echo "unzip is not installed. Please install it first."
  exit 1
fi

if ! command -v gdalbuildvrt >/dev/null 2>&1; then
  echo "gdalbuildvrt is not installed. Please install GDAL first."
  exit 1
fi

if ! command -v gdalwarp >/dev/null 2>&1; then
  echo "gdalwarp is not installed. Please install GDAL first."
  exit 1
fi

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "sqlite3 is not installed. Please install SQLite first."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is not installed. Please install Python 3 first."
  exit 1
fi

if ! command -v mb-util >/dev/null 2>&1; then
  echo "mb-util is not installed. Please install it first."
  exit 1
fi

if [ -d "$OUTPUT_DIR" ]; then
  echo "Output directory $OUTPUT_DIR already exists. Please remove it or choose a different directory."
  exit 1
fi

set -u

TEMP_DIR=$(mktemp -d -p ~/)

echo "Downloading terrain data from $DOWNLOAD_URL to $TEMP_DIR"
curl --output-dir "$TEMP_DIR" -L -o download.zip "$DOWNLOAD_URL"
unzip -o -d "$TEMP_DIR/extract" "$TEMP_DIR/download.zip"
rm -f "$TEMP_DIR/download.zip"

DSM_FILE=$(find "$TEMP_DIR/extract" -type f -name "*_DSM.tif" | head -n 1)

echo "Processing DSM file $DSM_FILE"
gdalbuildvrt -overwrite -srcnodata -9999 -vrtnodata -9999 "$TEMP_DIR/jaxa_terrainrgb.vrt" "$DSM_FILE"
gdalwarp -r cubicspline -t_srs EPSG:3857 -dstnodata "0" "$TEMP_DIR/jaxa_terrainrgb.vrt" "$TEMP_DIR/jaxa_terrainrgb_warp.vrt"
python3 src/terrain/rgbify.py "$TEMP_DIR/jaxa_terrainrgb_warp.vrt" "$TEMP_DIR/jaxa_terrainrgb.mbtiles" 2>/dev/null

echo "Creating SQLite index for tiles in $TEMP_DIR/jaxa_terrainrgb.mbtiles"
sqlite3 "$TEMP_DIR/jaxa_terrainrgb.mbtiles" "CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);"

echo "Converting MBTiles to PNG format in $OUTPUT_DIR"
mb-util --image_format=png --do_compression --silent "$TEMP_DIR/jaxa_terrainrgb.mbtiles" "$OUTPUT_DIR"

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

