#!/bin/sh -exu

# if the user has set DEVCONTAINER_PACKAGES, install them
if [ -n "$DEVCONTAINER_PACKAGES" ]; then
    su yay -c 'yay -S --noconfirm $DEVCONTAINER_PACKAGES'
fi
