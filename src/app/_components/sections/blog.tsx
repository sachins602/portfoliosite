"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";
import { ArticleCard } from "../article-card";

export function Blog() {
	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		const title = element.querySelector(".section-title");
		const content = element.querySelector(".section-content");

		if (title) {
			anime({
				targets: title,
				opacity: [0, 1],
				translateY: [-20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}

		if (content) {
			anime({
				targets: content,
				opacity: [0, 1],
				translateY: [30, 0],
				delay: 200,
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
	});

	const { data: articles, isLoading } = api.articles.getArticles.useQuery();

	return (
		<section
			className="section-content min-h-screen py-20"
			id="blog"
			ref={sectionRef}
		>
			<div className="container mx-auto px-4">
				<h2 className="section-title mb-12 text-center font-bold text-4xl">
					<span className="relative inline-block">
						Blog & Articles
						<span className="absolute bottom-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-[var(--accent)] to-transparent" />
					</span>
				</h2>

				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-[var(--text-secondary)]">
							Loading articles...
						</div>
					</div>
				) : articles && articles.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{articles.map((article, index) => (
							<ArticleCard article={article} index={index} key={article.id} />
						))}
					</div>
				) : (
					<div className="section-content flex flex-col items-center justify-center py-20 text-center">
						<div className="mb-4 text-6xl text-[var(--text-secondary)]">📝</div>
						<h3 className="mb-2 font-semibold text-2xl">Coming Soon</h3>
						<p className="max-w-md text-[var(--text-secondary)]">
							I'm working on sharing my thoughts and experiences through blog
							posts. Check back soon for articles about web development, best
							practices, and more!
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
