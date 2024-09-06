FROM alpine:3.12 AS base
WORKDIR /app

ARG PBF_URL=fixme
RUN wget -O planet.pbf ${PBF_URL}

###########################################################
FROM ghcr.io/systemed/tilemaker:master AS tilemaker
WORKDIR /app

COPY --from=base /app/planet.pbf ./
COPY ./src/ ./

RUN mkdir -p dist && mkdir -p store && /usr/src/app/tilemaker ./planet.pbf \
  --output ./dist/ \
  --config ./config.json \
  --store ./store \
  --process process-debug.lua \
  --materialize-geometries
