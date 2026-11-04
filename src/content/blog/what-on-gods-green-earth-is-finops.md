---
title: "What on God's Green Earth Is FinOps?"
description: "A presentation on FinOps as a team practice for cost awareness, containment, accountability, and data-informed cloud spending decisions."
pubDate: "2023-05-02"
tags: ["Azure", "FinOps", "Cloud"]
---
FinOps is sometimes treated as a synonym for cutting the cloud bill. The point of [FinOps](https://www.finops.org/introduction/what-is-finops/) is broader: engineering, finance, technology, and business teams work from spending data to make better decisions about the value they get from cloud services.

I put together a short presentation, [What on God's Green Earth is FinOps?](https://jgarverick.github.io/what-on-gge-is-finops/), to make that practice a little more concrete. The [source slides](https://github.com/jgarverick/what-on-gge-is-finops/blob/main/slides/Slides.md) start with why organizations look for a FinOps practice: surprise spend, duplicate services, unclear billing, and the need for teams to understand the cost of their choices.

![Diagram showing FinOps collaboration, use cases, and proactive and reactive ways to manage cloud spending](/images/blog/what-on-gge-is-finops/finops-practice.svg)

_Figure 1 – Topics covered in the FinOps presentation._

A few of the practical points:

- **Start with visibility.** Cost awareness helps teams understand where consumption comes from before deciding what to change.
- **Match controls to the use case.** Budgets and alerts, along with utilization profiles, are proactive tools. Automation that disables a service or reports from consumption APIs can support reactive responses.
- **Make accountability actionable.** Cost containment and chargebacks can connect usage to the teams making the decisions, rather than treating spend as an unexplained central bill.
- **Keep guardrails repeatable.** The deck points to Infrastructure as Code options for budgets, including ARM, Bicep, and Terraform.

The goal isn't simply to spend less. It's to give teams enough shared context and practical controls to spend deliberately and connect that spend to business value.