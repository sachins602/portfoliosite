"use client";

import { useEffect, useRef } from "react";
import {
	easing,
	prefersReducedMotion,
	stagger,
	timing,
} from "~/lib/animations";
import anime from "~/lib/anime";
import type { Experience } from "~/lib/data/experience";

interface ExperienceCardProps {
	experience: Experience;
	index: number;
}

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const bulletsRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (!cardRef.current || prefersReducedMotion()) {
			if (cardRef.current) {
				cardRef.current.style.opacity = "1";
			}
			return;
		}

		let mouseEnterHandler: (() => void) | null = null;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && cardRef.current) {
						// Animate card
						anime({
							targets: cardRef.current,
							opacity: [0, 1],
							translateY: [30, 0],
							scale: [0.95, 1],
							duration: timing.normal,
							delay: index * 100,
							easing: easing.elasticOut,
						});

						// Animate bullets on hover
						if (bulletsRef.current) {
							mouseEnterHandler = () => {
								const items = bulletsRef.current?.children;
								if (items) {
									anime({
										targets: items,
										opacity: [0.7, 1],
										translateX: [-10, 0],
										delay: anime.stagger(stagger.fast),
										duration: timing.fast,
										easing: easing.easeOut,
									});
								}
							};

							cardRef.current.addEventListener("mouseenter", mouseEnterHandler);
						}

						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.1 },
		);

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
				if (mouseEnterHandler) {
					cardRef.current.removeEventListener("mouseenter", mouseEnterHandler);
				}
			}
		};
	}, [index]);

	const formatDate = (date: string | null) => {
		if (!date) return "Present";
		const parts = date.split("-");
		const year = parts[0];
		const month = parts[1];
		if (!year || !month) return "Present";
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthIndex = parseInt(month, 10) - 1;
		if (monthIndex < 0 || monthIndex >= monthNames.length) return "Present";
		return `${monthNames[monthIndex]} ${year}`;
	};

	return (
		<div
			className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6 shadow-sm transition-all duration-300 hover:border-(--accent) hover:shadow-md"
			ref={cardRef}
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h3 className="mb-1 font-semibold text-(--accent) text-xl">
						{experience.title}
					</h3>
					<p className="mb-1 font-medium text-(--text-primary) text-lg">
						{experience.company}
					</p>
					<p className="text-(--text-secondary) text-sm">
						{experience.location}
					</p>
				</div>
				<div className="whitespace-nowrap text-(--text-secondary) text-sm">
					{formatDate(experience.startDate)} - {formatDate(experience.endDate)}
				</div>
			</div>

			<ul className="mb-4 space-y-2.5" ref={bulletsRef}>
				{experience.bullets.map((bullet, idx) => (
					<li
						className="flex items-start gap-2.5 text-(--text-secondary) leading-relaxed"
						key={`bullet-${idx}-${bullet.slice(0, 10)}`}
						style={{ opacity: prefersReducedMotion() ? 1 : 0.7 }}
					>
						<span className="mt-1.5 shrink-0 text-(--accent)">•</span>
						<span className="flex-1">{bullet}</span>
					</li>
				))}
			</ul>

			<div className="flex flex-wrap gap-2">
				{experience.technologies.map((tech) => (
					<span
						className="rounded-full border border-(--accent)/30 bg-(--accent)/20 px-2.5 py-1 font-medium text-(--accent) text-xs"
						key={`tech-${tech}`}
					>
						{tech}
					</span>
				))}
			</div>
		</div>
	);
}
