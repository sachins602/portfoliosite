import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contactSubmissions } from "~/server/db/schema";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const contactSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

export const contactRouter = createTRPCRouter({
	submitContact: publicProcedure.input(contactSchema).mutation(async ({ ctx, input }) => {
		try {
			// Save to database
			await ctx.db.insert(contactSubmissions).values({
				name: input.name,
				email: input.email,
				message: input.message,
				isRead: false,
			});

			// Send email via Resend
			if (resend) {
				try {
					await resend.emails.send({
						from: "Portfolio Contact <onboarding@resend.dev>",
						to: env.CONTACT_EMAIL,
						subject: `New Contact Form Submission from ${input.name}`,
						html: `
							<h2>New Contact Form Submission</h2>
							<p><strong>Name:</strong> ${input.name}</p>
							<p><strong>Email:</strong> ${input.email}</p>
							<p><strong>Message:</strong></p>
							<p>${input.message.replace(/\n/g, "<br>")}</p>
						`,
						replyTo: input.email,
					});
				} catch (emailError) {
					console.error("Failed to send email:", emailError);
					// Don't fail the request if email fails, we still saved to DB
				}
			} else {
				console.warn("RESEND_API_KEY not configured, skipping email send");
			}

			return {
				success: true,
				message: "Thank you for your message! I'll get back to you soon.",
			};
		} catch (error) {
			console.error("Contact form error:", error);
			throw new Error("Failed to submit contact form. Please try again.");
		}
	}),
});
