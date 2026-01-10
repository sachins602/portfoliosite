import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchGitHubUserStats, fetchLanguageStats } from "../github";

export const githubStatsRouter = createTRPCRouter({
	getUserStats: publicProcedure.query(async () => {
		try {
			const stats = await fetchGitHubUserStats();
			return stats;
		} catch (error) {
			console.error("Failed to fetch GitHub user stats:", error);
			return {
				totalCommits: 0,
				totalPRs: 0,
				totalIssues: 0,
				totalStars: 0,
				totalRepos: 0,
				followers: 0,
				following: 0,
			};
		}
	}),

	getLanguageStats: publicProcedure.query(async () => {
		try {
			const stats = await fetchLanguageStats();
			return stats;
		} catch (error) {
			console.error("Failed to fetch language stats:", error);
			return [];
		}
	}),
});
