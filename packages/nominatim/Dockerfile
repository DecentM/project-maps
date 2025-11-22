FROM mediagis/nominatim:5.2

COPY ./import-style.lua /nominatim/import-style.lua
#COPY ./full.lua /usr/local/lib/python3.12/dist-packages/nominatim_db/resources/lib-lua/themes/nominatim/topics/full.lua

ENV NOMINATIM_IMPORT_STYLE=import-style.lua
