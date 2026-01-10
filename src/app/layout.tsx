import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Sachin Sapkota",
	description: "Sachin's Portfolio",
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
		<html className={`${geist.variable}`} lang="en">
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
