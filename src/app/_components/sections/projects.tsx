"use client";

import { useMemo, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";
import { ProjectCard } from "../project-card";
import { ProjectFilter } from "../project-filter";
import { ProjectSearch } from "../project-search";

export function Projects() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<{
		languages: string[];
		tags: string[];
		years: number[];
	}>({
		languages: [],
		tags: [],
		years: [],
	});

	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		const title = element.querySelector(".section-title");
		if (title) {
			anime({
				targets: title,
				opacity: [0, 1],
				translateY: [-20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
	});

	const {
		data: projects,
		isLoading,
		error,
	} = api.projects.getProjects.useQuery();

	// Filter projects
	const filteredProjects = useMemo(() => {
		if (!projects) return [];

		return projects.filter((project) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					project.name.toLowerCase().includes(query) ||
					project.description.toLowerCase().includes(query) ||
					project.topics.some((topic) => topic.toLowerCase().includes(query));
				if (!matchesSearch) return false;
			}

			// Language filter
			if (filters.languages.length > 0) {
				if (!filters.languages.includes(project.language)) return false;
			}

			// Tag filter
			if (filters.tags.length > 0) {
				const hasMatchingTag = filters.tags.some((tag) =>
					project.topics.includes(tag),
				);
				if (!hasMatchingTag) return false;
			}

			// Year filter
			if (filters.years.length > 0) {
				const projectYear = new Date(project.updated_at).getFullYear();
				if (!filters.years.includes(projectYear)) return false;
			}

			return true;
		});
	}, [projects, searchQuery, filters]);

	// Animate project cards on filter change
	useMemo(() => {
		if (prefersReducedMotion() || !projects) return;

		const cards = document.querySelectorAll(".project-card");
		cards.forEach((card, index) => {
			const isVisible = filteredProjects.some(
				(p) =>
					p.id ===
					Number.parseInt(card.getAttribute("data-project-id") ?? "0", 10),
			);

			if (isVisible) {
				anime({
					targets: card,
					opacity: [0, 1],
					scale: [0.9, 1],
					translateY: [20, 0],
					delay: index * 50,
					duration: timing.normal,
					easing: easing.easeOut,
				});
			} else {
				anime({
					targets: card,
					opacity: [1, 0],
					scale: [1, 0.9],
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
		});
	}, [filteredProjects, projects]);

	return (
		<section
			className="bg-[var(--bg-primary)] py-20 md:py-32"
			id="projects"
			ref={sectionRef}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title mb-16 text-center font-bold text-4xl md:text-5xl"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Projects
				</h2>

				{!isLoading && projects && projects.length > 0 && (
					<>
						<ProjectSearch onSearchChange={setSearchQuery} />
						<ProjectFilter
							activeFilters={filters}
							onFiltersChange={setFilters}
							projects={projects}
						/>
					</>
				)}

				{isLoading && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
								// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array, order never changes
								key={`project-skeleton-${i}`}
							>
								<div className="mb-4 h-6 rounded bg-[var(--border)]" />
								<div className="mb-2 h-4 rounded bg-[var(--border)]" />
								<div className="h-4 w-3/4 rounded bg-[var(--border)]" />
							</div>
						))}
					</div>
				)}

				{error && (
					<div className="text-center text-[var(--text-secondary)]">
						<p>Failed to load projects. Please try again later.</p>
					</div>
				)}

				{filteredProjects && filteredProjects.length > 0 && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredProjects.map((project, index) => (
							<div
								className="project-card"
								data-project-id={project.id}
								key={project.id}
							>
								<ProjectCard index={index} project={project} />
							</div>
						))}
					</div>
				)}

				{!isLoading &&
					!error &&
					projects &&
					projects.length > 0 &&
					filteredProjects.length === 0 && (
						<div className="text-center text-[var(--text-secondary)]">
							<p className="mb-4 text-lg">No projects match your filters.</p>
							<p className="text-sm">Try adjusting your search or filters.</p>
						</div>
					)}

				{!isLoading && !error && (!projects || projects.length === 0) && (
					<div className="text-center text-[var(--text-secondary)]">
						<p>No projects found.</p>
					</div>
				)}
			</div>
		</section>
	);
}
