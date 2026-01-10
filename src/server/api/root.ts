import { adminRouter } from "~/server/api/routers/admin";
import { buildStatsRouter } from "~/server/api/routers/build-stats";
import { contactRouter } from "~/server/api/routers/contact";
import { githubActivityRouter } from "~/server/api/routers/github-activity";
import { githubContributionsRouter } from "~/server/api/routers/github-contributions";
import { githubStatsRouter } from "~/server/api/routers/github-stats";
import { projectsRouter } from "~/server/api/routers/projects";
import { settingsRouter } from "~/server/api/routers/settings";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	projects: projectsRouter,
	contact: contactRouter,
	githubActivity: githubActivityRouter,
	githubContributions: githubContributionsRouter,
	githubStats: githubStatsRouter,
	buildStats: buildStatsRouter,
	settings: settingsRouter,
	admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.projects.getAll();
 */
export const createCaller = createCallerFactory(appRouter);
