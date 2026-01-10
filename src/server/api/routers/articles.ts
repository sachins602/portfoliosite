import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface DevToArticle {
	id: number;
	title: string;
	description: string;
	published_at: string;
	reading_time_minutes: number;
	tag_list: string[];
	url: string;
	cover_image?: string;
}

export const articlesRouter = createTRPCRouter({
	getArticles: publicProcedure.query(async () => {
		try {
			// Dev.to API endpoint
			const username = "sachins602"; // Update with actual Dev.to username if available
			const response = await fetch(
				`https://dev.to/api/articles?username=${username}&per_page=6`,
				{
					headers: {
						"User-Agent": "Portfolio Site",
					},
					next: { revalidate: 86400 }, // Cache for 1 day
				},
			);

			if (!response.ok) {
				console.error("Dev.to API error:", response.statusText);
				return [];
			}

			const data = (await response.json()) as DevToArticle[];

			return data.map((article) => ({
				id: article.id.toString(),
				title: article.title,
				excerpt: article.description || "",
				date: article.published_at,
				readingTime: article.reading_time_minutes,
				tags: article.tag_list.slice(0, 5),
				url: article.url,
				thumbnail: article.cover_image,
			}));
		} catch (error) {
			console.error("Error fetching articles:", error);
			// Return empty array on error (fallback to "Coming Soon" state)
			return [];
		}
	}),
});
