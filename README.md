# Project Maps

An experiment to create an end-user focused maps application using open data

![Screenshot of a map, with a point selected. An info panel shows details about
its website, phone number, opening hours, and a street-level photo](/.github/readme/screenshot.png?raw=true)

## Introduction

- **Why**: I wanted to create something like mainstream maps applications, but
  using only free data sources, and maybe also learn something in the process.
- **What**: This repo is a monorepo of different apps and packages, managed
  using [Moon](https://moonrepo.dev/)

## About the name

The name *Project Maps* kinda sucks, but I couldn't be bothered to come up with
a name when I created it because I just wanted to dive into the coding bit.
It'll eventually get a proper name, but it's got to be like a modern, punchy one
that's easy to remember.

## Development setup

> We build a large devcontainer with all needed tools preinstalled to run the
> project. You can probably get everything running on your host machine, but
> outside the prebuilt devcontainer, you're treading foreign waters.

- Clone the repo: `git clone https://github.com/DecentM/project-maps.git`
- Set up devcontainers for your editor
  - [Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - [nvim plugin](https://github.com/esensar/nvim-dev-container)
  - If your editor/IDE doesn't support devcontainers, you can also run the
    prebuilt container manually:  
    `docker run -v ./project-maps:/workspace:cached -it -w /workspace
    ghcr.io/decentm/project-maps-devcontainer:latest`
- Run the devcontainer and open a terminal in it
- Run `pnpm i`
- Copy the `.env.example` file and name it `.env`. Fill out the empty fields.
- In theory, `pnpm moon :up` should bring up the project in development mode

> The first start will take a while depending on your internet connection and
> computer speed, because the initialisation scripts are downloading map data
> from various sources.

## Installation

At the moment, there is no supported way to run this in production mode, it'll
come eventually. You're welcome to help in this department if you'd like!

## Acknowledgements

- [MapLibre](https://maplibre.org/) for their great canvas renderer, forked from
  Mapbox GL JS
- [OpenStreetMap](https://www.openstreetmap.org/) and
  [Overpass-Turbo](https://overpass-turbo.eu/) for map data and POI metadata
- [JAXA](https://earth.jaxa.jp/en/) for terrain heightmaps
