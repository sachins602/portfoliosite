import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface BuildStats {
	linesOfCode: number;
	animations: number;
}

async function countLinesOfCode(dir: string, extensions: string[] = [".ts", ".tsx", ".js", ".jsx"]): Promise<number> {
	let totalLines = 0;

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);

			// Skip node_modules, .next, and other build/dependency directories
			if (
				entry.name.startsWith(".") ||
				entry.name === "node_modules" ||
				entry.name === ".next" ||
				entry.name === "dist" ||
				entry.name === "build" ||
				entry.name === "drizzle" ||
				entry.name === ".git"
			) {
				continue;
			}

			if (entry.isDirectory()) {
				totalLines += await countLinesOfCode(fullPath, extensions);
			} else if (entry.isFile()) {
				const ext = entry.name.substring(entry.name.lastIndexOf("."));
				if (extensions.includes(ext)) {
					try {
						const content = await readFile(fullPath, "utf-8");
						const lines = content.split("\n").filter((line) => line.trim().length > 0).length;
						totalLines += lines;
					} catch {
						// Skip files that can't be read
					}
				}
			}
		}
	} catch {
		// Skip directories that can't be read
	}

	return totalLines;
}

async function countAnimations(dir: string): Promise<number> {
	let animationCount = 0;

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);

			// Skip node_modules, .next, and other build/dependency directories
			if (
				entry.name.startsWith(".") ||
				entry.name === "node_modules" ||
				entry.name === ".next" ||
				entry.name === "dist" ||
				entry.name === "build" ||
				entry.name === "drizzle" ||
				entry.name === ".git"
			) {
				continue;
			}

			if (entry.isDirectory()) {
				animationCount += await countAnimations(fullPath);
			} else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts") || entry.name.endsWith(".jsx") || entry.name.endsWith(".js"))) {
				try {
					const content = await readFile(fullPath, "utf-8");
					// Count anime() calls, animation-related patterns
					const animeMatches = content.match(/anime\s*\(/g);
					if (animeMatches) {
						animationCount += animeMatches.length;
					}
					// Count CSS animation/transition patterns
					const cssAnimationMatches = content.match(/(?:animation|transition|@keyframes|animate-)/g);
					if (cssAnimationMatches) {
						animationCount += cssAnimationMatches.length;
					}
				} catch {
					// Skip files that can't be read
				}
			}
		}
	} catch {
		// Skip directories that can't be read
	}

	return animationCount;
}

export const buildStatsRouter = createTRPCRouter({
	getBuildStats: publicProcedure.query(async (): Promise<BuildStats> => {
		try {
			// Get the project root directory (go up from server/api/routers)
			const projectRoot = join(process.cwd(), "src");

			const [linesOfCode, animations] = await Promise.all([
				countLinesOfCode(projectRoot),
				countAnimations(projectRoot),
			]);

			return {
				linesOfCode,
				animations,
			};
		} catch (error) {
			console.error("Failed to calculate build stats:", error);
			// Return default values on error
			return {
				linesOfCode: 0,
				animations: 0,
			};
		}
	}),
});
