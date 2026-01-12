/**
 * Compatibility wrapper for anime.js v4
 * Provides the same API as anime.js v3 for easier migration
 */
import { type AnimationParams, animate, createTimeline, type TargetsParam, type Timeline } from "animejs";
import { stagger } from "animejs/utils";

export type StrictAnimeTargets =
	| string // CSS Selector
	| HTMLElement
	| SVGElement
	| Element // Generic DOM Element
	| NodeList
	| HTMLCollection
	| Record<string, unknown> // Plain Javascript Object
	| (string | HTMLElement | SVGElement | Element | Record<string, unknown> | null | undefined)[]; // Array of targets

// Combined type for the compatibility API
// We use unknown for other properties to avoid conflicts with AnimationParams' index signature
// while enforcing strict types for targets.
export type AnimeParams = {
	targets: StrictAnimeTargets;
	[key: string]: unknown;
};

// Create a wrapper function that accepts a single object parameter
// and splits it into targets and parameters for anime.js v4
function animeWrapper(params: AnimeParams) {
	const { targets, ...animationParams } = params;
	// Cast targets to any to satisfy anime.js v4 explicit types if they differ slightly,
	// but we enforced strictness at our API boundary.
	return animate(targets as TargetsParam, animationParams as AnimationParams);
}

// Attach stagger and createTimeline to the function for compatibility
const animeWithStagger = animeWrapper as typeof animeWrapper & {
	stagger: typeof stagger;
	timeline: typeof createTimeline;
};
animeWithStagger.stagger = stagger;
animeWithStagger.timeline = createTimeline;

export default animeWithStagger;
export { stagger, createTimeline, type Timeline };
