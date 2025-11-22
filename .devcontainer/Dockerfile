FROM quay.io/toolbx/arch-toolbox:latest

WORKDIR /usr/local

# SSH
# This has to be done first, so that later layers don't reset the SSH host key
RUN ssh-keygen -t rsa -f /etc/ssh/ssh_host_key -q -N "" && chmod 644 /etc/ssh/ssh_host_key && uuidgen > /etc/machine-id
ARG SSH_PORT=2222
EXPOSE ${SSH_PORT}

# mb-util
RUN git clone https://github.com/mapbox/mbutil.git
RUN wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -q -O /usr/local/bin/planetiler.jar

RUN pacman -S --needed git base-devel
ARG FLY_VERSION=7.13.2
RUN wget https://github.com/concourse/concourse/releases/download/v${FLY_VERSION}/fly-${FLY_VERSION}-linux-amd64.tgz -qO- | tar xzv && mv fly /usr/local/bin/fly && chmod +x /usr/local/bin/fly

RUN useradd -G wheel -m user
ARG SSH_PASSWORD=user
RUN echo "user:${SSH_PASSWORD}" | chpasswd

USER user
WORKDIR /home/user

RUN git clone https://aur.archlinux.org/yay.git && cd yay && makepkg --noconfirm -si && cd - && rm -rf yay && yay -Sy

ARG SPREET_VERSION=0.12.1-1
RUN yay -S --noconfirm --removemake spreet=${SPREET_VERSION} && yay -Sc --noconfirm

ARG JRE_VERSION=24.0.2.u12-1
RUN yay -S --noconfirm --removemake jre-openjdk=${JRE_VERSION} && yay -Sc --noconfirm

ARG JQ_VERSION=1.8.1-1
RUN yay -S --noconfirm --removemake jq=${JQ_VERSION} && yay -Sc --noconfirm

ARG UNZIP_VERSION=6.0-23
RUN yay -S --noconfirm --removemake unzip=${UNZIP_VERSION} && yay -Sc --noconfirm

ARG ASDF_VERSION=0.18.0-1
RUN yay -S --noconfirm --removemake asdf-vm=${ASDF_VERSION} && yay -Sc --noconfirm

ARG PYTHON_VERSION=3.13.5-1 PIP_VERSION=25.1.1-1
RUN yay -S --noconfirm --removemake python=${PYTHON_VERSION} python-pip=${PIP_VERSION} && yay -Sc --noconfirm

RUN echo 'alias planetiler="java -Xmx4g -jar /usr/local/bin/planetiler.jar"' >>~/.bashrc

# asdf plugins
RUN echo '. <(asdf completion bash)' >>~/.bashrc
RUN echo 'export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:/usr/local/mbutil:$PATH"' >>~/.bashrc
COPY --chmod=755 --chown=user ./.devcontainer/scripts/ /home/user/scripts/
COPY --chown=user .tool-versions /home/user/.tool-versions
RUN /home/user/scripts/post-create.sh

RUN echo "if [ -f ~/.bashrc_user ]; then . ~/.bashrc_user; fi" >>~/.bashrc

# oh-my-posh
RUN curl -s https://ohmyposh.dev/install.sh | bash -s
RUN $HOME/.local/bin/oh-my-posh init bash --config https://raw.githubusercontent.com/DecentM/dotfiles/refs/heads/main/home/dot_dotfiles/theme.omp.json >>~/.bashrc

# supervisord
ARG SUPERVISOR_VERSION=4.2.5-4
RUN yay -S --noconfirm --removemake supervisor=${SUPERVISOR_VERSION} && yay -Sc --noconfirm
COPY --chown=user:user ./.devcontainer/supervisord.conf /home/user/supervisord.conf

ENTRYPOINT supervisord
CMD ["-c", "/home/user/supervisord.conf"]
