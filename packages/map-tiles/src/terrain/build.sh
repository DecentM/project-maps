#!/bin/sh

set -eu

vrtfile=dist/terrain_tmp/jaxa_terrainrgb.vrt
vrtfile2=dist/terrain_tmp/jaxa_terrainrgb_warp.vrt

rm -rf dist/terrain_tmp
rm -rf dist/terrain
mkdir -p dist/terrain_tmp

gdalbuildvrt -overwrite -srcnodata -9999 -vrtnodata -9999 ${vrtfile} src/terrain/input/*_DSM.tif

gdalwarp -r cubicspline -t_srs EPSG:3857 -dstnodata 0 ${vrtfile} ${vrtfile2}

python3 src/terrain/rgbify.py ${vrtfile2} "dist/terrain_tmp/jaxa_terrainrgb.mbtiles"

sqlite3 "dist/terrain_tmp/jaxa_terrainrgb.mbtiles" 'CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);'

mb-util "dist/terrain_tmp/jaxa_terrainrgb.mbtiles" dist/terrain

rm -rf "dist/terrain_tmp"
