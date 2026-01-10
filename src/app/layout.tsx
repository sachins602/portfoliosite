import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Sachin Sapkota | Full-Stack Developer",
	description:
		"Full-Stack Developer specializing in Next.js, .NET, and TypeScript. Building scalable web applications from Brampton, Ontario, Canada.",
	keywords: [
		"Full-Stack Developer",
		"Next.js",
		".NET",
		"TypeScript",
		"Brampton Ontario",
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
			"Full-Stack Developer specializing in Next.js, .NET, and TypeScript. Building scalable web applications from Brampton, Ontario, Canada.",
		siteName: "Sachin Sapkota Portfolio",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sachin Sapkota | Full-Stack Developer",
		description:
			"Full-Stack Developer specializing in Next.js, .NET, and TypeScript.",
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

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable} dark`} lang="en" suppressHydrationWarning>
			<head>
				<script
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
					<Suspense fallback={null}>
						{children}
					</Suspense>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
