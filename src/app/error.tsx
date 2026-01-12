"use client";

import { useEffect } from "react";

/**
 * Global error boundary for the application
 * Catches runtime errors gracefully and provides a way to reset
 */
// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js requires this component to be named Error
export default function Error({ error: errorProp, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log error to console in development
		if (process.env.NODE_ENV === "development") {
			console.error("Application error:", errorProp);
		}
	}, [errorProp]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-(--bg-primary) px-4">
			<div className="max-w-md rounded-lg border border-(--border) bg-(--bg-secondary) p-8 text-center">
				<h1 className="mb-4 font-bold text-(--text-primary) text-2xl">Something went wrong!</h1>
				<p className="mb-6 text-(--text-secondary)">
					We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
				</p>
				{errorProp.digest && <p className="mb-4 text-(--text-secondary) text-xs">Error ID: {errorProp.digest}</p>}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						className="rounded-lg bg-(--accent) px-6 py-3 font-semibold text-white transition-colors hover:bg-(--accent-hover)"
						onClick={reset}
						type="button"
					>
						Try again
					</button>
					<button
						className="rounded-lg border border-(--border) bg-(--bg-primary) px-6 py-3 font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
						onClick={() => {
							window.location.href = "/";
						}}
						type="button"
					>
						Go home
					</button>
				</div>
			</div>
		</div>
	);
}
