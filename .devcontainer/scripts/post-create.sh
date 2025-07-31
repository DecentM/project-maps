#!/bin/sh -exu

if [ command -v asdf >/dev/null 2>&1 ]; then
    # Install asdf plugins if they are defined in .tool-versions
    if [ -f /root/.tool-versions ]; then
        asdf plugin add $(awk '{print $1}' /root/.tool-versions | sort -u)
    fi

    # Install the versions specified in .tool-versions
    asdf install
else
    echo "asdf is not installed. Please ensure asdf is set up correctly."
    exit 1
fi
