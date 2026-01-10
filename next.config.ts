/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		turbopackFileSystemCacheForDev: true,
		// For production builds too:
		turbopackFileSystemCacheForBuild: true,
		optimizeCss: true,
	},
};

export default nextConfig;
