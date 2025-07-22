#!/bin/sh -eu

DOWNLOAD_URL="$1"
OUTPUT_DIR="$2"
IMAGE_FORMAT="$3"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$IMAGE_FORMAT" ]; then
  echo "Usage: $0 <download-url> <output-dir> <image-format>"
  exit 1
fi

if [ "$IMAGE_FORMAT" != "png" ] && [ "$IMAGE_FORMAT" != "pbf" ]; then
  echo "Error: Invalid image format '$IMAGE_FORMAT'. Supported formats are 'png' and 'pbf'."
  exit 1
fi

if ! echo "$DOWNLOAD_URL" | grep -q '\.mbtiles$'; then
  echo "Error: The provided URL does not point to a .mbtiles file."
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

TEMP_DIR=$(mktemp -d -p ~/)

echo "Downloading MBTiles from $DOWNLOAD_URL to $TEMP_DIR"
curl --output-dir "$TEMP_DIR" -L -o download.mbtiles "$DOWNLOAD_URL"

echo "Converting MBTiles to $IMAGE_FORMAT format in $OUTPUT_DIR"
mb-util "--image_format=$IMAGE_FORMAT" --do_compression --silent "$TEMP_DIR/download.mbtiles" "$OUTPUT_DIR"

# if pbf, rename to .gz
if [ "$IMAGE_FORMAT" = "pbf" ]; then
  echo "Renaming .pbf files to .gz in $OUTPUT_DIR"
  find "$OUTPUT_DIR" -name "*.pbf" -exec mv {} {}.gz \;
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
