# Flatpak VS Code Dev Container Support

This document explains how to use dev containers with VS Code installed via Flatpak.

## Required Flatpak Permissions

Flatpak applications run in a sandboxed environment. To use Docker and dev containers, you need to grant VS Code access to the Docker socket and temporary directories.

### Filesystem Overrides Needed

Run these commands to add the required permissions:

```bash
# Allow access to Docker socket
flatpak override --user --filesystem=/run/docker.sock com.visualstudio.code

# Allow access to /tmp for container operations
flatpak override --user --filesystem=/tmp com.visualstudio.code

# Allow access to host's /run/host directory (for Docker binaries)
flatpak override --user --filesystem=host-os com.visualstudio.code
```

### Alternative: Using Flatseal

If you prefer a GUI, install [Flatseal](https://flathub.org/apps/com.github.tchx84.Flatseal) and add these filesystem permissions for VS Code:

- `/run/docker.sock`
- `/tmp`
- `host-os` (or `/run/host`)

## How It Works

The `.vscode/settings.json` file configures:

- **Docker paths**: Points to `/run/host/usr/bin/docker` and `/run/host/usr/bin/docker-compose` to access the host's Docker installation
- **Terminal profile**: Adds a "flatpak-host" terminal profile that uses `flatpak-spawn --host` to run commands on the host system

## Troubleshooting

### "Cannot connect to the Docker daemon"

1. Ensure Docker is running on the host: `sudo systemctl status docker`
2. Verify the socket permissions: `ls -la /run/docker.sock`
3. Add your user to the `docker` group: `sudo usermod -aG docker $USER`
4. Restart VS Code after applying permissions

### "Permission denied" when accessing /run/docker.sock

The Docker socket may have restrictive permissions. Try:

```bash
# Temporary fix (resets on reboot)
sudo chmod 666 /run/docker.sock

# Permanent fix: add user to docker group
sudo usermod -aG docker $USER
# Then log out and back in
```

### Dev container fails to start

1. Check that all Flatpak permissions are applied (see above)
2. Try using the "flatpak-host" terminal profile to manually run Docker commands
3. Check VS Code's Dev Containers output log: `View` → `Output` → select "Dev Containers" from dropdown

### Podman instead of Docker

If you're using Podman, the paths in `.vscode/settings.json` may need adjustment:

```json
"docker.dockerPath": "/run/host/usr/bin/podman",
"dev.containers.dockerPath": "/run/host/usr/bin/podman",
"dev.containers.dockerComposePath": "/run/host/usr/bin/podman-compose"
```

## Additional Resources

- [Flatpak documentation on filesystem permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html)
- [VS Code Dev Containers documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Flatseal - GUI for Flatpak permissions](https://github.com/tchx84/flatseal)