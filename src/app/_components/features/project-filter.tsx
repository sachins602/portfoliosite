"use client";

import { X } from "lucide-react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import type { Project } from "~/lib/data/fallback-projects";

interface ProjectFilterProps {
	projects: Project[];
	activeFilters: {
		languages: string[];
		tags: string[];
		years: number[];
	};
	onFiltersChange: (filters: { languages: string[]; tags: string[]; years: number[] }) => void;
}

export function ProjectFilter({ projects, activeFilters, onFiltersChange }: ProjectFilterProps) {
	// Extract unique filter options from projects
	const availableLanguages = Array.from(new Set(projects.map((p) => p.language))).sort();

	const availableTags = Array.from(new Set(projects.flatMap((p) => p.topics))).sort();

	const availableYears = Array.from(new Set(projects.map((p) => new Date(p.updated_at).getFullYear()))).sort(
		(a, b) => b - a,
	);

	// Count projects per filter
	const getCount = (type: "language" | "tag" | "year", value: string | number) => {
		return projects.filter((p) => {
			if (type === "language") return p.language === value;
			if (type === "tag") return p.topics.includes(value as string);
			if (type === "year") return new Date(p.updated_at).getFullYear() === value;
			return false;
		}).length;
	};

	const toggleFilter = (type: "languages" | "tags" | "years", value: string | number) => {
		const current = activeFilters[type];
		const newFilters = {
			...activeFilters,
			[type]: current.includes(value as never) ? current.filter((v) => v !== value) : [...current, value as never],
		};
		onFiltersChange(newFilters);
	};

	const clearFilters = () => {
		onFiltersChange({ languages: [], tags: [], years: [] });
	};

	const hasActiveFilters =
		activeFilters.languages.length > 0 || activeFilters.tags.length > 0 || activeFilters.years.length > 0;

	return (
		<div className="mb-8 space-y-6">
			{/* Languages */}
			<div>
				<h3 className="mb-3 font-semibold text-(--text-secondary) text-sm">Languages</h3>
				<div className="flex flex-wrap gap-2">
					{availableLanguages.map((lang) => {
						const isActive = activeFilters.languages.includes(lang);
						const count = getCount("language", lang);
						return (
							<button
								className={`rounded-full border px-4 py-2 text-sm transition-all ${
									isActive
										? "border-(--accent) bg-(--accent)/20 text-(--accent)"
										: "border-(--border) bg-(--bg-secondary) text-(--text-secondary) hover:border-(--accent)/50"
								}`}
								key={lang}
								onClick={(e) => {
									toggleFilter("languages", lang);
									if (!prefersReducedMotion() && e.currentTarget) {
										anime({
											targets: e.currentTarget,
											scale: [1, 1.1, 1],
											duration: timing.fast,
											easing: easing.elasticOut,
										});
									}
								}}
								type="button"
							>
								{lang} ({count})
							</button>
						);
					})}
				</div>
			</div>

			{/* Tags */}
			<div>
				<h3 className="mb-3 font-semibold text-(--text-secondary) text-sm">Tech Stack</h3>
				<div className="flex flex-wrap gap-2">
					{availableTags.slice(0, 15).map((tag) => {
						const isActive = activeFilters.tags.includes(tag);
						const count = getCount("tag", tag);
						return (
							<button
								className={`rounded-full border px-4 py-2 text-sm transition-all ${
									isActive
										? "border-(--accent) bg-(--accent)/20 text-(--accent)"
										: "border-(--border) bg-(--bg-secondary) text-(--text-secondary) hover:border-(--accent)/50"
								}`}
								key={tag}
								onClick={(e) => {
									toggleFilter("tags", tag);
									if (!prefersReducedMotion() && e.currentTarget) {
										anime({
											targets: e.currentTarget,
											scale: [1, 1.1, 1],
											duration: timing.fast,
											easing: easing.elasticOut,
										});
									}
								}}
								type="button"
							>
								{tag} ({count})
							</button>
						);
					})}
				</div>
			</div>

			{/* Years */}
			<div>
				<h3 className="mb-3 font-semibold text-(--text-secondary) text-sm">Year</h3>
				<div className="flex flex-wrap gap-2">
					{availableYears.map((year) => {
						const isActive = activeFilters.years.includes(year);
						const count = getCount("year", year);
						return (
							<button
								className={`rounded-full border px-4 py-2 text-sm transition-all ${
									isActive
										? "border-(--accent) bg-(--accent)/20 text-(--accent)"
										: "border-(--border) bg-(--bg-secondary) text-(--text-secondary) hover:border-(--accent)/50"
								}`}
								key={year}
								onClick={(e) => {
									toggleFilter("years", year);
									if (!prefersReducedMotion() && e.currentTarget) {
										anime({
											targets: e.currentTarget,
											scale: [1, 1.1, 1],
											duration: timing.fast,
											easing: easing.elasticOut,
										});
									}
								}}
								type="button"
							>
								{year} ({count})
							</button>
						);
					})}
				</div>
			</div>

			{/* Clear Filters */}
			{hasActiveFilters && (
				<button
					className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-secondary) px-4 py-2 text-(--text-secondary) text-sm transition-colors hover:border-(--accent) hover:text-(--accent)"
					onClick={clearFilters}
					type="button"
				>
					<X className="h-4 w-4" />
					Clear all filters
				</button>
			)}
		</div>
	);
}
