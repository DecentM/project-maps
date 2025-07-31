FROM quay.io/toolbx/arch-toolbox:latest

RUN pacman -S --needed git base-devel

# Dependencies
RUN useradd -G wheel -m user

USER user
WORKDIR /home/user

RUN git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si && cd - && rm -rf yay
RUN yay -Sy
RUN yay -S --noconfirm jq fzf unzip asdf-vm spreet jre-openjdk

RUN echo 'export PATH="$PATH:${ASDF_DATA_DIR:-$HOME/.asdf}/shims" && . <(asdf completion bash)' >>~/.bashrc

RUN wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -q -O ~/planetiler.jar
RUN echo 'alias planetiler="java -Xmx4g -jar ~/planetiler.jar"' >>~/.bashrc

RUN curl -s https://ohmyposh.dev/install.sh | bash -s
RUN eval "$(oh-my-posh init bash --config https://raw.githubusercontent.com/DecentM/dotfiles/refs/heads/main/home/dot_dotfiles/theme.omp.json)"
RUN echo 'export PATH=$PATH:$HOME/.local/bin' >>~/.bashrc

RUN echo 'if [ -f ~/.bashrc_user ]; then . ~/.bashrc_user; fi' >>~/.bashrc
