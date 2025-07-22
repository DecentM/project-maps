FROM quay.io/toolbx/arch-toolbox:latest

RUN pacman -S --needed git base-devel

# Dependencies
RUN useradd -G wheel -m yay
RUN su yay -c 'cd && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si'
RUN su yay -c 'yay -Sy'
RUN su yay -c 'yay -S --noconfirm jq fzf unzip asdf-vm'
RUN su yay -c 'yay -S --noconfirm spreet gdal'
RUN su yay -c 'yay -S --noconfirm python python-pip python-rasterio python-pillow'
RUN su yay -c 'yay -S --noconfirm tippecanoe'
RUN userdel yay

RUN pip install rio-mucho mercantile --break-system-packages

# NodeJS stuff
RUN asdf plugin add nodejs && asdf plugin add pnpm

RUN echo 'export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH" && . <(asdf completion bash)' >>~/.bashrc

# mb-util
WORKDIR /root
RUN git clone https://github.com/mapbox/mbutil.git
RUN echo 'export PATH="$HOME/mbutil/:$PATH"' >>~/.bashrc
