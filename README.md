# Project Maps

## Installation

> If you're on Windows, you must use WSL to run these commands. Running the
> project natively on Windows isn't supported.

- Install `brew`
  - [Linuxbrew](https://docs.brew.sh/Homebrew-on-Linux) for Linux and WSL
  - [Homebrew](https://brew.sh/) for Macs
- [Set up asdf](https://asdf-vm.com/) with these plugins:
  - [nodejs](https://github.com/asdf-vm/asdf-nodejs.git)
  - [pnpm](https://github.com/jonathanmorley/asdf-pnpm.git)
  - [poetry](https://github.com/asdf-community/asdf-poetry.git)
- `xargs brew install <brew_requirements.txt`
- `asdf install`
- Activate the venv: `activate`
  - Use an [auto-switch plugin](MichaelAquilina/zsh-autoswitch-virtualenv) to
    activate the venv when you `cd` into this directory
- `poetry install`
