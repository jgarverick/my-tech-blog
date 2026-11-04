---
title: "Application Insights from Flat Files in Kubernetes"
description: "A small .NET sidecar watches mounted log files and forwards trace lines and exceptions to Application Insights for apps that cannot use its SDK directly."
pubDate: "2021-10-04"
tags: ["Azure", "Application Insights", "Kubernetes", ".NET"]
---
Sometimes the application you need to monitor cannot send telemetry directly. It may only write to a log file, or its code may not be a practical place to add the Application Insights SDK. I put together [app-insights-fileparser](https://github.com/jgarverick/app-insights-fileparser) as a small containerized bridge for that situation.

The pattern is straightforward: the application writes to a shared volume, and a sidecar watches those files and sends their contents to Application Insights.

![Architecture diagram showing an application writing logs to a shared volume, a parser sidecar forwarding telemetry to Application Insights, and Kubernetes probes checking the sidecar](/images/blog/app-insights-fileparser/architecture.svg)

_Figure 1 – A file-writing application and telemetry sidecar sharing a volume._

A few details from the implementation:

- **File watching in a background service.** `BackgroundLogWatcher` derives from `BackgroundService` and uses `FileSystemWatcher` to respond to file creation, changes, and deletion in the configured `LOG_PATH`.
- **Per-file progress tracking.** The parser records the last processed line count for each file in `logcounts.json`, then reads and forwards lines beyond that position when a file changes.
- **A simple telemetry mapping.** Each line is sent as an Application Insights trace. Lines containing `ERR` are also reported as exceptions, while unhandled exceptions in the ASP.NET Core service are captured through its Application Insights integration.
- **Kubernetes health checks.** `/health` reports whether the API is running. `/ready` reports on the watched directory and processed-file positions, and can start the watcher if it has not started yet.

The repo includes a Dockerfile and a Kubernetes container example that mounts the same log volume into the application and parser containers. It is a small, deliberately focused example of moving an integration concern out of an application that cannot easily own it.