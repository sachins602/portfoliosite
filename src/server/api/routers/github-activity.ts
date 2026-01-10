import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchGitHubEvents } from "../github";

export const githubActivityRouter = createTRPCRouter({
	getActivity: publicProcedure.query(async () => {
		try {
			const events = await fetchGitHubEvents();
			return events;
		} catch (error) {
			console.error("Failed to fetch GitHub activity:", error);
			return [];
		}
	}),
});
