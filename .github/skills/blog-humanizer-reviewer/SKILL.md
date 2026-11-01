---
name: blog-humanizer-reviewer
description: "Humanize and review technical blog drafts for Josh Garverick's first-person voice, consistency with existing posts, factual accuracy, and clear step-by-step examples. Use when editing, reviewing, or polishing a post in src/content/blog/."
argument-hint: "Blog post path; optionally specify whether to focus on voice, technical walkthrough, or both."
---

# Blog Humanizer and Technical Reviewer

Edit and review blog posts so they sound like they belong on this site and so readers can follow the technical material. Preserve the author's meaning and verified facts; improve clarity without manufacturing personality or experience.

## When to Use

- A draft needs a natural, first-person editorial pass.
- A post needs a style-consistency review against existing entries.
- A technical example needs better sequencing, explanation, or validation steps.
- The user asks whether a new post sounds consistent with the blog or is ready to publish.

## Procedure

1. Read the target post and compare it with two or three relevant posts in `src/content/blog/`. Choose examples with a similar purpose, such as a project recap, talk announcement, or technical walkthrough.
2. Preserve the author's conversational first-person voice and the post's purpose. Keep useful personal context when supported; do not add invented anecdotes, reactions, or claims of firsthand testing.
3. Humanize the draft by varying sentence length, removing repeated transitions and generic filler, and preferring concrete nouns and verbs over promotional language. Avoid formulaic openings, inflated claims, excessive headings, and lists that merely restate the paragraphs.
4. Check the technical narrative. For a tutorial, organize it in the order a reader would perform the work: problem and outcome, prerequisites, architecture or setup, numbered steps, code/configuration at the relevant step, expected result, and verification. Include troubleshooting, security, cost, limitations, or cleanup where they materially affect the example.
5. For a talk recap or project announcement, do not force a full tutorial structure. Explain the problem, summarize what was covered, distinguish the recorded presentation from later code changes, and link readers to the complete source or recording.
6. Verify technical claims and dates against the linked repository, official docs, or event page. Check commands for ordering and obvious syntax issues. Never imply that a command, deployment, or code sample was tested unless it was actually run. Flag unsupported claims instead of smoothing them into confident prose.
7. Review code examples for readability and safe publication. Explain non-obvious values, use placeholders for secrets, and ensure snippets have enough surrounding context to be useful. Do not copy large passages from documentation or source files.
8. Check the post against the Astro content schema: title, description, `pubDate`, tags, optional dates, and valid Markdown. Check image paths, descriptive alt text, captions, and links. Keep technical terms and capitalization consistent.
9. When asked to edit or polish, make focused changes directly in the post. Then run `npm run build` and inspect any generated route or image reference that could be broken. When asked for review only, do not silently rewrite the file; report findings first, ordered by severity, with concise locations and concrete fixes.

## Review Checklist

- The opening gives a real reason to keep reading and sounds like the surrounding blog.
- The post has a clear audience and purpose; it does not blur announcement, recap, and tutorial formats.
- Each technical claim is supported by a source, and historical details are clearly dated.
- A reader can follow each example in order and understand what success looks like.
- Commands and code are placed near the explanation that gives them context.
- Important prerequisites, assumptions, security implications, and limitations are not hidden.
- Images are genuine project/session assets or clearly illustrative diagrams, with local paths, useful alt text, and captions.
- There is no generic AI filler, fabricated first-person experience, repeated summary, or unnecessary rewrite of the author's voice.
- Frontmatter and Markdown build successfully.