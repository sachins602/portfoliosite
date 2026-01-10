import { adminRouter } from "~/server/api/routers/admin";
import { articlesRouter } from "~/server/api/routers/articles";
import { contactRouter } from "~/server/api/routers/contact";
import { githubActivityRouter } from "~/server/api/routers/github-activity";
import { githubContributionsRouter } from "~/server/api/routers/github-contributions";
import { postRouter } from "~/server/api/routers/post";
import { projectsRouter } from "~/server/api/routers/projects";
import { settingsRouter } from "~/server/api/routers/settings";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	projects: projectsRouter,
	contact: contactRouter,
	githubActivity: githubActivityRouter,
	githubContributions: githubContributionsRouter,
	articles: articlesRouter,
	settings: settingsRouter,
	admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
