#!/bin/sh

set -e

# Get inputs from args:
# - --input: path to the input file
# - --layers-dir: path to the directory where the layers will be written
# - --layers-file: path to the file where the layer exports will be written

input=""
layersDir=""
layersFile=""

while [ $# -gt 0 ]; do
  case "$1" in
  --input)
    input="$2"
    shift
    ;;
  --layers-dir)
    layersDir="$2"
    shift
    ;;
  --layers-file)
    layersFile="$2"
    shift
    ;;
  *)
    echo "Unknown argument: $1"
    exit 1
    ;;
  esac
  shift
done

if [ -z "$input" ]; then
  echo "Missing input argument"
  exit 1
fi

if [ -z "$layersDir" ]; then
  echo "Missing layers-dir argument"
  exit 1
fi

if [ -z "$layersFile" ]; then
  echo "Missing layers-file argument"
  exit 1
fi

# Create the layers directory
mkdir -p "$layersDir"

jsonConsts=$(jq -cr '.layers[]' <"$input")

printf "import type { LayerSpecification } from 'maplibre-gl'\n\n" >"$layersFile"

echo "$jsonConsts" | while IFS= read -r layer; do
  id=$(echo "$layer" | jq -r '.id' | sed 's/-/_/g')
  printf "import type { LayerSpecification } from 'maplibre-gl'\n\nexport const %s: LayerSpecification = %s as unknown as LayerSpecification;\n" "$id" "$layer" >"$layersDir/$id.ts"
  printf "import {$id} from './layers/%s'\n" "$id" >>"$layersFile"
done

printf "\nexport const layers: LayerSpecification[] = [\n" >>"$layersFile"

echo "$jsonConsts" | while IFS= read -r layer; do
  id=$(echo "$layer" | jq -r '.id' | sed 's/-/_/g')
  printf "  %s,\n" "$id" >>"$layersFile"
done

printf "]\n" >>"$layersFile"
