#!/bin/sh -e

OUTPUT_DIR="$1"

if [ -z "$OUTPUT_DIR" ]; then
  echo "Usage: $0 <output-dir>"
  exit 1
fi

if ! command -v spreet >/dev/null 2>&1; then
  echo "spreet is not installed. Please install it first."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is not installed. Are you using the devcontainer?"
  exit 1
fi

# Make sure the output directory does not end with a slash
if [ "$(printf '%s' "$OUTPUT_DIR" | tail -c 1)" = "/" ]; then
  echo "Output directory should not end with a slash."
  exit 1
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Creating output directory: $OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
fi

set -u

TEMP_DIR=$(mktemp -d -p ~/)

mkdir -p "$TEMP_DIR/download"

echo "Generating sprites - mdi..."
spreet --unique --minify-index-file node_modules/@mdi/svg/svg "$OUTPUT_DIR/mdi"
spreet --unique --minify-index-file --retina node_modules/@mdi/svg/svg "$OUTPUT_DIR/mdi@2x"

echo "Generating sprites - si..."
spreet --unique --minify-index-file node_modules/simple-icons/icons "$OUTPUT_DIR/si"
spreet --unique --minify-index-file --retina node_modules/simple-icons/icons "$OUTPUT_DIR/si@2x"

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
