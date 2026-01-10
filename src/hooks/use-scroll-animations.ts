"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "~/lib/animations";

/**
 * Global scroll animation coordinator
 * Sets up Intersection Observer for all animated sections
 */
export function useScrollAnimations() {
	useEffect(() => {
		if (prefersReducedMotion()) return;

		// All sections with scroll-triggered animations are handled
		// by individual useScrollTrigger hooks in their components
		// This hook is for any global scroll coordination if needed

		return () => {
			// Cleanup if needed
		};
	}, []);
}
