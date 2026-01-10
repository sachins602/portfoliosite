"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Github, Star, GitFork } from "lucide-react";
import anime from "animejs";
import type { Project } from "~/lib/data/fallback-projects";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";

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
			ref={cardRef}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className="p-6 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 shadow-lg hover:shadow-xl"
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="flex items-start justify-between mb-4">
				<h3 className="text-xl font-semibold text-[var(--accent)] flex-1">
					{project.name}
				</h3>
				<div className="flex gap-2">
					<a
						href={project.html_url}
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors"
						aria-label="View on GitHub"
					>
						<Github className="w-5 h-5" />
					</a>
					{project.homepage && (
						<a
							href={project.homepage}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors"
							aria-label="View live demo"
						>
							<ExternalLink className="w-5 h-5" />
						</a>
					)}
				</div>
			</div>

			<p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
				{project.description}
			</p>

			<div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
				<div className="flex items-center gap-1">
					<span
						className="w-3 h-3 rounded-full"
						style={{
							backgroundColor:
								languageColors[project.language] ?? languageColors.Other,
						}}
					/>
					<span>{project.language}</span>
				</div>
				<div className="flex items-center gap-1">
					<Star className="w-4 h-4" />
					<span>{project.stargazers_count}</span>
				</div>
				<div className="flex items-center gap-1">
					<GitFork className="w-4 h-4" />
					<span>{project.forks_count}</span>
				</div>
			</div>

			{project.topics.length > 0 && (
				<div ref={tagsRef} className="flex flex-wrap gap-2">
					{project.topics.slice(0, 5).map((topic, idx) => (
						<span
							key={idx}
							className="px-2 py-1 text-xs rounded bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
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
