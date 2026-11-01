#!/usr/bin/env node
/**
 * blogger-to-astro: converts a Blogger export into Markdown files for an
 * Astro content collection.
 *
 * Supports both export formats:
 *   - Classic: Blogger > Settings > Back up content (blog-MM-DD-YYYY.xml)
 *   - Takeout: Google Takeout > Blogger (feed.atom)
 *
 * Usage:
 *   node blogger-to-astro.mjs <export.xml|feed.atom> [options]
 *
 * Options:
 *   --out <dir>            Markdown output folder (default: src/content/blog)
 *   --route-prefix <path>  URL prefix for posts on the new site (default: /blog)
 *   --download-images      Download Blogger-hosted images and rewrite their URLs
 *   --images-dir <dir>     Where downloaded images go (default: public/images/blog)
 *   --images-url <path>    Public URL for that folder (default: /images/blog)
 *   --include-drafts       Also convert drafts (written with draft: true)
 *   --redirects-dir <dir>  Where redirect files go (default: .)
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: 'string', default: 'src/content/blog' },
    'route-prefix': { type: 'string', default: '/blog' },
    'download-images': { type: 'boolean', default: false },
    'images-dir': { type: 'string', default: 'public/images/blog' },
    'images-url': { type: 'string', default: '/images/blog' },
    'include-drafts': { type: 'boolean', default: false },
    'redirects-dir': { type: 'string', default: '.' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (opts.help || positionals.length !== 1) {
  console.log('Usage: node blogger-to-astro.mjs <export.xml|feed.atom> [--out dir] [--download-images] [--include-drafts]');
  process.exit(opts.help ? 0 : 1);
}

const KIND_SCHEME = 'http://schemas.google.com/g/2005#kind';
const KIND_POST = 'http://schemas.google.com/blogger/2008/kind#post';
const TAG_SCHEME = 'http://www.blogger.com/atom/ns#';
const BLOGGER_IMAGE_HOST = /(^|\.)bp\.blogspot\.com$|^blogger\.googleusercontent\.com$|^lh\d\.googleusercontent\.com$/;

// ---------- Parsing ----------

const text = (v) => (v == null ? '' : typeof v === 'object' ? String(v['#text'] ?? '') : String(v));
const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

function parseExport(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => ['entry', 'category', 'link'].includes(name),
    // Keep large post bodies intact.
    processEntities: true,
    htmlEntities: true,
    trimValues: false,
  });
  const doc = parser.parse(xml);
  const entries = asArray(doc?.feed?.entry);
  if (!entries.length) throw new Error('No <entry> elements found. Is this a Blogger export?');

  const isTakeout = entries.some((e) => e['blogger:type'] != null);
  return entries.map((e) => (isTakeout ? fromTakeout(e) : fromClassic(e))).filter(Boolean);
}

function fromClassic(e) {
  const cats = asArray(e.category);
  const isPost = cats.some((c) => c['@_scheme'] === KIND_SCHEME && c['@_term'] === KIND_POST);
  if (!isPost) return null; // settings, template, pages, comments
  const alt = asArray(e.link).find((l) => l['@_rel'] === 'alternate');
  const draft = text(e['app:control']?.['app:draft']).trim() === 'yes';
  return {
    title: text(e.title).trim(),
    html: text(e.content),
    published: text(e.published),
    updated: text(e.updated),
    tags: cats.filter((c) => c['@_scheme'] === TAG_SCHEME).map((c) => c['@_term']),
    oldPath: alt ? new URL(alt['@_href']).pathname : null,
    draft,
  };
}

function fromTakeout(e) {
  if (text(e['blogger:type']).trim() !== 'POST') return null;
  const status = text(e['blogger:status']).trim();
  if (status === 'SOFT_TRASHED' || status === 'DELETED') return null;
  return {
    title: text(e.title).trim(),
    html: text(e.content),
    published: text(e.published),
    updated: text(e.updated),
    tags: asArray(e.category).map((c) => c['@_term']).filter(Boolean),
    oldPath: text(e['blogger:filename']).trim() || null,
    draft: status !== 'LIVE',
  };
}

// ---------- HTML cleanup ----------

function stripTags(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function makeDescription(html, max = 160) {
  const prose = html.replace(/<(pre|table|h[1-6]|figcaption)\b[\s\S]*?<\/\1>/gi, ' ');
  const plain = stripTags(prose).replace(/\s+([.,;:!?)])/g, '$1');
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : max).trim() + '…';
}

/** Blogger code blocks often use <br> inside <pre>; turn those into real newlines. */
function normalizePre(html) {
  return html.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, (block) => block.replace(/<br\s*\/?>/gi, '\n'));
}

/** Request the full-size original instead of Blogger's resized thumbnail. */
function fullSizeImageUrl(src) {
  try {
    const u = new URL(src, 'https://example.invalid');
    if (!BLOGGER_IMAGE_HOST.test(u.hostname)) return src;
    if (u.hostname.endsWith('bp.blogspot.com') || u.pathname.includes('/img/')) {
      u.pathname = u.pathname.replace(/\/(s|w)\d+[^/]*\//, '/s1600/');
    }
    u.pathname = u.pathname.replace(/=(s|w)\d+[^/]*$/, '=s0');
    return u.toString();
  } catch {
    return src;
  }
}

const isBloggerImage = (src) => {
  try {
    return BLOGGER_IMAGE_HOST.test(new URL(src).hostname);
  } catch {
    return false;
  }
};

// ---------- Markdown conversion ----------

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);
turndown.remove(['script', 'style']);
turndown.keep(['iframe', 'video', 'audio']); // Embeds stay as raw HTML so you can find and replace them.

// Code blocks: detect the language from SyntaxHighlighter ("brush: js") or Prism ("language-js") classes.
turndown.addRule('preCode', {
  filter: (node) => node.nodeName === 'PRE',
  replacement: (_content, node) => {
    const codeEl = node.querySelector('code');
    const classes = `${node.getAttribute('class') || ''} ${codeEl?.getAttribute('class') || ''}`;
    const lang = (classes.match(/brush:\s*([\w+#-]+)/i) || classes.match(/(?:language|lang)-([\w+#-]+)/i) || [])[1] || '';
    const code = (codeEl || node).textContent.replace(/\n+$/, '');
    const fence = code.includes('```') ? '~~~~' : '```';
    return `\n\n${fence}${lang.toLowerCase()}\n${code}\n${fence}\n\n`;
  },
});

// Tighter list markers ("- item" instead of Turndown's "-   item").
turndown.addRule('listItem', {
  filter: 'li',
  replacement: (content, node, options) => {
    const parent = node.parentNode;
    let prefix = `${options.bulletListMarker} `;
    if (parent.nodeName === 'OL') {
      const start = Number(parent.getAttribute('start') || 1);
      prefix = `${start + Array.prototype.indexOf.call(parent.children, node)}. `;
    }
    const indent = ' '.repeat(prefix.length);
    const body = content.replace(/^\n+/, '').replace(/\n+$/, '\n').replace(/\n(?!$)/g, `\n${indent}`);
    return prefix + body + (node.nextSibling && !/\n$/.test(body) ? '\n' : '');
  },
});

// Blogger wraps every image in a link to the full-size version. Keep just the image.
turndown.addRule('unwrapImageLinks', {
  filter: (node) =>
    node.nodeName === 'A' &&
    node.children.length === 1 &&
    node.children[0].nodeName === 'IMG' &&
    node.textContent.trim() === '',
  replacement: (_content, node) => {
    const img = node.children[0];
    const alt = (img.getAttribute('alt') || '').replace(/[[\]]/g, '');
    return `![${alt}](${img.getAttribute('src')})`;
  },
});

// Drop the empty "separator" divs Blogger adds around images.
turndown.addRule('separator', {
  filter: (node) => node.nodeName === 'DIV' && /separator/.test(node.getAttribute('class') || ''),
  replacement: (content) => `\n\n${content.trim()}\n\n`,
});

// ---------- Images ----------

const downloaded = new Map(); // remote URL -> local public URL

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function localizeImages(html, slug) {
  const srcs = new Set([...html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]));
  let out = html;
  for (const src of srcs) {
    if (!isBloggerImage(src)) continue;
    const full = fullSizeImageUrl(src);
    let local = downloaded.get(full);
    if (!local && opts['download-images']) {
      local = await downloadImage(full, slug);
      if (local) downloaded.set(full, local);
    }
    out = out.split(src).join(local || full);
  }
  return out;
}

async function downloadImage(url, slug) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    let name = decodeURIComponent(path.basename(new URL(url).pathname)).replace(/=s0$/, '');
    name = name.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'image';
    if (!path.extname(name)) name += '.' + (type.split('/')[1]?.split(';')[0].replace('jpeg', 'jpg') || 'jpg');
    const dir = path.join(opts['images-dir'], slug);
    await mkdir(dir, { recursive: true });
    let file = path.join(dir, name);
    for (let i = 2; await exists(file); i++) {
      file = path.join(dir, name.replace(/(\.\w+)$/, `-${i}$1`));
    }
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    return `${opts['images-url'].replace(/\/$/, '')}/${slug}/${path.basename(file)}`;
  } catch (err) {
    console.warn(`  ! Couldn't download ${url}: ${err.message}`);
    return null;
  }
}

// ---------- Output ----------

function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function slugFor(post, used) {
  // Prefer the original Blogger URL slug so links stay recognizable.
  const fromPath = post.oldPath ? path.basename(post.oldPath, '.html') : '';
  let slug = slugify(fromPath) || slugify(post.title) || `post-${post.published.slice(0, 10)}`;
  if (used.has(slug)) slug = `${post.published.slice(0, 7)}-${slug}`;
  for (let i = 2; used.has(slug); i++) slug = `${slug}-${i}`;
  used.add(slug);
  return slug;
}

const yaml = (v) => JSON.stringify(v); // JSON strings and arrays are valid YAML.

function frontmatter(post, description) {
  const lines = [
    '---',
    `title: ${yaml(post.title || 'Untitled')}`,
    `description: ${yaml(description)}`,
    `pubDate: ${yaml(post.published)}`,
  ];
  if (post.updated && post.updated.slice(0, 10) !== post.published.slice(0, 10)) {
    lines.push(`updatedDate: ${yaml(post.updated)}`);
  }
  if (post.tags.length) lines.push(`tags: ${yaml([...new Set(post.tags)])}`);
  if (post.draft) lines.push('draft: true');
  if (post.oldPath) lines.push(`bloggerPath: ${yaml(post.oldPath)}`);
  lines.push('---', '');
  return lines.join('\n');
}

async function main() {
  const xml = await readFile(positionals[0], 'utf8');
  const posts = parseExport(xml).filter((p) => opts['include-drafts'] || !p.draft);
  posts.sort((a, b) => a.published.localeCompare(b.published));

  await mkdir(opts.out, { recursive: true });
  const used = new Set();
  const redirects = {};
  const prefix = opts['route-prefix'].replace(/\/$/, '');

  for (const post of posts) {
    const slug = slugFor(post, used);
    let html = normalizePre(post.html);
    html = await localizeImages(html, slug);
    const body = turndown.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
    const md = frontmatter(post, makeDescription(post.html)) + body + '\n';
    await writeFile(path.join(opts.out, `${slug}.md`), md);
    if (post.oldPath && !post.draft) redirects[post.oldPath] = `${prefix}/${slug}/`;
    console.log(`  ${post.draft ? 'draft' : 'post '}  ${slug}`);
  }

  // Redirect maps: one for Astro's `redirects` option, one for Azure Static Web Apps.
  await mkdir(opts['redirects-dir'], { recursive: true });
  await writeFile(path.join(opts['redirects-dir'], 'redirects.json'), JSON.stringify(redirects, null, 2) + '\n');
  const swa = {
    routes: [
      ...Object.entries(redirects).map(([route, redirect]) => ({ route, redirect, statusCode: 301 })),
      { route: '/feeds/posts/default', redirect: '/rss.xml', statusCode: 301 },
      { route: '/search/label/*', redirect: `${prefix}/`, statusCode: 301 },
    ],
  };
  await writeFile(path.join(opts['redirects-dir'], 'staticwebapp.routes.json'), JSON.stringify(swa, null, 2) + '\n');

  const drafts = posts.filter((p) => p.draft).length;
  console.log(`\nConverted ${posts.length} posts (${drafts} drafts) into ${opts.out}`);
  console.log(`Wrote ${Object.keys(redirects).length} redirects to redirects.json and staticwebapp.routes.json`);
  if (!opts['download-images'] && [...posts].some((p) => /blogspot|googleusercontent/.test(p.html))) {
    console.log('Images still point at Blogger. Run again with --download-images to copy them locally.');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
