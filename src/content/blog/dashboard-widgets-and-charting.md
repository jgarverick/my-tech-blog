---
title: "Dashboard Widgets and Charting"
description: "Recently I was asked a question by someone in the community around how to properly construct a dashboard widget that contained custom charting/graphing…"
pubDate: "2016-04-29T16:53:00.003Z"
bloggerPath: "/2016/04/dashboard-widgets-and-charting.html"
---
Recently I was asked a question by someone in the community around how to properly construct a dashboard widget that contained custom charting/graphing components. Specifically, the high-level functional requirements centered around:

- Using TypeScript to manage the code versus inline JS in the widget's HTML
- Using a charting library like [Chart.js](http://www.chartjs.org/) or [HighCharts](http://www.highcharts.com/)

The choice was made by the inquiring party to look into using HighCharts. Now as a caveat, please keep in mind that using HighCharts for **personal** use is completely free. If you plan on publishing a widget to the [Marketplace](https://marketplace.visualstudio.com/), however, **you will need to purchase the appropriate license to ensure you are in compliance**. Licensing in general can be a complex topic and is well beyond the scope of this post.

The idea behind this example is to make sure that someone with little experience can adequately use the [VSTS Extension Project Template](https://visualstudiogallery.msdn.microsoft.com/a00f6cfc-4dbb-4b9a-a1b8-4d24bf46770b) to:

- create a new extension
- add a dashboard widget to that project
- add the appropriate libraries, and
- wire up the widget to consume what it needs

Let's start with the basics, after creating a new extension project.

![New extension project in Solution Explorer](/images/blog/dashboard-widgets-and-charting/widget1.png)

Right-click on the project and go to Add -> New Item. We're going to add a new custom dashboard widget.

![Add New Item dialog with the dashboard widget template](/images/blog/dashboard-widgets-and-charting/widget2.png)

Name the widget whatever you like. For the sake of this example, I have named it "SampleChartWidget". The item template will add a generic image and generic HTML file underneath a folder named SampleChartWidget. Let's go ahead and right-click on that new folder and add a new TypeScript file, which we'll call `SampleChartWidget.ts` for the sake of simplicity.

![SampleChartWidget folder with the new TypeScript file](/images/blog/dashboard-widgets-and-charting/widget3.png)

Now that we have the basic skeleton set up, let's update a couple of items that we'll need to make HighCharts work. First stop will be the `package.json` file, where we will need to add a reference to `"highcharts": "^4.2.4"` in order to pull in the latest JS file the next time the project is built. Once that's been saved, the next stop will be the Grunt file. There are two things in here that will need to be altered.

One will be the task that performs the typings initialization (`exec:tsdinit`), which will require running that task after the file has been saved:

![Gruntfile exec:tsdinit task](/images/blog/dashboard-widgets-and-charting/widget4.png)

The other will be the task that copies the needed library file to the scripts folder (`copy:main`):

![Gruntfile copy:main task](/images/blog/dashboard-widgets-and-charting/widget5.png)

As a reminder, the Grunt file is already set up to run the npm update, copy step, and package step anytime you issue a build command in Visual Studio.

Once that editing is complete, build the project to pull in the newly added dependencies. This will pull down the HighCharts library from npm, copy the HighCharts.js file to your scripts folder, and pull down the typings file for HighCharts as well. We still need to make sure they are a part of the project, so don't forget to include them in the project by clicking on "Show all Files":

![Show All Files revealing highcharts.js in the scripts folder](/images/blog/dashboard-widgets-and-charting/widget6.png)

This will show you the newly copied JS file in your scripts directory (above) as well as the typings folder that you will need for constructing the TypeScript file:

![Typings folder with the HighCharts definition file](/images/blog/dashboard-widgets-and-charting/widget7.png)

Now that we have our prerequisites, we can move on to wiring up the chart. Let's first start by adding some meat to our widget's TypeScript file. We will want to add in two reference lines at the top, one to pull in the typings referenced in the `tsd.d.ts` file (consolidated links for the VSS, TFS and RMO typings supplied by the vss-web-extension-sdk) and the other for the typing file we just downloaded for HighCharts. Once that has been added, a class declaration can be added for a very simple widget class, with one method for initializing the chart. Next, we will add a variable to the exports section that will hold a new instance of our SampleChartWidget class, making it ready to be used by the VSS SDK. Finally, we can dump in some simple initialization code to turn a named element into a chart. Sample code is courtesy of the [HighCharts JSFiddle](https://jsfiddle.net/highcharts/LLExL/).

![SampleChartWidget.ts code](/images/blog/dashboard-widgets-and-charting/widget9.png)

Having completed the working bits, we can now move on to setting up the HTML that will display this new chart. We need to wire up the section that registers the widget, allowing for the new TypeScript file to be injected via Require. We also need to include an element in the body that will act as the target for HighCharts to render the chart to. Once that's complete, ensure that the references to `VSS.SDK.js` and `highcharts.js` are properly marked in your HTML file. I've optionally added the rel to a central stylesheet.

![Widget HTML file](/images/blog/dashboard-widgets-and-charting/widget10.png)

A couple of additional caveats to pay attention to...one is the sizing of the widget itself. Some graphs or charts may require a specific amount of screen real estate. Being mindful of how you're rendering the graph is important as you have a maximum of four rows and four columns on any dashboard. I chose to use a 4x3 for this example, but this can be adjusted based on need. Resizing the widget will mean needing to resize the container element as well, so extra care and testing needs to go into that prior to releasing anything into the wild. Another thing to be mindful of is the project's TypeScript build settings. In order to have this solution build and create the right JS, you will need to make sure that the build setting is pointed at AMD.

![TypeScript build settings with the AMD module system](/images/blog/dashboard-widgets-and-charting/widget8.png)

Again, this is an example and is not meant to be taken as anything but an illustrative way to begin hooking up charting and graphics libraries in dashboard widgets. Please be mindful of any licensing and/or component performance concerns while developing. Official documentation from Microsoft in relation to authoring widgets with charts and graphs will be forthcoming, so stay tuned and watch the space.

For those interested, source code can be found [here](https://github.com/jgarverick/sample-chart-widget).
