"use client";

import { Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

const getContributionColor = (count: number): string => {
	if (count === 0) return "var(--bg-secondary)";
	if (count <= 2) return "rgba(13, 71, 161, 0.3)"; // Low
	if (count <= 5) return "rgba(13, 71, 161, 0.5)"; // Medium
	return "rgba(13, 71, 161, 0.8)"; // High
};

export function ContributionHeatmap() {
	const {
		data: contributions,
		isLoading,
		error,
	} = api.githubContributions.getContributions.useQuery();

	const [hoveredCell, setHoveredCell] = useState<{
		date: string;
		count: number;
		x: number;
		y: number;
	} | null>(null);

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

	const gridRef = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (
			!contributions ||
			!gridRef.current ||
			hasAnimated.current ||
			prefersReducedMotion() ||
			contributions.weeks.length === 0
		) {
			return;
		}

		hasAnimated.current = true;

		// Get all cells
		const cells = Array.from(
			gridRef.current.querySelectorAll<HTMLElement>(".contribution-cell"),
		);

		// Animate cells in diagonal pattern (past to present)
		anime({
			targets: cells,
			opacity: [0, 1],
			scale: [0.8, 1],
			duration: timing.normal,
			delay: anime.stagger(10, {
				grid: [52, 7],
				from: "first",
			}),
			easing: easing.easeOut,
		});
	}, [contributions]);

	if (isLoading) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
				<div className="mb-4 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">GitHub Contributions</h3>
				</div>
				<div className="h-32 animate-pulse rounded bg-[var(--border)]" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
				<div className="mb-4 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">GitHub Contributions</h3>
				</div>
				<p className="py-8 text-center text-[var(--text-secondary)]">
					Unable to load contributions. Please check your GitHub token
					configuration.
				</p>
			</div>
		);
	}

	if (!contributions || contributions.weeks.length === 0) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
				<div className="mb-4 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">GitHub Contributions</h3>
				</div>
				<p className="py-8 text-center text-[var(--text-secondary)]">
					No contribution data available. Add a GITHUB_TOKEN to your .env file
					to see your contributions.
				</p>
			</div>
		);
	}

	// Flatten weeks into days array
	const allDays: Array<{ date: string; count: number }> = [];
	contributions.weeks.forEach((week) => {
		week.contributionDays.forEach((day) => {
			allDays.push({
				date: day.date,
				count: day.contributionCount,
			});
		});
	});

	// Group days by week (7 days per week)
	const weeks: Array<Array<{ date: string; count: number }>> = [];
	for (let i = 0; i < allDays.length; i += 7) {
		weeks.push(allDays.slice(i, i + 7));
	}

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div
			className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
			ref={containerRef}
		>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">GitHub Contributions</h3>
				</div>
				<a
					className="text-[var(--accent)] text-sm transition-colors hover:underline"
					href="https://github.com/sachins602"
					rel="noopener noreferrer"
					target="_blank"
				>
					View profile
				</a>
			</div>

			<div className="mb-4 flex items-center gap-4 text-[var(--text-secondary)] text-xs">
				<span>Less</span>
				<div className="flex gap-1">
					<div className="h-3 w-3 rounded bg-[var(--bg-secondary)]" />
					<div
						className="h-3 w-3 rounded"
						style={{ backgroundColor: "rgba(13, 71, 161, 0.3)" }}
					/>
					<div
						className="h-3 w-3 rounded"
						style={{ backgroundColor: "rgba(13, 71, 161, 0.5)" }}
					/>
					<div
						className="h-3 w-3 rounded"
						style={{ backgroundColor: "rgba(13, 71, 161, 0.8)" }}
					/>
				</div>
				<span>More</span>
			</div>

			<div className="relative overflow-x-auto pb-2">
				<div
					className="grid min-w-[600px] gap-1"
					ref={gridRef}
					style={{
						gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
					}}
				>
					{weeks.map((week) =>
						week.map((day, dayIndex) => {
							return (
								<button
									aria-label={`${day.count} contributions on ${day.date}`}
									className="contribution-cell group relative h-3 w-3 rounded transition-all hover:scale-125 hover:ring-2 hover:ring-[var(--accent)]"
									key={`${day.date}-${dayIndex}`}
									onMouseEnter={(e) => {
										const rect = e.currentTarget.getBoundingClientRect();
										setHoveredCell({
											date: day.date,
											count: day.count,
											x: rect.left + rect.width / 2,
											y: rect.top - 10,
										});
									}}
									onMouseLeave={() => {
										setHoveredCell(null);
									}}
									style={{
										backgroundColor: getContributionColor(day.count),
										border: `1px solid ${day.count > 0 ? "rgba(13, 71, 161, 0.2)" : "var(--border)"}`,
									}}
									type="button"
								/>
							);
						}),
					)}
				</div>

				{/* Tooltip */}
				{hoveredCell && (
					<div
						className="pointer-events-none fixed z-50 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs shadow-lg"
						style={{
							left: `${hoveredCell.x}px`,
							top: `${hoveredCell.y}px`,
							transform: "translateX(-50%) translateY(-100%)",
						}}
					>
						<div className="font-semibold">
							{hoveredCell.count} contribution
							{hoveredCell.count !== 1 ? "s" : ""}
						</div>
						<div className="text-[var(--text-secondary)]">
							{formatDate(hoveredCell.date)}
						</div>
					</div>
				)}
			</div>

			<div className="mt-4 text-center text-[var(--text-secondary)] text-sm">
				<span className="font-semibold text-[var(--text-primary)]">
					{contributions.totalContributions}
				</span>{" "}
				contributions in the last year
			</div>
		</div>
	);
}
