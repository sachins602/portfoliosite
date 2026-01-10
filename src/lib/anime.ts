/**
 * Compatibility wrapper for anime.js v4
 * Provides the same API as anime.js v3 for easier migration
 */
import { type AnimationParams, animate, type TargetsParam } from "animejs";
import { stagger } from "animejs/utils";

// Type for the compatibility API (single object with targets and animation params)
// Use a more permissive type to avoid index signature conflicts
type AnimeParams = {
	targets: TargetsParam;
	[key: string]: unknown;
};

// Create a wrapper function that accepts a single object parameter
// and splits it into targets and parameters for anime.js v4
function animeWrapper(params: AnimeParams): ReturnType<typeof animate> {
	const { targets, ...animationParams } = params;
	return animate(targets, animationParams as AnimationParams);
}

// Attach stagger to the function for compatibility (anime.stagger)
// Use type assertion to add the stagger property
const animeWithStagger = animeWrapper as typeof animeWrapper & {
	stagger: typeof stagger;
};
animeWithStagger.stagger = stagger;

export default animeWithStagger;
export { stagger };
