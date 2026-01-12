"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching projects
 * Decouples UI from data fetching implementation
 */
export function useProjects() {
	return api.projects.getProjects.useQuery();
}
