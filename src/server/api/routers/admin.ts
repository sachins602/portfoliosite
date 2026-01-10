import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { contactSubmissions } from "~/server/db/schema";

export const adminRouter = createTRPCRouter({
	getSubmissions: publicProcedure.query(async () => {
		const submissions = await db
			.select()
			.from(contactSubmissions)
			.orderBy(desc(contactSubmissions.createdAt));

		return submissions;
	}),

	getSubmissionStats: publicProcedure.query(async () => {
		const allSubmissions = await db.select().from(contactSubmissions);
		const total = allSubmissions.length;
		const unread = allSubmissions.filter((s) => !s.isRead).length;

		return {
			total,
			unread,
			read: total - unread,
		};
	}),

	markAsRead: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			await db
				.update(contactSubmissions)
				.set({ isRead: true })
				.where(eq(contactSubmissions.id, input.id));

			return { success: true };
		}),

	deleteSubmission: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			await db
				.delete(contactSubmissions)
				.where(eq(contactSubmissions.id, input.id));

			return { success: true };
		}),
});
