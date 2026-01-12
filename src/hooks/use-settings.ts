"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching availability status
 * Decouples UI from data fetching implementation
 */
export function useAvailabilityStatus() {
	return api.settings.getAvailabilityStatus.useQuery();
}

/**
 * Custom hook for updating availability status
 * Decouples UI from data fetching implementation
 */
export function useUpdateAvailabilityStatus() {
	return api.settings.updateAvailabilityStatus.useMutation();
}
