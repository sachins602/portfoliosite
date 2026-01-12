"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching GitHub activity feed
 * Decouples UI from data fetching implementation
 */
export function useGitHubActivity() {
	return api.githubActivity.getActivity.useQuery();
}
