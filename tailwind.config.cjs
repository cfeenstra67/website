/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			bgPrimary: 'var(--bg-primary)',
			bgSecondary: 'var(--bg-secondary)',
			bgNav: 'var(--bg-nav)',
			textPrimary: 'var(--text-primary)',
			textSecondary: 'var(--text-secondary)',
			textNav: 'var(--text-nav)',
			bgMdImg: 'var(--markdown-image-background)',
			grey: {
				150: 'var(--grey-150)',
				400: 'var(--grey-400)'
			}
		},
	},
	plugins: [],
}
