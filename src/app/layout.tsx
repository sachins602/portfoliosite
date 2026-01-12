import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { TRPCReactProvider } from "~/trpc/react";
import { CursorTrail } from "./_components/cursor-trail";
import { KonamiHandler } from "./_components/konami-handler";
import { ScrollProgress } from "./_components/scroll-progress";

export const metadata: Metadata = {
	title: "Sachin Sapkota | Full-Stack Developer",
	description:
		"Full-Stack Developer specializing in Next.js, TypeScript, and Golang. Building scalable web applications from Ontario, Canada.",
	keywords: [
		"Full-Stack Developer",
		"Next.js",
		"TypeScript",
		"Golang",
		"Ontario, Canada",
		"React",
		"Web Development",
		"Software Engineer",
	],
	authors: [{ name: "Sachin Sapkota" }],
	creator: "Sachin Sapkota",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://sachinsapkota.dev",
		title: "Sachin Sapkota | Full-Stack Developer",
		description:
			"Full-Stack Developer specializing in Next.js, TypeScript, and Golang. Building scalable web applications from Ontario, Canada.",
		siteName: "Sachin Sapkota Portfolio",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sachin Sapkota | Full-Stack Developer",
		description: "Full-Stack Developer specializing in Next.js, TypeScript, and Golang.",
	},
	robots: {
		index: true,
		follow: true,
	},
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable} dark`} lang="en" suppressHydrationWarning>
			<head>
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
			</head>
			<body>
				<TRPCReactProvider>
					<KonamiHandler />
					<CursorTrail />
					<ScrollProgress />
					<Suspense fallback={null}>{children}</Suspense>
				</TRPCReactProvider>
				<Analytics />
			</body>
		</html>
	);
}
