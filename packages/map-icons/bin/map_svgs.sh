#!/bin/sh

set -eu

if [ ! -d "./node_modules/@mdi/svg/svg" ]; then
  echo "@mdi/svg not found, run 'pnpm i' first"
  exit 1
fi

mkdir -p ./.ignored/svgs

icons_to_copy=$(jq -r '.[]' <src/mapping.json | sort | uniq)

for icon in $icons_to_copy; do
  query=$(printf 'to_entries | map(select(.value == "%s")) | .[].key // "%s"' "$icon" "$icon")
  mapped_names=$(jq -r "$query" <src/mapping.json | xargs)
  filename=$(echo "$icon" | cut -d '-' -f2- | xargs)

  for mapped_name in ${mapped_names}; do
    cp "node_modules/@mdi/svg/svg/$filename.svg" "./.ignored/svgs/$mapped_name.svg"
  done
done
