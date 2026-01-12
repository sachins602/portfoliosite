"use client";

import { createTimeline, type Timeline } from "animejs";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "~/lib/animations";

/**
 * Hook for coordinated multi-step animations using anime.js timeline
 * Automatically handles lifecycle and memory cleanup
 *
 * @param buildTimeline Callback to define the timeline steps
 * @param deps Dependencies that trigger re-creation of the timeline
 */
export function useAnimationTimeline(buildTimeline: (tl: Timeline) => void, deps: unknown[] = []) {
	const timelineRef = useRef<Timeline | null>(null);

	useEffect(() => {
		// Respect user motion preferences
		if (prefersReducedMotion()) return;

		// Initialize timeline
		const tl = createTimeline({
			autoplay: false,
		});

		// Build the animation steps
		buildTimeline(tl);
		timelineRef.current = tl;

		// Start the sequence
		tl.play();

		// Cleanup on unmount or dep change
		return () => {
			if (timelineRef.current) {
				timelineRef.current.pause();
				timelineRef.current = null;
			}
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: Dynamic dependencies for timeline
	}, deps);

	return timelineRef;
}
