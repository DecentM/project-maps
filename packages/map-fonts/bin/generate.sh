#!/bin/sh

set -eu

jq -r '[.fonts[] | .[]]' <src/config.json >dist/glyphs.json

jq -r '.fonts | to_entries[] | "\(.key) \(.value[])"' <src/config.json | while read -r family font; do
  echo "Processing $font"

  mkdir -p "dist/$font"
  ./node_modules/.bin/build-glyphs "src/fonts/$family/$font.ttf" "dist/$font"
done

# jq -r '.fonts | to_entries[] | "\(.key)"' <src/config.json | while read -r family; do
#   echo "Processing font family: $family"
#   mkdir -p "dist/$family"

#   # Assume there's a directory with the same name as the font family
#   if [ -d "src/fonts/$family" ]; then
#     echo "Found directory: $family"

#     # Loop over files in the directory
#     for file in "src/fonts/$family"/*.ttf; do
#       if [ -f "$file" ]; then
#         echo "Processing file: $file"
#         # Perform actions on the file here, e.g., copy, move, rename, etc.
#         mkdir -p "dist/$(basename "$file")"
#         ./node_modules/.bin/build-glyphs "$file" "dist/$(basename "$file")"
#       fi
#     done
#   else
#     echo "Directory $family not found."
#   fi
# done
