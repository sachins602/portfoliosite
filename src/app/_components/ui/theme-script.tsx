"use client";

export function ThemeScript() {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Theme initialization script must run before React hydration to prevent flash of wrong theme. Content is static and safe.
			dangerouslySetInnerHTML={{
				__html: `
					(function() {
						const theme = localStorage.getItem('theme') || 
							(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
						document.documentElement.classList.toggle('light', theme === 'light');
						document.documentElement.classList.toggle('dark', theme === 'dark');
					})();
				`,
			}}
		/>
	);
}
