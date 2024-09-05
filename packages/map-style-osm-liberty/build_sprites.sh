#!/bin/sh

set -eu

if ! command -v spreet >/dev/null; then
  echo "spreet is not installed. Please install it by running 'brew install flother/taps/spreet'."
  exit 1
fi

mkdir -p ./.ignored/temp/svgs

cp -a ./svgs/svgs_not_in_iconset/. ./.ignored/temp/svgs/
cp -a ./svgs/svgs_iconset/. ./.ignored/temp/svgs/

spreet --unique --minify-index-file --recursive ./.ignored/temp/svgs/ ./sprites/osm-liberty
spreet --unique --minify-index-file --recursive --retina ./.ignored/temp/svgs/ ./sprites/osm-liberty@2x

rm -r ./.ignored/temp
