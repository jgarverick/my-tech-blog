---
title: "Codespaces with RHEL-Flavored Development Containers"
description: "A GitHub Codespaces setup using Rocky Linux by default, with build workflows for RHEL UBI, Rocky Linux, and Fedora container images."
pubDate: "2024-11-12"
tags: ["GitHub Codespaces", "Dev Containers", "RHEL", "Linux"]
---
GitHub Codespaces makes it easier to give a project a ready-to-use development environment, but the base image matters when you're working close to Linux distributions used in production. I put together [codespaces-demo](https://github.com/rhel-yeah/codespaces-demo) to explore that for RHEL Universal Base Images and companion distributions.

One detail worth calling out: the checked-in Codespaces configuration starts with `rockylinux:9`. The repo also includes separate Dockerfiles and workflows for building RHEL UBI, Rocky Linux, and Fedora images.

![Diagram showing the Codespaces development setup and the separate CI workflow for building, scanning, and publishing Linux devcontainer images](/images/blog/codespaces-demo/workflows.svg)

_Figure 1 – The Codespaces workspace and container-image publishing tracks._

A few technical highlights:

- **A configured workspace, not just a base image.** The devcontainer sets up a non-root `vscode` user, common utilities, and extensions for C/C++, Makefiles, Docker, and Copilot Chat. A post-create script configures Zsh, Powerlevel10k, and Git aliases.
- **Multiple Linux image options.** The build recipes cover RHEL UBI 8, 9, and 10; Rocky Linux 8, 9, and 10; and the latest Fedora image. The UBI Dockerfile accepts a `RHEL_VERSION` build argument so the major version can be selected locally.
- **Automated image delivery.** GitHub Actions builds the distro variants and publishes them to GitHub Container Registry. Trivy scans the images, with SARIF results uploaded for review.

The repository notes that RHEL 7 images were removed in August 2024 because VS Code no longer supported them. That was a useful reminder that a devcontainer needs to fit both the target operating system and the tooling expected to run inside the development environment.