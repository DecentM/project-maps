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

TEMP_DIR=$(mktemp -d)

curl --output-dir "$TEMP_DIR" -L -o download.mbtiles "$DOWNLOAD_URL"

mb-util "--image_format=$IMAGE_FORMAT" --do_compression --silent "$TEMP_DIR/download.mbtiles" "$OUTPUT_DIR"

# if pbf, rename to .gz, then gunzip
if [ "$IMAGE_FORMAT" = "pbf" ]; then
  FILES=$(find "$OUTPUT_DIR" -type f -name "*.pbf")
  progress=0
  total=$(echo "$FILES" | wc -l)

  for FILE in $FILES; do
    if [ $((progress % 250)) -eq 0 ]; then
      echo "Renaming: $FILE ($((progress + 1)) of $total)"
    fi

    mv "$FILE" "$FILE.gz"
    progress=$((progress + 1))
  done
fi

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
