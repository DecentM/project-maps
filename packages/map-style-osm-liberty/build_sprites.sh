#!/bin/sh

set -eu

if ! command -v spreet >/dev/null; then
  echo "spreet is not installed. Please install it by running 'brew install flother/taps/spreet'."
  exit 1
fi

mkdir -p /tmp/svgs

cp -a ./src/svgs/svgs_not_in_iconset/. /tmp/svgs/
cp -a ./src/svgs/svgs_iconset/. /tmp/svgs/

spreet --unique --minify-index-file --recursive /tmp/svgs/ ./dist/sprites/osm-liberty
spreet --unique --minify-index-file --recursive --retina /tmp/svgs/ ./dist/sprites/osm-liberty@2x

rm -r /tmp/svgs
