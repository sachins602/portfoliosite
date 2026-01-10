import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchGitHubContributions } from "../github";

export const githubContributionsRouter = createTRPCRouter({
	getContributions: publicProcedure.query(async () => {
		try {
			const contributions = await fetchGitHubContributions();
			return contributions;
		} catch (error) {
			console.error("Failed to fetch GitHub contributions:", error);
			return {
				weeks: [],
				totalContributions: 0,
			};
		}
	}),
});
