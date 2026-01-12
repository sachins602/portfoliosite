"use client";

import { AlertCircle } from "lucide-react";

/**
 * Error boundary component for GitHub Stats
 * Prevents one API failure from crashing the entire page
 */
export default function GitHubStatsError({ reset }: { reset: () => void }) {
	return (
		<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
			<div className="flex flex-col items-center gap-4 text-center">
				<AlertCircle className="h-12 w-12 text-(--text-secondary)" />
				<div>
					<h3 className="mb-2 font-semibold text-(--text-primary) text-lg">Failed to load GitHub stats</h3>
					<p className="mb-4 text-(--text-secondary) text-sm">
						Unable to fetch GitHub statistics. This might be due to rate limiting or network issues.
					</p>
					<button
						className="rounded-lg border border-(--accent) bg-(--accent)/10 px-4 py-2 font-semibold text-(--accent) transition-colors hover:bg-(--accent)/20"
						onClick={reset}
						type="button"
					>
						Retry
					</button>
				</div>
			</div>
		</div>
	);
}
