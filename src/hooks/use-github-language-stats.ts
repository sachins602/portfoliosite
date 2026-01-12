"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching GitHub language statistics
 * Decouples UI from data fetching implementation
 */
export function useGitHubLanguageStats() {
	return api.githubStats.getLanguageStats.useQuery();
}
