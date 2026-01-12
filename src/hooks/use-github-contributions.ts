"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching GitHub contributions
 * Decouples UI from data fetching implementation
 */
export function useGitHubContributions() {
	return api.githubContributions.getContributions.useQuery();
}
