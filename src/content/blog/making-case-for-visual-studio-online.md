---
title: "Making the Case for Visual Studio Online"
description: "Recently I posed a question to our application development team related to switching from our current on-prem TFS instance to using Visual Studio Online. In…"
pubDate: "2014-11-22T04:02:00Z"
updatedDate: "2015-09-27T03:02:57.227Z"
tags: ["Team Foundation Server","ALM","Azure","Cloud Security","Visual Studio"]
bloggerPath: "/2014/11/making-case-for-visual-studio-online.html"
---
Recently I posed a question to our application development team related to switching from our current on-prem TFS instance to using Visual Studio Online. In making my case for using VSO, I brought up the following points:

- **Feature previews and reduced maintenance.** When new features are available for Team Foundation Service or VSO, they are enabled in the VSO portal at no charge. In addition, patches and upgrades are automatically applied, so your days of hoping that installing that service pack didn’t hose up anything are long gone.
- **Easy to use interface.** The VSO dashboard gives you a nice overview per collection and per project, making it easy to see build metrics, task boards and other collaborative features. Many of the same conventions that you find in the TFS source explorer can be found in a clean web-based interface.
- **Free version.** VSO is free to use for teams of up to five developers. Additional stakeholders (read-only users) can be added at no charge. Any MSDN subscription holders can also be added to VSO at no charge, which may come in handy should you need to keep extra “free” user slots open.
- **Solid SLAs.** The current SLA for VSO is 99.9% uptime.
- **Tie-in to Azure.** VSO is an option that can be linked into your Azure account, which makes it possible to use other services (i.e. Application Insights, VMs) in conjunction with code. These services do cost more.
- **Free build time and load testing.** Even with the free version, you are allowed 60 minutes of build time per account, along with 15,000 virtual user minutes for cloud-based load testing. While the build allowance might keep you from doing CI-type builds (build on each check-in) for high-intensity projects, the load testing feature is definitely adequate for experimenting with an application’s ability to scale and perform under pressure. Ex: If your load test consists of 250 concurrent virtual users, you will be able to run this test for a total of 60 minutes per month.
- **Access anywhere.** This one’s more obvious, but with VSO you can access code from anywhere, where the on-premises TFS usually requires you to be VPN’d into an internal network.

A colleague, rightfully so, brought up concerns around security. After reaching out to some resources in the ALM community, I was presented with some great information to speak to security measures. Some great points to consider include:

- Simply put, VSO is TFS running in Azure. Any security certifications that apply to Azure also apply to VSO.
- Azure currently has ten independent security certifications, including HIPAA, PCI and FERPA. You can read more about those certifications at [http://azure.microsoft.com/en-us/support/trust-center/compliance/](http://azure.microsoft.com/en-us/support/trust-center/compliance/).
- User security can be managed by Azure Active Directory. In addition, your company’s AD entries can be synchronized with Azure AD, making adding and removing access much more streamlined.
- Microsoft currently uses VSO for both Visual Studio and Team Foundation Server products.

I hope you find this information useful in deciding whether VSO might be a fit for your team. Special thanks to [Esteban Garcia](https://mvp.microsoft.com/en-us/mvp/Esteban%20Garcia-4039786), fellow ALM Ranger and ALM MVP, for his help around those security questions!
