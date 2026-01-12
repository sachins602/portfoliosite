"use client";

import { ExternalLink, GitFork, Github, Star } from "lucide-react";
import Image from "next/image";
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
	const isTouchDevice = useRef(false);

	// Detect touch device
	useEffect(() => {
		isTouchDevice.current =
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			// @ts-expect-error - msMaxTouchPoints is IE specific
			navigator.msMaxTouchPoints > 0;
	}, []);

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

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (prefersReducedMotion() || isTouchDevice.current || !cardRef.current) {
			return;
		}

		const card = cardRef.current;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
		const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees

		// Clamp values
		const clampedRotateX = Math.max(-15, Math.min(15, rotateX));
		const clampedRotateY = Math.max(-15, Math.min(15, rotateY));

		card.style.transform = `perspective(1000px) rotateX(${clampedRotateX}deg) rotateY(${clampedRotateY}deg) translateY(-10px) scale(1.02)`;
	};

	const handleMouseEnter = () => {
		if (!prefersReducedMotion() && cardRef.current && !isTouchDevice.current) {
			cardRef.current.style.transition = "transform 0.1s ease-out";

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
		if (!prefersReducedMotion() && cardRef.current && !isTouchDevice.current) {
			cardRef.current.style.transition = "transform 0.3s ease-out";
			cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
		}
	};

	return (
		<article
			className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6 shadow-lg transition-all duration-300 hover:border-(--accent) hover:shadow-xl"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			ref={cardRef}
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			{project.image && (
				<div className="relative mb-6 aspect-video overflow-hidden rounded-md border border-(--border)">
					<Image
						alt={project.name}
						className="object-cover transition-transform duration-500 hover:scale-110"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						src={project.image}
					/>
				</div>
			)}
			<div className="mb-4 flex items-start justify-between">
				<h3 className="flex-1 font-semibold text-(--accent) text-xl">{project.name}</h3>
				<div className="flex gap-2">
					<a
						aria-label="View on GitHub"
						className="rounded p-2 transition-colors hover:bg-(--bg-primary)"
						href={project.html_url}
						rel="noopener noreferrer"
						target="_blank"
					>
						<Github className="h-5 w-5" />
					</a>
					{project.homepage && (
						<a
							aria-label="View live demo"
							className="rounded p-2 transition-colors hover:bg-(--bg-primary)"
							href={project.homepage}
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLink className="h-5 w-5" />
						</a>
					)}
				</div>
			</div>

			<p className="mb-4 line-clamp-3 text-(--text-secondary)">{project.description}</p>

			<div className="mb-4 flex items-center gap-4 text-(--text-secondary) text-sm">
				<div className="flex items-center gap-1">
					<span
						className="h-3 w-3 rounded-full"
						style={{
							backgroundColor: languageColors[project.language] ?? languageColors.Other,
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
					{project.topics.slice(0, 5).map((topic) => (
						<span
							className="rounded border border-(--accent)/30 bg-(--accent)/20 px-2 py-1 text-(--accent) text-xs"
							key={`topic-${topic}`}
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
						>
							{topic}
						</span>
					))}
				</div>
			)}
		</article>
	);
}
