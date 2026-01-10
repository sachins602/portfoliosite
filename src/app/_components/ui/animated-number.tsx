"use client";

import { useEffect, useRef, useState } from "react";
import { easing, prefersReducedMotion } from "~/lib/animations";
import anime from "~/lib/anime";

export interface AnimatedNumberProps {
	value: number;
	duration?: number;
}

export function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
	const [displayValue, setDisplayValue] = useState(0);
	const hasAnimated = useRef(false);
	const previousValue = useRef<number | null>(null);

	useEffect(() => {
		// Skip if value hasn't changed
		if (previousValue.current === value) {
			return;
		}

		// If this is the first time we get a non-zero value, animate
		if (previousValue.current === null || previousValue.current === 0) {
			if (value === 0) {
				// Still waiting for data, don't animate yet
				setDisplayValue(0);
				return;
			}

			// Got real data for the first time, animate from 0
			if (prefersReducedMotion()) {
				setDisplayValue(value);
				hasAnimated.current = true;
				previousValue.current = value;
				return;
			}

			hasAnimated.current = true;
			anime({
				targets: { count: 0 },
				count: value,
				duration,
				easing: easing.easeOut,
				update: (anim: { animatables?: Array<{ target: { count: number } }> }) => {
					setDisplayValue(Math.floor(anim.animatables?.[0]?.target.count ?? 0));
				},
				complete: () => {
					setDisplayValue(value);
				},
			});
		} else {
			// Value changed after initial animation, update directly or animate
			if (prefersReducedMotion()) {
				setDisplayValue(value);
			} else {
				// Animate from previous to new value
				const startValue = previousValue.current;
				anime({
					targets: { count: startValue },
					count: value,
					duration: duration * 0.5, // Shorter duration for updates
					easing: easing.easeOut,
					update: (anim: { animatables?: Array<{ target: { count: number } }> }) => {
						setDisplayValue(Math.floor(anim.animatables?.[0]?.target.count ?? 0));
					},
					complete: () => {
						setDisplayValue(value);
					},
				});
			}
		}

		previousValue.current = value;
	}, [value, duration]);

	return <span>{displayValue.toLocaleString()}</span>;
}
