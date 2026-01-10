import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchGitHubRepos } from "../github";
import { fallbackProjects } from "~/lib/data/fallback-projects";

export const projectsRouter = createTRPCRouter({
	getProjects: publicProcedure.query(async () => {
		try {
			const projects = await fetchGitHubRepos();
			return projects;
		} catch (error) {
			console.error("Failed to fetch GitHub projects, using fallback:", error);
			// Return fallback projects if GitHub API fails
			return fallbackProjects;
		}
	}),
});
