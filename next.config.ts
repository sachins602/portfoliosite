/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	// SWC minification is enabled by default in Next.js 13+
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "github.com",
			},
			{
				protocol: "https",
				hostname: "opengraph.githubassets.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
	logging: {
		fetches: {
			fullUrl: true, // Enable full URL logging for debugging data fetching waterfalls
		},
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
		// For production builds too:
		turbopackFileSystemCacheForBuild: true,
		optimizeCss: true,
	},
};

export default nextConfig;
