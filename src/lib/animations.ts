/**
 * Animation utilities and presets for anime.js
 * Centralized configuration for consistent animations
 */

// Timing presets
export const timing = {
	fast: 300,
	normal: 500,
	slow: 800,
} as const;

// Easing presets
export const easing = {
	elasticOut: "spring(1, 80, 10, 0)",
	spring: "spring(1, 100, 10, 0)",
	easeInOut: "easeInOutQuad",
	easeOut: "easeOutQuad",
	easeIn: "easeInQuad",
} as const;

// Stagger configurations
export const stagger = {
	fast: 50,
	normal: 100,
	slow: 150,
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animation factory for fade + translate animations
 */
export function createFadeTranslate(
	translateY: number = 30,
	duration: number = timing.normal,
) {
	return {
		opacity: [0, 1],
		translateY: [translateY, 0],
		duration,
		easing: easing.easeOut,
	};
}

/**
 * Animation factory for scale animations
 */
export function createScale(
	scale: number = 0.8,
	duration: number = timing.normal,
) {
	return {
		scale: [scale, 1],
		opacity: [0, 1],
		duration,
		easing: easing.elasticOut,
	};
}

/**
 * Animation factory for elastic hover effects
 */
export function createElasticHover() {
	return {
		scale: [1, 1.05, 1],
		duration: timing.fast,
		easing: easing.elasticOut,
	};
}
