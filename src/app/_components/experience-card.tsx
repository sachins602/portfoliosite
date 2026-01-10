"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import type { Experience } from "~/lib/data/experience";
import { prefersReducedMotion, timing, easing, stagger } from "~/lib/animations";

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

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
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
							const handleMouseEnter = () => {
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

							cardRef.current.addEventListener("mouseenter", handleMouseEnter);
							return () => {
								cardRef.current?.removeEventListener(
									"mouseenter",
									handleMouseEnter,
								);
							};
						}

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

	const formatDate = (date: string | null) => {
		if (!date) return "Present";
		const [year, month] = date.split("-");
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
		return `${monthNames[parseInt(month) - 1]} ${year}`;
	};

	return (
		<div
			ref={cardRef}
			className="p-6 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
				<div>
					<h3 className="text-xl font-semibold text-[var(--accent)]">
						{experience.title}
					</h3>
					<p className="text-lg font-medium">{experience.company}</p>
					<p className="text-sm text-[var(--text-secondary)]">
						{experience.location}
					</p>
				</div>
				<div className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
					{formatDate(experience.startDate)} - {formatDate(experience.endDate)}
				</div>
			</div>

			<ul ref={bulletsRef} className="space-y-2 mb-4">
				{experience.bullets.map((bullet, idx) => (
					<li
						key={idx}
						className="text-[var(--text-secondary)] flex items-start gap-2"
						style={{ opacity: prefersReducedMotion() ? 1 : 0.7 }}
					>
						<span className="text-[var(--accent)] mt-1.5">•</span>
						<span>{bullet}</span>
					</li>
				))}
			</ul>

			<div className="flex flex-wrap gap-2">
				{experience.technologies.map((tech, idx) => (
					<span
						key={idx}
						className="px-3 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
					>
						{tech}
					</span>
				))}
			</div>
		</div>
	);
}
