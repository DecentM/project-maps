FROM quay.io/toolbx/arch-toolbox:latest

RUN pacman -S --needed git base-devel
RUN wget https://github.com/concourse/concourse/releases/download/v7.13.2/fly-7.13.2-linux-amd64.tgz -qO- | tar xzv && mv fly /usr/local/bin/fly && chmod +x /usr/local/bin/fly

RUN useradd -G wheel -m user

USER user
WORKDIR /home/user

RUN git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si && cd - && rm -rf yay && yay -Sy

RUN yay -S --noconfirm --removemake spreet=0.12.1-1 && yay -Sc --noconfirm
RUN yay -S --noconfirm --removemake jre-openjdk=24.0.2.u12-1 && yay -Sc --noconfirm
RUN yay -S --noconfirm --removemake jq=1.8.1-1 && yay -Sc --noconfirm
RUN yay -S --noconfirm --removemake unzip=6.0-23 && yay -Sc --noconfirm
RUN yay -S --noconfirm --removemake asdf-vm=0.18.0-1 && yay -Sc --noconfirm

ENV PATH="/home/user/.asdf/shims:/root/.asdf/shims:/root/.local/bin:/home/user/.local/bin:$PATH"
RUN echo '. <(asdf completion bash)' >>~/.bashrc

RUN wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -q -O ~/planetiler.jar
RUN echo 'alias planetiler="java -Xmx4g -jar ~/planetiler.jar"' >>~/.bashrc

RUN curl -s https://ohmyposh.dev/install.sh | bash -s
RUN $HOME/.local/bin/oh-my-posh init bash --config https://raw.githubusercontent.com/DecentM/dotfiles/refs/heads/main/home/dot_dotfiles/theme.omp.json >>~/.bashrc

RUN echo >>~/.bashrc && echo "if [ -f ~/.bashrc_user ]; then . ~/.bashrc_user; fi" >>~/.bashrc
