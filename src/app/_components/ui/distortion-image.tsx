"use client";

import { type ReactNode, useId, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { DistortionFilter } from "./distortion-filter";

interface DistortionImageProps {
	children: ReactNode;
	intensity?: number; // Max distortion scale (default: 30)
	className?: string;
}

/**
 * A wrapper component that applies a liquid distortion effect on hover.
 * Uses pure SVG Filters and Anime.js for smooth animations.
 * The effect peaks on entry and then slowly reversed to zero.
 */
export function DistortionImage({ children, intensity = 20, className }: DistortionImageProps) {
	const filterId = useId().replace(/:/g, ""); // Remove colons to make it a valid ID
	const containerRef = useRef<HTMLElement>(null);
	const timelineRef = useRef<ReturnType<typeof anime.timeline> | null>(null);

	const handleMouseEnter = () => {
		if (prefersReducedMotion()) return;

		// Clear previous timeline if any
		if (timelineRef.current) {
			timelineRef.current.pause();
		}

		const filter = document.querySelector(`#${filterId} [data-displacement]`);
		const turbulence = document.querySelector(`#${filterId} [data-turbulence]`);

		if (filter && turbulence) {
			const tl = anime.timeline();

			// Phase 1: Peak distortion (slower entry)
			tl
				.add(filter, {
					scale: [0, intensity],
					duration: timing.slow,
					easing: easing.easeOut,
				})
				.add(
					turbulence,
					{
						baseFrequency: [0.01, 0.03],
						duration: timing.slow,
						easing: easing.easeOut,
					},
					0, // Parallel with previous
				);

			// Phase 2: Reverse (faster than before but still gradual)
			tl
				.add(
					filter,
					{
						scale: 0,
						duration: timing.slow * 1.5,
						easing: easing.easeOut,
					},
					"+=100", // Shorter hold at peak
				)
				.add(
					turbulence,
					{
						baseFrequency: 0.01,
						duration: timing.slow * 1.5,
						easing: easing.easeOut,
					},
					"<", // Synchronize with the previous add
				);

			timelineRef.current = tl;
		}
	};

	const handleMouseLeave = () => {
		if (prefersReducedMotion()) return;

		if (timelineRef.current) {
			timelineRef.current.pause();
			timelineRef.current = null;
		}

		const filter = document.querySelector(`#${filterId} [data-displacement]`);
		const turbulence = document.querySelector(`#${filterId} [data-turbulence]`);

		if (filter && turbulence) {
			// Immediately snap back to normal on exit
			anime({
				targets: filter,
				scale: 0,
				duration: timing.fast,
				easing: easing.easeOut,
			});
			anime({
				targets: turbulence,
				baseFrequency: 0.01,
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	// Return static content for reduced motion preference
	if (prefersReducedMotion()) {
		return <figure className={className}>{children}</figure>;
	}

	return (
		<figure
			className={className}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={containerRef}
			style={{ filter: `url(#${filterId})` }}
		>
			<DistortionFilter id={filterId} />
			{children}
		</figure>
	);
}
