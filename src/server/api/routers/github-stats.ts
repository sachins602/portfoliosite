import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchGitHubUserStats, fetchLanguageStats } from "../github";

export const githubStatsRouter = createTRPCRouter({
	getUserStats: publicProcedure.query(async () => {
		try {
			const stats = await fetchGitHubUserStats();
			return stats;
		} catch (error) {
			console.error("Failed to fetch GitHub user stats:", error);

			// Determine error type from the error message or status
			const errorMessage = error instanceof Error ? error.message : String(error);
			const isRateLimit = errorMessage.includes("rate limit") || errorMessage.includes("403");
			const isUnauthorized = errorMessage.includes("401") || errorMessage.includes("Unauthorized");

			if (isRateLimit) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "GitHub API rate limit exceeded. Please try again later.",
					cause: error,
				});
			}

			if (isUnauthorized) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "GitHub API authentication failed. Please check your GitHub token.",
					cause: error,
				});
			}

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch GitHub user statistics. Please try again later.",
				cause: error,
			});
		}
	}),

	getLanguageStats: publicProcedure.query(async () => {
		try {
			const stats = await fetchLanguageStats();
			return stats;
		} catch (error) {
			console.error("Failed to fetch language stats:", error);

			// Determine error type from the error message or status
			const errorMessage = error instanceof Error ? error.message : String(error);
			const isRateLimit = errorMessage.includes("rate limit") || errorMessage.includes("403");
			const isUnauthorized = errorMessage.includes("401") || errorMessage.includes("Unauthorized");

			if (isRateLimit) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "GitHub API rate limit exceeded. Please try again later.",
					cause: error,
				});
			}

			if (isUnauthorized) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "GitHub API authentication failed. Please check your GitHub token.",
					cause: error,
				});
			}

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch language statistics. Please try again later.",
				cause: error,
			});
		}
	}),
});
