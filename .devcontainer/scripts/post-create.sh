#!/bin/sh -ex

pwd

# if the user has set DEVCONTAINER_PACKAGES, install them
if [ -n "$DEVCONTAINER_PACKAGES" ]; then
  yay -S --noconfirm $DEVCONTAINER_PACKAGES
fi

set -u

# Install asdf plugins if they are defined in .tool-versions. "asdf plugin add" accepts only one plugin at a time
if [ -f .tool-versions ]; then
  while read -r plugin version; do
    echo "$plugin $version"
    asdf plugin add "$plugin"
  done < .tool-versions
fi

# Install the versions specified in .tool-versions
asdf install
