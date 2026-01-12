"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching GitHub user statistics
 * Decouples UI from data fetching implementation
 */
export function useGitHubStats() {
	return api.githubStats.getUserStats.useQuery();
}
