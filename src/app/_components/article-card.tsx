"use client";

import { Calendar, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

export interface Article {
	id: string;
	title: string;
	excerpt: string;
	date: string;
	readingTime?: number;
	tags?: string[];
	url: string;
	thumbnail?: string;
}

interface ArticleCardProps {
	article: Article;
	index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!cardRef.current || prefersReducedMotion()) {
			if (cardRef.current) {
				cardRef.current.style.opacity = "1";
			}
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && cardRef.current) {
						anime({
							targets: cardRef.current,
							opacity: [0, 1],
							translateY: [30, 0],
							scale: [0.95, 1],
							delay: index * 100,
							duration: timing.normal,
							easing: easing.easeOut,
						});

						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 },
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, [index]);

	const handleMouseEnter = () => {
		if (!prefersReducedMotion() && cardRef.current) {
			anime({
				targets: cardRef.current,
				translateY: -8,
				scale: 1.02,
				duration: timing.fast,
				easing: easing.elasticOut,
			});
		}
	};

	const handleMouseLeave = () => {
		if (!prefersReducedMotion() && cardRef.current) {
			anime({
				targets: cardRef.current,
				translateY: 0,
				scale: 1,
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<a
			className="block"
			href={article.url}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			rel="noopener noreferrer"
			target="_blank"
		>
			<div
				className="h-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-lg transition-all duration-300 hover:border-[var(--accent)] hover:shadow-xl"
				ref={cardRef}
				style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
			>
				{article.thumbnail && (
					<div className="relative mb-4 aspect-video overflow-hidden rounded-md">
						<Image
							alt={article.title}
							className="object-cover"
							fill
							src={article.thumbnail}
							unoptimized
						/>
					</div>
				)}

				<h3 className="mb-2 font-semibold text-[var(--accent)] text-xl">
					{article.title}
				</h3>

				<p className="mb-4 line-clamp-3 text-[var(--text-secondary)]">
					{article.excerpt}
				</p>

				<div className="mb-4 flex flex-wrap items-center gap-4 text-[var(--text-secondary)] text-sm">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						<span>{formatDate(article.date)}</span>
					</div>
					{article.readingTime && (
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							<span>{article.readingTime} min read</span>
						</div>
					)}
				</div>

				{article.tags && article.tags.length > 0 && (
					<div className="mb-4 flex flex-wrap gap-2">
						{article.tags.slice(0, 3).map((tag, idx) => (
							<span
								className="rounded border border-[var(--accent)]/30 bg-[var(--accent)]/20 px-2 py-1 text-[var(--accent)] text-xs"
								key={idx}
							>
								{tag}
							</span>
						))}
					</div>
				)}

				<div className="flex items-center gap-2 font-medium text-[var(--accent)] text-sm">
					<span>Read more</span>
					<ExternalLink className="h-4 w-4" />
				</div>
			</div>
		</a>
	);
}
