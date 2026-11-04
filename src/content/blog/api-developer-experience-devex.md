---
title: "API Developer Experience (DevEx)"
description: "A recorded APIs in Action session on making API development easier with GitHub Copilot, Azure API Center, Azure API Management, and OpenAPI."
pubDate: "2024-03-05"
tags: ["Azure", "APIs", "Developer Experience", "GitHub Copilot"]
---
The developer experience for APIs can be difficult for someone just getting started, and new tools and cloud services can add complexity to existing projects. I had the opportunity to talk through some ways to make that experience easier in a recorded episode of Microsoft's [APIs in Action](https://learn.microsoft.com/en-us/shows/apis-in-action/) series: [API Developer Experience (DevEx)](https://learn.microsoft.com/en-us/shows/apis-in-action/api-developer-experience-devex).

[![Official thumbnail for API Developer Experience (DevEx)](/images/blog/api-developer-experience-devex/episode-thumbnail.jpg)](https://learn.microsoft.com/en-us/shows/apis-in-action/api-developer-experience-devex)

_Figure 1 – The API Developer Experience episode on Microsoft Learn._

For the demo, I put together [api-devex-demo](https://github.com/jgarverick/api-devex-demo). The goal was to keep the examples small and use them to explore the tools and workflow around API development. A few of the technical highlights:

- **A repeatable development environment.** A VS Code dev container and pre-commit hooks keep the editor setup and checks close to the code, including formatting, `tflint`, and generated Terraform documentation.
- **Contracts, cataloging, and gateway policies.** The Echo API starts from an OpenAPI definition and uses an Azure API Management policy. The repo also includes a script for importing APIs from API Management into Azure API Center, tying API implementation to discovery and cataloging.
- **More than one API shape.** Alongside the Echo API, the repo has a GraphQL endpoint for Azure Functions and a gRPC service for Azure App Service. They make it easier to compare how different API styles fit into a shared development workflow.
- **Copilot in the API workflow.** The session explores GitHub Copilot alongside Azure API Center, Azure API Management, and OpenAPI extensions, rather than treating API development as only an implementation problem.

At the time, Azure API Center and its GitHub Copilot integration were still in preview. The repository notes that the Copilot integration required Visual Studio Code Insiders and wasn't supported in Codespaces, which is useful context for revisiting the demo today.