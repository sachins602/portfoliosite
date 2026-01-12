"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching build statistics
 * Decouples UI from data fetching implementation
 */
export function useBuildStats() {
	return api.buildStats.getBuildStats.useQuery();
}
