---
name: github-blog-post-extractor
description: "Research a public GitHub repository owned by jgarverick, rhel-yeah, or aria-fx and create a source-backed, backdated post for this Astro blog. Use when turning one of those repos, a recorded talk, a demo, or a public project into a blog entry."
argument-hint: "Repository URL or owner/name; optionally provide a recording link or date to use."
---

# GitHub Blog Post Extractor

Turn one of Josh Garverick's public GitHub projects into a historically grounded post in this blog. Work from public evidence and the current repository's conventions; do not infer personal memories, talk details, or dates.

## When to Use

- The user names a public repository under `jgarverick`, `rhel-yeah`, or `aria-fx` and asks for a blog post.
- The user wants to backdate a post about a repository, demo, presentation, or recorded talk.
- The user asks to find the recording or technical story behind one of those projects.

## Procedure

1. Read the blog's content schema and a small number of comparable posts in `src/content/blog/`. Match their first-person voice, cadence, titles, frontmatter, and image conventions without copying their prose.
2. Resolve the repository from its URL or `owner/name`. If only a repository name is given, search the named owners. If more than one plausible repository remains, ask which one rather than choosing silently.
3. Research the repository using its README, relevant source/configuration, slide decks, releases, and commit history. Identify the problem, intended audience, implementation, and only the details that support the proposed post. Treat source code as evidence, not as prose to copy.
4. Search for a matching presentation, event page, recording, and any earlier post. Prefer the event organizer or recording page, then corroborate its title, speaker, date, and URL. A similar title alone is not enough to claim a video is the recording.
5. Choose `pubDate` from verified evidence. Prefer the actual event date for a recording recap. If the repository predates or postdates the talk, state that distinction and describe it as a later or earlier companion as appropriate. If there is no event date, use a meaningful project milestone from repository history, not the current date or an unrelated maintenance commit. Ask the user when no defensible date can be established.
6. Choose a descriptive post slug and use that exact slug for both `src/content/blog/<slug>.md` and the feature branch `feat/<slug>`. Before editing, inspect `git status --short --branch` and check whether `feat/<slug>` already exists. If the worktree has unrelated uncommitted changes, stop and ask before switching branches; do not stash or move the user's changes automatically. If already on the desired branch, continue. Otherwise create it with `git switch -c "feat/<slug>"`. If that branch already exists, stop and ask whether to reuse it or choose a different slug; never overwrite or delete it. Confirm the current branch before editing.
7. Draft a concise post in `src/content/blog/<slug>.md`. Start with the problem or reason for the work, then explain the project and three to five technical highlights. Make clear whether it is an announcement, recap, or tutorial. Only present sequential instructions as a walkthrough when the source provides enough detail to support them.
8. Link the public repository, verified recording/event page, and relevant primary documentation. Summarize technical material in original wording. Label previews, historical tool versions, platform limitations, and later repository changes with their correct time context.
9. Add a visual when it helps. Prefer a local copy of the official recording thumbnail or a project screenshot. If none exists, create a simple local diagram that accurately represents the documented system; do not fabricate screenshots or imply an illustrative diagram is a captured product screen. Add useful alt text and a short caption.
10. Validate with `npm run build`. Confirm the generated route and that any referenced image is present under `public/images/blog/<slug>/`. Report the post path, date basis, sources, whether a recording was found, and any unresolved facts.

## Guardrails

- Do not claim to have watched a recording unless its content was actually accessible and reviewed. If only the event description is available, attribute highlights to the description or repository.
- Do not invent the user's motivations, audience reactions, lessons learned, or first-person anecdotes. Use neutral first-person framing only when supported by the project context.
- Do not claim a repository was used in a talk when its history shows it was created later. Link it as a later companion instead.
- Keep code excerpts short and only include them when they materially help explain the example.
- If a repository contains credentials, tokens, personal data, or sensitive infrastructure details, do not reproduce them. Flag the issue and use safe placeholders where a code example is necessary.
- Leave unrelated files and existing user changes untouched.
- Do not commit the post or image unless the user explicitly asks for a commit.