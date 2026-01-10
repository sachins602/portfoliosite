"use client";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useMemo } from "react";
import SuperJSON from "superjson";

import type { AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
	}
	// Browser: use singleton pattern to keep the same query client
	clientQueryClientSingleton ??= createQueryClient();

	return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Get the base URL for the tRPC client
 * Uses NEXT_PUBLIC_* env vars (safe for client components) or falls back to vendor detection
 */
function getBaseUrl(): string {
	// On client side, use window.location.origin (always available)
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	// On server side during SSR, use NEXT_PUBLIC_ env vars (available at build time)
	// These are safe to access because they're embedded at build time
	const publicUrl = process.env.NEXT_PUBLIC_APP_URL ?? getVendorBaseUrl();

	if (publicUrl) {
		return publicUrl;
	}

	// Fallback for SSR (relative URL will work)
	return "";
}

/**
 * Auto detection for common hosting providers using NEXT_PUBLIC_ env vars
 * These are safe because NEXT_PUBLIC_ vars are embedded at build time and can be accessed
 * in client components without triggering Cache Components errors
 */
function getVendorBaseUrl(): string | undefined {
	// Use NEXT_PUBLIC_ prefixed env vars (safe for client components)
	// These are available at build time and embedded in the bundle
	const publicVercel = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined;
	const publicNetlify = process.env.NEXT_PUBLIC_NETLIFY_URL;
	const publicRender = process.env.NEXT_PUBLIC_RENDER_URL;
	const publicRailway = process.env.NEXT_PUBLIC_RAILWAY_URL
		? `https://${process.env.NEXT_PUBLIC_RAILWAY_URL}`
		: undefined;

	return publicVercel ?? publicNetlify ?? publicRender ?? publicRailway;
}

let trpcClientSingleton: ReturnType<typeof api.createClient> | undefined;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	// Use useMemo with empty deps for stable singleton pattern
	// This ensures the client is only created once per component instance
	const trpcClient = useMemo(() => {
		// Return singleton if it exists (for client-side)
		if (typeof window !== "undefined" && trpcClientSingleton) {
			return trpcClientSingleton;
		}

		const baseUrl = getBaseUrl();
		const url = baseUrl ? `${baseUrl}/api/trpc` : "/api/trpc";

		// Detect dev mode safely (using window.location on client, or NEXT_PUBLIC_NODE_ENV)
		const isDev =
			typeof window !== "undefined"
				? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
				: process.env.NEXT_PUBLIC_NODE_ENV === "development";

		const client = api.createClient({
			links: [
				loggerLink({
					enabled: (op) => isDev || (op.direction === "down" && op.result instanceof Error),
				}),
				httpBatchStreamLink({
					transformer: SuperJSON,
					url,
					headers: () => {
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						return headers;
					},
				}),
			],
		});

		// Store singleton on client side
		if (typeof window !== "undefined") {
			trpcClientSingleton = client;
		}

		return client;
	}, []); // Empty deps array ensures stable reference

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}
