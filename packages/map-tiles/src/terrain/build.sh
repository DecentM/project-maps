#!/bin/sh

set -eu

INPUT_DIR=src/terrain/input
OUTPUT_DIR=dist/terrain

TMP_DIR=${OUTPUT_DIR}_tmp

vrtfile=${TMP_DIR}/jaxa_terrainrgb.vrt
vrtfile2=${TMP_DIR}/jaxa_terrainrgb_warp.vrt
LOG_FILE=${TMP_DIR}/log.txt

[ -d "$INPUT_DIR" ] || {
  echo "error: $INPUT_DIR " 1>&2
  exit 1
}

[ -d "$OUTPUT_DIR" ] || mkdir -p $OUTPUT_DIR || {
  echo "error: $OUTPUT_DIR " 1>&2
  exit 1
}

[ -d "$OUTPUT_DIR" ] || {
  echo "error: $OUTPUT_DIR " 1>&2
  exit 1
}

# clean if output directory exists
[ -d "$OUTPUT_DIR" ] && {
  rm -rf $OUTPUT_DIR
}

# clean if tmp directory exists
[ -d "$TMP_DIR" ] && {
  rm -rf $TMP_DIR
}

mkdir -p $TMP_DIR

echo "Start: $(date)" >$LOG_FILE
echo >>$LOG_FILE

echo "Building terrain tiles"
echo "  Log file: $LOG_FILE"
echo

echo "Building VRT"
gdalbuildvrt -overwrite -srcnodata -9999 -vrtnodata -9999 ${vrtfile} "$INPUT_DIR"/*_DSM.tif >>$LOG_FILE 2>>$LOG_FILE

echo "Warping VRT"
gdalwarp -r cubicspline -t_srs EPSG:3857 -dstnodata 0 -co COMPRESS=DEFLATE ${vrtfile} ${vrtfile2} >>$LOG_FILE 2>>$LOG_FILE

echo "Converting to mbtiles"
python3 src/terrain/rgbify.py ${vrtfile2} "${TMP_DIR}/jaxa_terrainrgb.mbtiles" >>$LOG_FILE 2>>$LOG_FILE
rm -f ${vrtfile}
rm -f ${vrtfile2}

echo "Creating tile index"
sqlite3 "${TMP_DIR}/jaxa_terrainrgb.mbtiles" 'CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);' >>$LOG_FILE 2>>$LOG_FILE

echo "Creating pbfs"
mb-util "${TMP_DIR}/jaxa_terrainrgb.mbtiles" "${OUTPUT_DIR}" >>$LOG_FILE 2>>$LOG_FILE

echo "Cleaning up"
rm -rf "${TMP_DIR}"
