#!/bin/sh

set -eux

mkdir -p \
  "dist/Roboto Black" \
  "dist/Roboto Black" \
  "dist/Roboto Black Italic" \
  "dist/Roboto Bold" \
  "dist/Roboto Bold Italic" \
  "dist/Roboto Italic" \
  "dist/Roboto Light" \
  "dist/Roboto Light Italic" \
  "dist/Roboto Medium" \
  "dist/Roboto Medium Italic" \
  "dist/Roboto Regular" \
  "dist/Roboto Thin" \
  "dist/Roboto Thin Italic" \
  "dist/Roboto Condensed Bold" \
  "dist/Roboto Condensed Bold Italic" \
  "dist/Roboto Condensed Italic" \
  "dist/Roboto Condensed Light" \
  "dist/Roboto Condensed Light Italic" \
  "dist/Roboto Condensed Regular" \
  "dist/Noto Sans Bold" \
  "dist/Noto Sans Bold Italic" \
  "dist/Noto Sans Italic" \
  "dist/Noto Sans Regular" \
  "dist/Open Sans Bold" \
  "dist/Open Sans Bold Italic" \
  "dist/Open Sans Cond Bold" \
  "dist/Open Sans Cond Light" \
  "dist/Open Sans Cond Light Italic" \
  "dist/Open Sans Extra Bold" \
  "dist/Open Sans Extra Bold Italic" \
  "dist/Open Sans Italic" \
  "dist/Open Sans Light" \
  "dist/Open Sans Light Italic" \
  "dist/Open Sans Regular" \
  "dist/Open Sans Semi Bold" \
  "dist/Open Sans Semi Bold Italic"

cat <<EOF >dist/glyphs.json
[
  "Roboto Black",
  "Roboto Black",
  "Roboto Black Italic",
  "Roboto Bold",
  "Roboto Bold Italic",
  "Roboto Italic",
  "Roboto Light",
  "Roboto Light Italic",
  "Roboto Medium",
  "Roboto Medium Italic",
  "Roboto Regular",
  "Roboto Thin",
  "Roboto Thin Italic",
  "Roboto Condensed Bold",
  "Roboto Condensed Bold Italic",
  "Roboto Condensed Italic",
  "Roboto Condensed Light",
  "Roboto Condensed Light Italic",
  "Roboto Condensed Regular",
  "Noto Sans Bold",
  "Noto Sans Bold Italic",
  "Noto Sans Italic",
  "Noto Sans Regular",
  "Open Sans Bold",
  "Open Sans Bold Italic",
  "Open Sans Cond Bold",
  "Open Sans Cond Light",
  "Open Sans Cond Light Italic",
  "Open Sans Extra Bold",
  "Open Sans Extra Bold Italic",
  "Open Sans Italic",
  "Open Sans Light",
  "Open Sans Light Italic",
  "Open Sans Regular",
  "Open Sans Semi Bold",
  "Open Sans Semi Bold Italic"
]
EOF

./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Black.ttf "dist/Roboto Black"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-BlackItalic.ttf "dist/Roboto Black Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Bold.ttf "dist/Roboto Bold"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-BoldItalic.ttf "dist/Roboto Bold Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Italic.ttf "dist/Roboto Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Light.ttf "dist/Roboto Light"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-LightItalic.ttf "dist/Roboto Light Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Medium.ttf "dist/Roboto Medium"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-MediumItalic.ttf "dist/Roboto Medium Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Regular.ttf "dist/Roboto Regular"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-Thin.ttf "dist/Roboto Thin"
./node_modules/.bin/build-glyphs src/fonts/roboto/Roboto-ThinItalic.ttf "dist/Roboto Thin Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-Bold.ttf "dist/Roboto Condensed Bold"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-BoldItalic.ttf "dist/Roboto Condensed Bold Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-Italic.ttf "dist/Roboto Condensed Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-Light.ttf "dist/Roboto Condensed Light"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-LightItalic.ttf "dist/Roboto Condensed Light Italic"
./node_modules/.bin/build-glyphs src/fonts/roboto/RobotoCondensed-Regular.ttf "dist/Roboto Condensed Regular"
./node_modules/.bin/build-glyphs src/fonts/noto/NotoSans-Bold.ttf "dist/Noto Sans Bold"
./node_modules/.bin/build-glyphs src/fonts/noto/NotoSans-BoldItalic.ttf "dist/Noto Sans Bold Italic"
./node_modules/.bin/build-glyphs src/fonts/noto/NotoSans-Italic.ttf "dist/Noto Sans Italic"
./node_modules/.bin/build-glyphs src/fonts/noto/NotoSans-Regular.ttf "dist/Noto Sans Regular"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-Bold.ttf "dist/Open Sans Bold"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-BoldItalic.ttf "dist/Open Sans Bold Italic"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-CondensedBold.ttf "dist/Open Sans Cond Bold"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-CondensedLightItalic.ttf "dist/Open Sans Cond Light"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-CondensedLightItalic.ttf "dist/Open Sans Cond Light Italic"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-ExtraBold.ttf "dist/Open Sans Extra Bold"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-ExtraBoldItalic.ttf "dist/Open Sans Extra Bold Italic"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-Italic.ttf "dist/Open Sans Italic"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-Light.ttf "dist/Open Sans Light"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-LightItalic.ttf "dist/Open Sans Light Italic"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-Regular.ttf "dist/Open Sans Regular"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-SemiBold.ttf "dist/Open Sans Semi Bold"
./node_modules/.bin/build-glyphs src/fonts/opensans/OpenSans-SemiBoldItalic.ttf "dist/Open Sans Semi Bold Italic"
