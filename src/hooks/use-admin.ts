"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for fetching submission statistics
 * Decouples UI from data fetching implementation
 */
export function useSubmissionStats() {
	return api.admin.getSubmissionStats.useQuery();
}

/**
 * Custom hook for fetching submissions
 * Decouples UI from data fetching implementation
 */
export function useSubmissions() {
	return api.admin.getSubmissions.useQuery();
}

/**
 * Custom hook for marking submission as read
 * Decouples UI from data fetching implementation
 */
export function useMarkAsRead() {
	return api.admin.markAsRead.useMutation();
}

/**
 * Custom hook for deleting submission
 * Decouples UI from data fetching implementation
 */
export function useDeleteSubmission() {
	return api.admin.deleteSubmission.useMutation();
}
