"use client";

import { useEffect, useRef } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { useGitHubLanguageStats } from "~/hooks/use-github-language-stats";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

export function GitHubLanguageChart() {
	const { data: languages, isLoading, error } = useGitHubLanguageStats();

	const containerRef = useScrollTrigger<HTMLDivElement>((element) => {
		if (prefersReducedMotion()) return;

		anime({
			targets: element,
			opacity: [0, 1],
			translateY: [20, 0],
			duration: timing.normal,
			easing: easing.easeOut,
		});
	});

	const chartRef = useRef<SVGSVGElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!languages || languages.length === 0 || !chartRef.current || hasAnimated.current || prefersReducedMotion()) {
			return;
		}

		hasAnimated.current = true;

		// Animate the donut segments with opacity and scale instead
		const paths = chartRef.current.querySelectorAll<SVGCircleElement>(".lang-segment");

		anime({
			targets: paths,
			opacity: [0, 1],
			scale: [0.95, 1],
			duration: timing.slow,
			delay: anime.stagger(100),
			easing: easing.easeOut,
		});
	}, [languages]);

	if (isLoading) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h3 className="mb-4 font-semibold text-lg">Language Distribution</h3>
				<div className="flex items-center justify-center">
					<div className="h-32 w-32 animate-pulse rounded-full bg-(--border)" />
				</div>
			</div>
		);
	}

	if (error || !languages || languages.length === 0) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h3 className="mb-4 font-semibold text-lg">Language Distribution</h3>
				<p className="text-center text-(--text-secondary) text-sm">No language data available</p>
			</div>
		);
	}

	// Calculate donut chart segments
	const size = 160;
	const strokeWidth = 24;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const centerX = size / 2;
	const centerY = size / 2;

	let currentOffset = 0;

	return (
		<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6" ref={containerRef}>
			<h3 className="mb-6 text-center font-semibold text-xl">Language Distribution</h3>

			<div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
				{/* Donut Chart */}
				<div className="relative">
					<svg
						aria-label="GitHub Language Distribution"
						className="-rotate-90 transform"
						height={size}
						ref={chartRef}
						role="img"
						width={size}
					>
						{/* Background circle */}
						<circle cx={centerX} cy={centerY} fill="none" r={radius} stroke="var(--border)" strokeWidth={strokeWidth} />

						{/* Language segments */}
						{languages.map((lang) => {
							const segmentLength = (lang.percentage / 100) * circumference;
							const offset = currentOffset;
							currentOffset += segmentLength;

							return (
								<circle
									className="lang-segment transition-all duration-300 hover:opacity-80"
									cx={centerX}
									cy={centerY}
									fill="none"
									key={lang.name}
									r={radius}
									stroke={lang.color}
									strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
									strokeDashoffset={-offset}
									strokeWidth={strokeWidth}
									style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
								/>
							);
						})}
					</svg>

					{/* Center text */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="font-bold text-(--text-primary) text-2xl">{languages.length}</span>
						<span className="text-(--text-secondary) text-xs">Languages</span>
					</div>
				</div>

				{/* Legend */}
				<div className="grid grid-cols-2 gap-x-6 gap-y-2">
					{languages.map((lang) => (
						<div className="flex items-center gap-2" key={lang.name}>
							<div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
							<span className="font-medium text-(--text-primary) text-sm">{lang.name}</span>
							<span className="text-(--text-secondary) text-xs">{lang.percentage.toFixed(1)}%</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
