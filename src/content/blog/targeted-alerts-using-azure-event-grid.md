---
title: "Targeted Alerts Using Azure Event Grid"
description: "I came across something interesting the other day while trying to refine a governance strategy for Azure at an enterprise level. The specific scenario is…"
pubDate: "2019-01-19T20:35:00.002Z"
tags: ["Azure","pub/sub","Event Hubs","Logic Apps","Event Grid"]
bloggerPath: "/2019/01/targeted-alerts-using-azure-event-grid.html"
---
I came across something interesting the other day while trying to refine a governance strategy for Azure at an enterprise level. The specific scenario is centered around an organization that has a very large Azure estate with many virtual machines as well as a wide swath of platform-as-a-service components. We had seen some upticks in password resets coming from the Azure portal for VMs, and didn't discover this until we decided to go in and audit some activities. When looking through the Activity Log, these types of activities aren't immediately apparent as they display as deployments instead of password reset events. After digging through the event metadata, I was able to locate a common convention for these events—under the authorization section of the event details, the scope value will end with "PasswordReset" and the timestamp it was initiated.

This got me thinking...it would likely be good to capture this and alert operations if anyone is using the Azure portal to reset VM credentials. Typically the account that is reset using the portal will be an administrative non-domain user, and multiple resets may indicate a larger issue. But what is the best way to alert on this activity?

Using Log Analytics is one approach to solve this problem. To start with, you will need to add the Activity Log to the list of data sources for the Log Analytics workspace. Depending on how large the subscription is, and how active people are in that subscription, this can mean a large amount of data. When using a per-gigabyte instance of LA, you may end up seeing a large usage charge related to importing all of this data. Getting the information using a LA query is not terribly difficult:

```kusto
AzureActivity | where Resource contains 'PasswordReset'
```

From there, you can wire up an Azure Alert to fire when this condition is met. Again, this operates on the premise that you have imported all of the Activity Log data into your LA workspace.

Another option, one that I found to be more interesting, is to use Azure Event Grid to listen for specific messages and fire when the intended message is found. To set up an Event Grid subscription, you can use the Azure portal, Azure PowerShell, or Azure CLI. One caveat here is that the ability to use complex filters on event subjects is not supported currently when using PS or CLI. You can use a "starts with" or "ends with" filter, but nothing that captures something akin to "contains". The use case I'm after here looks to use a wildcard operator to find the phrase that pays within the event subject, in this case "PasswordReset". The only way to create this type of filter currently is to use the portal. During creation you can specify the type of action to take when the event subscription picks a winner:

- Web Hook
- Azure Storage Queues
- Event Hub
- Hybrid Connections (Azure Automation)

Before we rush to get the event subscription created, let's take a moment to think through the mechanism that will send the alert. Using a serverless component such as a Logic App or Azure Function could be an easy way to tee up an email to the ops team. For the purposes of this example, using a serverless component will rule out the use of the Hybrid Connection endpoint. While actions can be invoked from Storage Queues, I want to explore using an Event Hub as the recipient of these messages. Both Logic Apps and Functions have triggers for receiving events from Event Hubs, and setting up a new Logic App to handle these events should be fairly straightforward. Why Event Hubs, though? My thought here is that using Event Hubs will allow me to send multiple types of messages to a Hub, and with low retention settings as well as lower per-transaction cost, it seems like something I should at least try out, right?

Let's start by creating the Event Hub namespace, along with a hub. The simplest way to do this is to use the Azure CLI to create the namespace, then the hub.

```bash
az eventhubs namespace create -g rg-shared-services -n governance
az eventhubs eventhub create -g rg-shared-services --namespace-name governance -n auditalerts
```

You can set the message retention here as well using the `--message-retention` flag, as the default setting is 7 days.

Once the namespace and hub are created, we are ready to set up an Event Grid subscription that will push specific events to the hub. In the Azure Portal, go to All Services -> Event Grid Subscriptions. The screen below will display.

![Event Grid Subscriptions page in the Azure portal](/images/blog/targeted-alerts-using-azure-event-grid/eg2.png)

To create a new subscription, click the "Create one" button if you have no subscriptions already, or click the "+ Event Subscription" button in the command bar. The next blade that appears will have basic information. Enter in the information as seen below. Keep in mind that you will need to select Subscription Events from the dropdown for Topic Details, and Event Hubs for the Endpoint Details section. You will be able to specify the `auditalerts` hub once you select the appropriate Event Hub Namespace.

![Create Event Subscription basic settings](/images/blog/targeted-alerts-using-azure-event-grid/eg3.png)

Next, click on the Filters tab. This will allow you to set filters on the event subject in a basic way (starts with / ends with) or in an advanced manner. We are after the advanced filter since we intend to use a wildcard search term. Click on "Add new filter" to add a new advanced filter.

![Filters tab with Add new filter](/images/blog/targeted-alerts-using-azure-event-grid/eg4.png)

In the Key field, type in "subject". For the Operator field, select "String contains" from the drop down. Then, click on the area that says "Add new value" to enter the filter expression.

![Advanced filter with subject key and String contains operator](/images/blog/targeted-alerts-using-azure-event-grid/eg5.png)

In the text box that appears, type in "PasswordReset".

![PasswordReset entered as the filter value](/images/blog/targeted-alerts-using-azure-event-grid/eg6.png)

Click "Create" to create the subscription. This will now send a message to your Event Hub whenever a password reset happens via the portal. To finish the job, you need to create a Logic App that will listen for activity on the hub and send an email when it receives an event. You can create a new Logic App in the Azure Portal directly, or by using Visual Studio with the [Azure Logic App Tools for Visual Studio extension](https://marketplace.visualstudio.com/items?itemName=VinaySinghMSFT.AzureLogicAppsToolsforVisualStudio-18551). Once you have created a new Logic App, search for Event Hubs in the trigger section and add the "When events are available to Event Hub" trigger.

![When events are available to Event Hub trigger in Logic Apps](/images/blog/targeted-alerts-using-azure-event-grid/screen-shot-2019-01-19-at-3.16.37-pm.png)

You can choose the polling interval for whatever you like, and it will default to 5 minutes. For extra granularity, you can add a Parse JSON step and parse the event. To get the schema for an event, copy any activity from the Activity Log and enter that into the popup you receive when clicking on "Generate schema from sample payload" on the expanded JSON task. After this, you can add a task for Office365, Exchange, SendGrid, or any other email provider you wish and add the details from the event to the body of the email. Include any email addresses (individuals or distribution lists) that need to be informed.

To test, use a test VM in the subscription where the Event Grid subscription was set to listen. Reset the password for the VM using the Portal and wait for the email to be sent out. It will not fire immediately, so do not be alarmed if you aren't immediately emailed.

That's all there is to it. You can expand this to include routing to Event Hub consumer groups or even use Event Grid Domains to further expand your reach. Happy eventing!
