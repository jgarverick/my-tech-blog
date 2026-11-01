---
title: "Require is required but it can't find require.d.ts"
description: "I've just released a fairly significant update to the VSTS Extension Project Templates extension. Recently a few of the ALM Rangers noticed that there was a…"
pubDate: "2016-09-10T19:28:00Z"
updatedDate: "2016-09-11T01:59:59.493Z"
bloggerPath: "/2016/09/require-is-required-but-it-cant-find.html"
---
I've just released a fairly significant update to the [VSTS Extension Project Templates extension](https://visualstudiogallery.msdn.microsoft.com/a00f6cfc-4dbb-4b9a-a1b8-4d24bf46770b). Recently a few of the ALM Rangers noticed that there was a problem with a missing TypeScript definition file that seemed to crop up out of nowhere. The file (`require.d.ts`) was not in the template's file system previously as it had not been needed by the underlying VSS SDK definition files (`VSS.d.ts` and `TFS.d.ts`). A recent change, however, has revealed that a new dependency was introduced:

![Build error for the missing require.d.ts dependency](/images/blog/require-is-required-but-it-cant-find/require.d.png)

To remedy this, I added the DefinitelyTyped [d.ts file](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/requirejs/require.d.ts) for RequireJS. Many thanks to [Wouter de Kort](https://t.co/pWFVGhXh4g) and [Utkarsh Shigihalli](https://t.co/3NcU9EnxzI) for reporting this, and to [David Corbin](http://www.dynconcepts.com/) for helping me beta test this fix!

Now, this release wasn't just a hotfix. There were several other enhancements and updates that made it in, thanks to suggestions from my friend [Max Knor](https://channel9.msdn.com/Events/Speakers/Max-Knor):

- Changed PowerShell execution to PowerShell3 in `task.json`
- Included vsts-task-sdk in Build/Release Task template
- Added `Trace-VstsEnteringInvocation` and `Trace-VstsExitingInvocation` to example task PowerShell scripts
- Updated versions for Grunt, Jasmine

For some great contributions to the VSTS extension pool, check out Max's [extensions](https://marketplace.visualstudio.com/search?term=knom&target=VSTS&sortBy=Relevance) on the VS Marketplace:

- [Markdown to HTML build task](https://marketplace.visualstudio.com/items?itemName=knom.markdown-task)
- [RegexReplace build task](https://marketplace.visualstudio.com/items?itemName=knom.regexreplace-task)
- [Office Outlook Add-In build/release task](https://marketplace.visualstudio.com/items?itemName=knom.office-mailapps-task)

## Patching previous versions

If you've run into a roadblock with running or building your existing extension project, the easiest way to get back on track is to create a folder under the typings folder in the project for requirejs, and in that folder place a copy of the `require.d.ts` file:

[https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/requirejs/require.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/requirejs/require.d.ts)
