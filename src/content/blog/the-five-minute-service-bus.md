---
title: "The Five Minute Service Bus"
description: "In our last quarterly meetup, I presented this notion of being able to create a service bus architecture in about five minutes. “Inconceivable!” some might…"
pubDate: "2014-11-07T03:48:00Z"
updatedDate: "2016-04-18T23:17:36.701Z"
tags: ["Azure","Git","Open Source","Cloud Services","Service Bus"]
bloggerPath: "/2014/11/the-five-minute-service-bus.html"
---
In our last quarterly meetup, I presented this notion of being able to create a service bus architecture in about five minutes. “Inconceivable!” some might say. Others may not, depending on how brazenly they wish to infringe on copyrighted material. In any event, it can be done, and here’s how.

First of all, you need a plan. My concept was very simple: I wanted to have some sort of front-facing API, likely productized, that would communicate with a service bus in the cloud using message queues. There would need to be some sort of dispatcher in the cloud, equipped to move messages to the appropriate places. This needed to include error handling and basic logging. Finally, as part of the error handling process, I wanted to send an email to an applicable party regarding the error. My dreadfully simplistic design looked like this:

![The “big idea” design diagram](/images/blog/the-five-minute-service-bus/fmsb1.png)

_Figure 1 – The “big idea”._

An alternative idea to using an SMTP service to convey error messages could also be setting up topics within the service bus, and writing new messages to those topics so that subscribing applications could consume them. I chose to use only the SMTP service for the sake of simplicity.

Following are the steps you can follow to create the prototype that corresponds to this design. This assumes that you have a valid Azure account, whether it be a free trial, pay-as-you-go, or enterprise subscription. You also need to have the Azure SDK installed in order to gain access to the appropriate project templates.

1. Create a new Service Bus namespace. This can be done directly in the Azure management dashboard or in Visual Studio directly through the Server Explorer. If connecting through Visual Studio, you will be presented with the following dialog.

   ![Add Service Bus Connection dialog](/images/blog/the-five-minute-service-bus/fmsb2.png)

   _Figure 2 – Add Service Bus Connection_

   Filling out the requested information will create a new service bus namespace for you in Azure. You could opt to create a Service Bus for Windows Server connection also, though for this example we will solely be leveraging Azure.

2. Create the queues needed. You can do this directly in the Azure management dashboard as well, but for simplicity’s sake, you can also do this from the Server Explorer window by connecting to the service bus namespace, selecting Queues, and right-clicking to select Create New Queue.

   ![Add New Message Queue dialog](/images/blog/the-five-minute-service-bus/fmsb3.png)

   _Figure 3 – Add New Message Queue_

3. In Visual Studio, create a new Cloud Service application.

   ![Creating the Cloud Service project](/images/blog/the-five-minute-service-bus/fmsb4.png)

   _Figure 4 – Creating the Cloud Service_

4. During creation choose the option for a service listening to a message queue. Click on the pencil to edit the service name. This will create a new Worker project that corresponds to the role you created.

   ![Adding a Worker Role with Service Bus Queue](/images/blog/the-five-minute-service-bus/fmsb5.png)

   _Figure 5 – Adding a Worker Role with Service Bus Queue_

5. Right-click the Cloud Service project, and add a new role.

   ![Add a new Worker Role project](/images/blog/the-five-minute-service-bus/fmsb6.png)

   _Figure 6 – Add a new Worker Role Project_

6. Repeat step 5 for the logging role and the error-handling role as well.

7. Add appropriate code into the actions for the dispatcher, logger and error handler. The code related to the dispatcher is shown in Figure 7.

   ![Dispatcher code](/images/blog/the-five-minute-service-bus/fmsb7.png)

   _Figure 7 – Dispatcher Code_

   For the error handling code, please see Figure 8, as it uses the System.Net.Smtp.SmtpServer class to create a relay point using Google Mail.

   ![Error handling code](/images/blog/the-five-minute-service-bus/fmsb8.png)

   _Figure 8 – Error Handling Code_

8. Using the [Messaging With Queues](https://code.msdn.microsoft.com/windowsazure/Getting-Started-Brokered-aa7a0ac3) sample code as a base, create a simple console application that will write messages to the dispatch queue.

9. Run the console application and monitor the results.

Again, this is an oversimplified example, but it is functional and able to scale should you see fit. To play around with different options, feel free to [download the code](https://github.com/inergex/meetups/tree/master/2014Q3/FiveMinuteServiceBus) from our GitHub repo.
