# Josh Garverick's blog

This repo is a static blog built with [Astro](https://astro.build/) and hosted on the Azure Static Web Apps Free plan. Posts are Markdown files in `src/content/blog/`. Every push to `main` builds and deploys the site, and every pull request gets its own preview URL.

## Project layout

| Path | What it's for |
| --- | --- |
| `src/content/blog/` | Posts, one Markdown or MDX file each. The file name is the URL slug. |
| `src/content.config.ts` | Frontmatter schema for posts. |
| `src/consts.ts` | Site title, description, and social links. |
| `src/styles/global.css` | Site styles. Change `--accent` to retheme. |
| `src/lib/posts.ts` | Helpers that sort posts, filter drafts, and group tags. |
| `public/staticwebapp.config.json` | Azure Static Web Apps settings: redirects, headers, and the 404 page. |
| `scripts/blogger-to-astro.mjs` | One-time converter for the Blogspot export. |
| `infra/main.bicep` | The Static Web App resource. |
| `.github/workflows/deploy.yml` | Build and deploy pipeline. |

## Run the site locally

1. Install the dependencies:

   ```bash
   npm install
   ```

1. Start the dev server:

   ```bash
   npm run dev
   ```

   The site runs at `http://localhost:4321`. Drafts show up in dev, marked as drafts, and are left out of production builds.

1. To check a production build, run the following:

   ```bash
   npm run build
   npm run preview
   ```

## Import the Blogspot posts

1. Delete the placeholder post, `src/content/blog/hello-astro.md`, or keep it as your first post on the new site.

1. Run the converter against your export. Pass `--swa-config` so the redirects go straight into the Azure config:

   ```bash
   npm run convert -- ~/Downloads/blog-export.xml \
     --download-images \
     --swa-config public/staticwebapp.config.json \
     --redirects-dir scripts/output
   ```

   This writes the posts to `src/content/blog/`, the images to `public/images/blog/`, and a 301 redirect for every old post URL into `public/staticwebapp.config.json`. The merge keeps the other settings in that file.

1. Run `npm run dev` and look through the imported posts. Check posts that had embedded Gists or heavy inline styling, because the converter can't carry those over.

To also import drafts, add `--include-drafts`. Run `node scripts/blogger-to-astro.mjs --help` for every option.

## Deploy to Azure

### Create the Static Web App

1. Create a resource group and deploy the Bicep template:

   ```bash
   az group create --name rg-blog --location eastus2
   az deployment group create \
     --resource-group rg-blog \
     --template-file infra/main.bicep \
     --parameters name=swa-josh-blog
   ```

1. Get the deployment token and store it as a GitHub secret:

   ```bash
   az staticwebapp secrets list --name swa-josh-blog --query properties.apiKey -o tsv \
     | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN
   ```

1. Set the site URL as a repository variable. Astro uses it for canonical links, the sitemap, and the RSS feed:

   ```bash
   gh variable set SITE_URL --body "https://YOUR-DOMAIN"
   ```

   Until you have a custom domain, use the default hostname from the deployment output, such as `https://<name>.azurestaticapps.net`.

1. Push to `main`. The **Build and deploy** workflow builds the site and uploads `dist/`.

### Add a custom domain

1. At your DNS provider, create a CNAME record that points your domain (for example, `blog.example.com`) at the Static Web App's default hostname.

1. Redeploy the template with the domain:

   ```bash
   az deployment group create \
     --resource-group rg-blog \
     --template-file infra/main.bicep \
     --parameters name=swa-josh-blog customDomain=blog.example.com
   ```

   Azure validates the CNAME and issues a free TLS certificate. The Free plan allows two custom domains per app.

1. Update the `SITE_URL` variable to the new domain.

### Keep your old Blogspot links working

Blogspot doesn't allow server-side redirects to another domain, so the redirects in `staticwebapp.config.json` only take effect for URLs that reach the new site. You have two ways to make that happen:

- **If the blog already uses a custom domain**, point that domain at the Static Web App. Old links like `/2019/05/my-post.html` then redirect to the new URLs automatically.
- **If the blog uses a `*.blogspot.com` address**, leave the old blog up and add a notice that links to the new site. After the new site is live, you can also stop search engines from indexing the old copy. In Blogger, go to **Settings** > **Crawlers and indexing**, turn on **Enable custom robots header tags**, and set `noindex` for the home page and for archive and post pages.

## Write a new post

Create a Markdown file in `src/content/blog/`. The file name becomes the URL, so `my-new-post.md` is served at `/blog/my-new-post/`.

```markdown
---
title: "My new post"
description: "One sentence for search results and the RSS feed."
pubDate: "2026-11-15"
tags: ["Azure", "AI"]
draft: true
---

Post content goes here.
```

Remove `draft: true` when you're ready to publish. To use components in a post, name the file with an `.mdx` extension.

## Customize the site

- **Title, description, and links**: edit `src/consts.ts`. Replace the placeholder GitHub and LinkedIn handles.
- **Colors**: change `--accent` and the other variables at the top of `src/styles/global.css`. The site follows the reader's light or dark preference.
- **About page**: edit `src/pages/about.astro`.
- **Code highlighting themes**: change `markdown.shikiConfig.themes` in `astro.config.mjs`.
