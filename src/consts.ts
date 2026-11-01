// Site-wide settings. Import these anywhere with `import { ... } from '../consts'`.

export const SITE_TITLE = 'Josh Garverick';
export const SITE_DESCRIPTION =
	'Notes on Azure, platform engineering, and agentic AI from a Chief Technical Architect at Xebia.';
export const AUTHOR = 'Josh Garverick';

// Shown in the header and footer. Remove any you don't want, or add more.
export const SOCIAL_LINKS: { label: string; href: string }[] = [
	{ label: 'GitHub', href: 'https://github.com/jgarverick' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/josh-garverick/' },
	{ label: 'Speaking', href: 'https://sessionize.com/josh-garverick/' },
];

// Number of posts shown on the home page.
export const RECENT_POST_COUNT = 5;
