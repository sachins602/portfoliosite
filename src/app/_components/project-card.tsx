"use client";

import { ExternalLink, GitFork, Github, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import type { Project } from "~/lib/data/fallback-projects";

interface ProjectCardProps {
	project: Project;
	index: number;
}

const languageColors: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f7df1e",
	"C#": "#239120",
	Go: "#00add8",
	Python: "#3776ab",
	Java: "#ed8b00",
	Other: "#6e7681",
};

export function ProjectCard({ project, index }: ProjectCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const tagsRef = useRef<HTMLDivElement>(null);

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
							translateY: [50, 0],
							scale: [0.9, 1],
							delay: index * 100 + Math.random() * 200,
							duration: timing.normal,
							easing: easing.elasticOut,
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
				translateY: -10,
				scale: 1.02,
				duration: timing.fast,
				easing: easing.elasticOut,
			});

			if (tagsRef.current) {
				const tags = tagsRef.current.children;
				anime({
					targets: tags,
					opacity: [0, 1],
					scale: [0.8, 1],
					delay: anime.stagger(50),
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
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

	return (
		<div
			className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-lg transition-all duration-300 hover:border-[var(--accent)] hover:shadow-xl"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={cardRef}
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="mb-4 flex items-start justify-between">
				<h3 className="flex-1 font-semibold text-[var(--accent)] text-xl">
					{project.name}
				</h3>
				<div className="flex gap-2">
					<a
						aria-label="View on GitHub"
						className="rounded p-2 transition-colors hover:bg-[var(--bg-primary)]"
						href={project.html_url}
						rel="noopener noreferrer"
						target="_blank"
					>
						<Github className="h-5 w-5" />
					</a>
					{project.homepage && (
						<a
							aria-label="View live demo"
							className="rounded p-2 transition-colors hover:bg-[var(--bg-primary)]"
							href={project.homepage}
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLink className="h-5 w-5" />
						</a>
					)}
				</div>
			</div>

			<p className="mb-4 line-clamp-3 text-[var(--text-secondary)]">
				{project.description}
			</p>

			<div className="mb-4 flex items-center gap-4 text-[var(--text-secondary)] text-sm">
				<div className="flex items-center gap-1">
					<span
						className="h-3 w-3 rounded-full"
						style={{
							backgroundColor:
								languageColors[project.language] ?? languageColors.Other,
						}}
					/>
					<span>{project.language}</span>
				</div>
				<div className="flex items-center gap-1">
					<Star className="h-4 w-4" />
					<span>{project.stargazers_count}</span>
				</div>
				<div className="flex items-center gap-1">
					<GitFork className="h-4 w-4" />
					<span>{project.forks_count}</span>
				</div>
			</div>

			{project.topics.length > 0 && (
				<div className="flex flex-wrap gap-2" ref={tagsRef}>
					{project.topics.slice(0, 5).map((topic, idx) => (
						<span
							className="rounded border border-[var(--accent)]/30 bg-[var(--accent)]/20 px-2 py-1 text-[var(--accent)] text-xs"
							key={idx}
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
						>
							{topic}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
