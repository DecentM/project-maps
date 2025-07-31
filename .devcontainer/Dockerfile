FROM quay.io/toolbx/arch-toolbox:latest

RUN pacman -S --needed git base-devel

RUN useradd -G wheel -m user

USER user
WORKDIR /home/user

RUN git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si && cd - && rm -rf yay && yay -Sy

RUN yay -S --noconfirm jq=1.8.1-1
RUN yay -S --noconfirm unzip=6.0-23
RUN yay -S --noconfirm asdf-vm=0.18.0-1
RUN yay -S --noconfirm spreet=0.12.1-1
RUN yay -S --noconfirm jre-openjdk=24.0.2.u12-1

RUN echo 'export PATH="$PATH:${ASDF_DATA_DIR:-$HOME/.asdf}/shims" && . <(asdf completion bash)' >>~/.bashrc

RUN wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -q -O ~/planetiler.jar
RUN echo 'alias planetiler="java -Xmx4g -jar ~/planetiler.jar"' >>~/.bashrc

RUN echo 'export PATH=$PATH:$HOME/.local/bin' >>~/.bashrc
RUN curl -s https://ohmyposh.dev/install.sh | bash -s
RUN $HOME/.local/bin/oh-my-posh init bash --config https://raw.githubusercontent.com/DecentM/dotfiles/refs/heads/main/home/dot_dotfiles/theme.omp.json >>~/.bashrc

RUN echo '\nif [ -f ~/.bashrc_user ]; then . ~/.bashrc_user; fi' >>~/.bashrc
