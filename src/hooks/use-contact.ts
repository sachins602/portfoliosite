"use client";

import { api } from "~/trpc/react";

/**
 * Custom hook for contact form submission
 * Decouples UI from data fetching implementation
 */
export function useContactSubmit() {
	return api.contact.submitContact.useMutation();
}
