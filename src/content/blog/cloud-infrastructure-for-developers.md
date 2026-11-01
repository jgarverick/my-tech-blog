---
title: "Cloud Infrastructure for Developers"
description: "A look back at my Microsoft Zero to Hero session and the azd and Bicep repository that explores code-first Azure infrastructure."
pubDate: "2024-07-13T00:00:00Z"
tags: ["Azure", "Bicep", "Azure Developer CLI", "Container Apps", "DevOps"]
---

Building an application is hard enough without leaving its hosting, configuration, and deployment as a mystery for later. That was the idea behind my *Cloud Infrastructure for Developers* session with the Microsoft Zero to Hero Community on July 13, 2024. The [recording is available on YouTube](https://www.youtube.com/watch?v=e6eljOy0ghE), and the [session description](https://sessionize.com/s/josh-garverick/cloud-infrastructure-for-developers/90305) covers the code-first approach: choosing services, testing with local and cloud resources, and connecting the pieces with build and release scripts.

The companion repository is [infra-for-devs](https://github.com/jgarverick/infra-for-devs). Its history is worth knowing before opening the README: the initial July 12 commit started from an Azure Functions FastAPI sample. On July 13, I moved the project toward an azd and Bicep setup, and the later repository state maps a .NET service to Azure Container Apps. The README still describes the earlier FastAPI sample, so use `azure.yaml`, the `infra/` directory, and `next-steps.md` to understand the later infrastructure. This is a companion project, not a claim that every file shown in the recording matches the repository's final state.

![Conceptual map of the infra-for-devs azd deployment: project configuration and Bicep modules provision Azure Container Apps and shared services](/images/blog/cloud-infrastructure-for-developers/architecture.svg)

*Conceptual map of the resources described by the repository's Bicep modules; this is not a screenshot of a deployed environment.*

## The infrastructure is code

The root `infra/main.bicep` creates a resource group and composes modules for shared services and the application. The modules keep the environment, monitoring, registry, secrets, and app resources in separate files. `azure.yaml` connects that infrastructure to the application by declaring the .NET project and its Container Apps host.

For the documented deployment flow, `azd up` provisions the infrastructure and deploys the application. You can also run `azd provision` and `azd deploy` separately. That split makes the boundary between setting up Azure resources and shipping application code explicit. The repository's `next-steps.md` also describes `azd package` for building locally when you do not have a Dockerfile; azd uses Oryx buildpacks for that path.

## A few details that matter

- The shared monitoring module creates a Log Analytics workspace with 30-day retention and connects Application Insights to it. The Container Apps environment sends its logs to Log Analytics.
- The app module assigns a user-managed identity and grants it the AcrPull role on the container registry. It also configures external ingress and passes secret-backed settings to the container without putting them in the regular environment-variable list.
- The app's scale range is configured from one to ten replicas. That is a useful reminder to check the chosen scaling floor and Azure billing implications before deploying an example as a persistent environment.
- `azd pipeline config` is the documented next step for configuring a deployment pipeline. The repository includes a GitHub Actions workflow, while `next-steps.md` also points to Azure Pipelines as an option.

The point is not that every application should use this exact set of resources. It is that infrastructure decisions become easier to inspect and repeat when they live beside the application. Start with the [repository](https://github.com/jgarverick/infra-for-devs), and keep the README's older FastAPI sample in its proper context. The recording gives the broader session; the Bicep and azd files show one evolving project alongside it.

For current usage and syntax, see the [Azure Developer CLI documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview), [Bicep documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview), and [Azure Container Apps troubleshooting guide](https://learn.microsoft.com/azure/container-apps/troubleshooting). Review [Azure billing guidance](https://learn.microsoft.com/azure/developer/intro/azure-developer-billing) before leaving cloud resources running.