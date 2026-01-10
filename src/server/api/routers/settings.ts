import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { settings } from "~/server/db/schema";

export const settingsRouter = createTRPCRouter({
	getAvailabilityStatus: publicProcedure.query(async () => {
		const result = await db.select().from(settings).where(eq(settings.key, "availability_status")).limit(1);

		if (result.length === 0) {
			// Default status if not set
			return "Open to opportunities";
		}

		return result[0]?.value ?? "Open to opportunities";
	}),

	updateAvailabilityStatus: publicProcedure
		.input(z.enum(["Available for hire", "Open to opportunities", "Currently employed"]))
		.mutation(async ({ input }) => {
			const existing = await db.select().from(settings).where(eq(settings.key, "availability_status")).limit(1);

			if (existing.length > 0) {
				await db
					.update(settings)
					.set({ value: input, updatedAt: new Date() })
					.where(eq(settings.key, "availability_status"));
			} else {
				await db.insert(settings).values({
					key: "availability_status",
					value: input,
					updatedAt: new Date(),
				});
			}

			return { success: true };
		}),
});
