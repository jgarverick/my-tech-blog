---
title: "VSTS Extensions - Requirements Integrator"
description: "In his presentation at Microsoft's Connect(); event, Brian Harry revealed the new VS Marketplace, where a wide variety of VSTS (the ALM tool formerly known as…"
pubDate: "2015-11-19T01:55:00Z"
updatedDate: "2015-11-27T03:06:17.729Z"
tags: ["Traceability","ALM","Integration","VSTS","Extensions","Requirements"]
bloggerPath: "/2015/11/vsts-extensions-requirements-integrator.html"
---
In his [presentation](https://channel9.msdn.com/Events/Visual-Studio/Connect-event-2015/011) at Microsoft's Connect(); event, Brian Harry revealed the new [VS Marketplace](https://marketplace.visualstudio.com/#VSTS), where a wide variety of VSTS (the ALM tool formerly known as VSO) extensions are available for download. I was fortunate enough to participate in dogfooding the extensibility model for VSTS, and my extension is now available on the Marketplace.

The [Requirements Integrator](https://marketplace.visualstudio.com/items/jgarverick.RequirementsIntegrator) extension is meant to bridge the gap between external requirements management systems and VSTS for Agile and Scrum projects. Since CMMI already has the notion of requirements, I didn't see the inherent value in allowing my extension to import requirements into that type of project. Having worked with external systems that manage business requirements as well as systems that manage the SDLC process, I could see where a tool that enabled traceability between requirements and Epics, Features, PBIs and Tasks might come in handy.

For now, import functionality is limited to MS Excel. The plan is to expand that to encompass products like HP ALM, Sparx Enterprise Architect, and others. Please feel free to visit the main page for the extension's repo on [GitHub](https://github.com/jgarverick/RequirementsIntegrator) to see roadmap items, log issues, or create pull requests of your own. Candid feedback is always welcome!
