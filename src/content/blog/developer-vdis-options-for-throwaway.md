---
title: "Developer VDIs – Options for Throwaway Workstations"
description: "We all know that computing hardware is improving and transforming at a steady and fast pace. This allows us to do things as developers that even three years…"
pubDate: "2014-12-09T04:00:00Z"
updatedDate: "2015-09-27T03:01:24.956Z"
tags: ["Application Development","Automation","Azure","Docker","Linux","VDI","Windows"]
bloggerPath: "/2014/12/developer-vdis-options-for-throwaway.html"
---
We all know that computing hardware is improving and transforming at a steady and fast pace. This allows us to do things as developers that even three years ago were quite frankly impossible. One concept that I’ve run into on more than one occasion is that of the Virtual Desktop Interface (VDI). Typically when talking about VDI, one may think of an enterprise environment where everyone has this apparition in the ether of the company’s hypervisor that is their desktop “computer”. I am not referring to that traditional VDI model. What I’d like to talk about is developer-centric VDIs, configurations that allow developers to push, test, monkey with, and even destroy virtual machines specifically for proof of concept or other development purposes.

I’ve known plenty of developers who prefer to keep their primary machines “clean”, with no additional goodies outside of an MS Office suite installed. They instead rely on virtual machines or VDIs on which they write code, compile, test and even deploy to a dev environment. Within the past two years, a few vendors of interest have shown up, each boasting different capabilities.

**Vagrant.** Vagrant is truly a developer’s VDI engine. It follows a common theme of having images available for download that a dev can then customize if appropriate. Its main dependencies are on Oracle’s VirtualBox and Ruby, so it can be run on almost any platform. There are images out there based on Windows and even OSX, though I wouldn’t trust them simply due to licensing issues. Linux remains the main OS for this particular tool.

**Docker.** While Docker is more often thought of as an application deployment mechanism, one of the more popular use cases for it happens to be in implementing IaaS solutions. This means any Docker images could be used to store basic developer needs, and containers could be spawned to allow a developer to perform work without managing a hypervisor or other related resources. Docker runs natively on Linux, but requires help from VirtualBox on both Windows and Mac OSX. Another reason to take notice came in the form of an announcement concerning Microsoft’s partnership with Docker and plans to include native support for Docker in the next version of Windows Server.

**Nitrous.IO.** This offering is a bit of a different animal, as it’s a free-to-start cloud VM solely for development. The VM provided is a GNU Linux shared instance with either Node, Ruby, Go or Python installed and configured out of the box. You can purchase more resources, but in most cases the supplied defaults are enough to do quick prototyping. Since it’s online, you can push any changes to your distributed SCM system of choice for more concentrated work later. You can quick preview on a couple of externally-facing ports as well, which makes having a PoC demo really easy if you have stakeholders in disparate locations.

**Azure.** Yes, I said it. If you have an MSDN subscription you are able to get guest OS images that include Visual Studio pre-installed. For any company with an enterprise Azure subscription and MSDN subscriptions for developers, this is almost too good to be true. Granted, there are charges for using the VMs, but given the ease of creation/de-allocation and the level of support, it’s truly a great option. Integration with Visual Studio Online, Application Insights and the litany of other Azure features makes this an excellent choice as well.

Of course, one of the best features of any of these options is the ability to roll back or blow away a machine if something gets misconfigured, corrupted or is otherwise bothersome. While you can do that with a physical workstation, it’s often frowned upon, especially in shops that have restrictions around what you can (and can’t) install on company hardware. Sometimes having a disposable environment allows for more experimentation, which could lead to your next big development breakthrough.

Until next time…
