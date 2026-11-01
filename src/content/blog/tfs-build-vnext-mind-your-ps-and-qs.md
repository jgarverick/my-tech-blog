---
title: "TFS Build vNext: Mind Your P's and Q's"
description: "With the recent movement of the new TFS Team Build (also known as Build.vNext) into public preview, a lot of excitement is building in the ALM community about…"
pubDate: "2015-05-20T02:56:00Z"
updatedDate: "2015-11-28T02:50:14.342Z"
tags: ["Build.vNext","TFS","ALM","DevOps","VSO","Continuous Delivery","Continuous Integration","Visual Studio Online","Visual Studio","ALM Rangers","Cordova"]
bloggerPath: "/2015/05/tfs-build-vnext-mind-your-ps-and-qs.html"
---
With the recent movement of the new TFS Team Build (also known as Build.vNext) into public preview, a lot of excitement is building in the ALM community about the features, ease of use and improved experience that the new build system is bringing. There are blog posts and articles starting to surface about how to [set up agents and builds](http://channel9.msdn.com/Events/Build/2015/3-671), [deploy applications](http://geekswithblogs.net/jakob/archive/2015/04/29/deploying-an-azure-web-site-using-tfs-build-vnext.aspx) to Azure and set up continuous integration and [continuous delivery](http://channel9.msdn.com/Events/Build/2015/3-649) pipelines.

This is not one of those posts.

Instead, I want to focus on one of the behind-the-scenes features that make vNext tick. Specifically, I’m talking about minding your P’s (agent **pools**) and Q’s (agent **queues**). Queues are what process incoming messages (triggers) for build requests, and pools are collections of build agents that are available to process the requests coming in from the queue.

There isn’t any official guidance from Microsoft on how queues and pools should be established. That’s not to say there should be, per se: the queue/pool setup is pretty straightforward and maintains a 1:1 relationship. That being said, it may behoove you to set up separate queues in certain situations. For example, you may want to create queues per application to funnel triggers toward a specific pool of agents for development teams or products. You might also want to split up queues by operating system, in the event you are building apps with cross platform capabilities, and require the native OS components to build them. In my walkthrough “[Building Cross Platform Apps with Apache Cordova and Build.vNext](http://www.inergex.com/wp-content/uploads/2015/05/Cordova-and-Build.vNext-Walkthrough.pdf)”, I decided to use the OS approach to illustrate how multiple queues would work, as well as helping to isolate the OS-specific functions needed to complete the tutorial.

![Agent queues split by operating system](http://www.inergex.com/wp-content/uploads/2015/05/FrankenQueues-300x110.png)

Does that mean you have to do that? Nope. In fact, for a lot of situations you could just stick with the default queue/agent pool setup and allow the build agents to be selected based on the requirements laid out in the Demands section:

![Build definition Demands section](http://www.inergex.com/wp-content/uploads/2015/05/FrankenMacBuild-300x173.png)

The demands listed (such as visualstudio, vstest, and java) will route the build to any agents that are online and able to satisfy those demands. There are other settings that also factor into what agent is selected, but the easiest way to control what build goes where is to set up the demands section to have specific needs that match up with agents you have in your build ecosystem.
