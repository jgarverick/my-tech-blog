---
title: "Practical Dev Containers (and Codespaces)"
description: "A Microsoft Reactor session on portable development environments, consistent onboarding, custom container images, and using Codespaces in constrained environments."
pubDate: "2022-06-01"
tags: ["GitHub Codespaces", "Dev Containers", "Developer Experience", "Azure"]
---
Getting a project running should not require every developer to reconstruct the same toolchain by hand. I explored that idea in my [Practical Dev Containers (and Codespaces)](https://sessionize.com/s/josh-garverick/practical-dev-containers-and-codespaces/84829) talk, delivered at Microsoft's [Portable Development Environments](https://developer.microsoft.com/en-us/reactor/events/16207/) session. The [event recording is available on YouTube](https://www.youtube.com/watch?v=q5OrWqyA25Y).

[![Microsoft Reactor event card for Portable Development Environments, featuring Josh Garverick](/images/blog/practical-dev-containers/portable-development-environments.jpg)](https://www.youtube.com/watch?v=q5OrWqyA25Y)

_Figure 1 – The Portable Development Environments session on Microsoft Reactor._

The session looks at using a shared devcontainer configuration in GitHub Codespaces and locally in Visual Studio Code. It also gets into the less tidy cases: custom images for different operating systems, and how portable environments can help teams working under strict security requirements, including isolated or air-gapped setups.

Some of the practical themes:

- **Make onboarding repeatable.** Keep the base tools and environment requirements alongside the project so a new developer can start with a known setup.
- **Treat the container as a starting point.** Custom images and post-create configuration can adapt the environment to the operating system and tools a team actually needs.
- **Bring checks into the workflow.** The session description calls out pre-commit and Checkov as examples of tools that can be integrated into the development environment.
- **Account for constrained environments.** Codespaces and devcontainers can support collaboration, but teams still need to consider security, compliance, network isolation, and OS support.

A later practical companion is [practical-dev-containers](https://github.com/jgarverick/practical-dev-containers), first committed in February 2024. Its Ubuntu-based devcontainer includes Docker-in-Docker, Terraform, Terraform Docs, pre-commit, and Checkov; the repository also includes Terraform for an Azure test environment. The repo came after the 2022 session, but it carries the same idea forward: make the development setup part of the project instead of a private checklist on each developer's machine.