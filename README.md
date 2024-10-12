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

> If you're on Windows, you must use WSL to run these commands. Running the
> project natively on Windows isn't supported.

- Install `brew`
  - [Linuxbrew](https://docs.brew.sh/Homebrew-on-Linux) for Linux and WSL
  - [Homebrew](https://brew.sh/) for Macs
- [Set up asdf](https://asdf-vm.com/) with these plugins:
  - [nodejs](https://github.com/asdf-vm/asdf-nodejs.git)
  - [pnpm](https://github.com/jonathanmorley/asdf-pnpm.git)
  - [poetry](https://github.com/asdf-community/asdf-poetry.git)
  - You can also use other version management software, what matters is you get
    these binaries installed and available in your `$PATH`.
- `xargs brew install <brew_requirements.txt`
- `asdf install`
- Activate the venv: `poetry env use`
  - Tip: Use an [auto-switch plugin](https://github.com/MichaelAquilina/zsh-autoswitch-virtualenv)
    to activate the venv when you `cd` into this directory
- `poetry install`
- In all directories under `apps/`, copy the `.env.example` files and name it
  `.env`. Fill out the empty fields.
- In `packages/map-tiles`, copy `build-input.example.json` to `build-input.json`
  and optionally, change the fields to refer to your preferred area for
  development. By default, this will be the greater London area.
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
