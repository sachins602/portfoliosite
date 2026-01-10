"use client";

import { type RefObject, useEffect, useRef } from "react";
import {
	easing,
	prefersReducedMotion,
	stagger,
	timing,
} from "~/lib/animations";
import anime from "~/lib/anime";

/**
 * Hook for staggered reveal animations on lists
 */
export function useStaggerReveal<T extends HTMLElement>(
	_items: unknown[],
	options?: {
		duration?: number;
		delay?: number;
		staggerDelay?: number;
		translateY?: number;
	},
) {
	const ref = useRef<T>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!ref.current || hasAnimated.current || prefersReducedMotion()) {
			return;
		}

		const elements = ref.current.children;
		if (elements.length === 0) return;

		hasAnimated.current = true;

		anime({
			targets: elements,
			opacity: [0, 1],
			translateY: [options?.translateY ?? 30, 0],
			duration: options?.duration ?? timing.normal,
			delay: anime.stagger(options?.staggerDelay ?? stagger.normal),
			easing: easing.easeOut,
		});
	}, [options]);

	return ref as RefObject<T>;
}

/**
 * Hook for scroll-triggered animations using Intersection Observer
 */
export function useScrollTrigger<T extends HTMLElement>(
	animation: (element: T) => void,
	options?: {
		threshold?: number;
		once?: boolean;
		rootMargin?: string;
	},
) {
	const ref = useRef<T>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!ref.current || (options?.once && hasAnimated.current)) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && ref.current) {
						if (prefersReducedMotion()) {
							// Apply instant state without animation
							if (ref.current) {
								ref.current.style.opacity = "1";
								ref.current.style.transform = "translateY(0)";
							}
							return;
						}

						animation(ref.current);
						if (options?.once) {
							hasAnimated.current = true;
							observer.unobserve(entry.target);
						}
					}
				});
			},
			{
				threshold: options?.threshold ?? 0.1,
				rootMargin: options?.rootMargin ?? "0px",
			},
		);

		observer.observe(ref.current);

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [animation, options]);

	return ref as RefObject<T>;
}

/**
 * Hook for typewriter/typing effect
 */
export function useTypewriter(
	text: string,
	options?: {
		speed?: number;
		onComplete?: () => void;
	},
) {
	const ref = useRef<HTMLElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!ref.current || hasAnimated.current || prefersReducedMotion()) {
			if (ref.current && prefersReducedMotion()) {
				ref.current.textContent = text;
			}
			return;
		}

		hasAnimated.current = true;
		ref.current.textContent = "";

		const chars = text.split("");
		let currentIndex = 0;

		const typeChar = () => {
			if (currentIndex < chars.length && ref.current) {
				ref.current.textContent += chars[currentIndex];
				currentIndex++;
				setTimeout(typeChar, options?.speed ?? 50);
			} else if (options?.onComplete) {
				options.onComplete();
			}
		};

		typeChar();
	}, [text, options]);

	return ref as RefObject<HTMLElement>;
}

/**
 * Hook for elastic hover animations
 */
export function useElasticHover<T extends HTMLElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!ref.current || prefersReducedMotion()) return;

		const element = ref.current;

		const handleMouseEnter = () => {
			anime({
				targets: element,
				scale: [1, 1.05, 1],
				duration: timing.fast,
				easing: easing.elasticOut,
			});
		};

		element.addEventListener("mouseenter", handleMouseEnter);

		return () => {
			element.removeEventListener("mouseenter", handleMouseEnter);
		};
	}, []);

	return ref as RefObject<T>;
}

/**
 * Hook for SVG path drawing animation
 */
export function usePathDraw<T extends SVGPathElement>(options?: {
	duration?: number;
	delay?: number;
}) {
	const ref = useRef<T>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!ref.current || hasAnimated.current || prefersReducedMotion()) {
			return;
		}

		const path = ref.current;
		const pathLength = path.getTotalLength();

		// Set up the path for animation
		path.style.strokeDasharray = `${pathLength}`;
		path.style.strokeDashoffset = `${pathLength}`;

		hasAnimated.current = true;

		anime({
			targets: path,
			strokeDashoffset: [pathLength, 0],
			duration: options?.duration ?? timing.slow,
			delay: options?.delay ?? 0,
			easing: easing.elasticOut,
			complete: () => {
				path.style.strokeDashoffset = "0";
			},
		});
	}, [options]);

	return ref as RefObject<T>;
}
