FROM quay.io/toolbx/arch-toolbox:latest

RUN pacman -S --needed git base-devel

# Dependencies
RUN useradd -G wheel -m yay
RUN su yay -c 'cd && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si'
RUN su yay -c 'yay -Sy'
RUN su yay -c 'yay -S --noconfirm jq fzf unzip asdf-vm'
RUN su yay -c 'yay -S --noconfirm spreet'

RUN echo 'export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH" && . <(asdf completion bash)' >>~/.bashrc

WORKDIR /root

# planetiler
RUN pacman -S --noconfirm jre-openjdk
RUN wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -O ~/planetiler.jar
RUN echo 'alias planetiler="java -Xmx4g -jar ~/planetiler.jar"' >>~/.bashrc

RUN echo 'if [ -f /root/.bashrc_user ]; then . /root/.bashrc_user; fi' >>~/.bashrc

RUN curl -s https://ohmyposh.dev/install.sh | bash -s
RUN eval "$(oh-my-posh init bash --config https://raw.githubusercontent.com/DecentM/dotfiles/refs/heads/main/home/dot_dotfiles/theme.omp.json)"
