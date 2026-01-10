"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import anime from "animejs";
import { api } from "~/trpc/react";
import { ProjectCard } from "../project-card";

export function Projects() {
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

	const { data: projects, isLoading, error } = api.projects.getProjects.useQuery();

	return (
		<section
			ref={sectionRef}
			id="projects"
			className="py-20 md:py-32 bg-[var(--bg-primary)]"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title text-4xl md:text-5xl font-bold mb-16 text-center"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Projects
				</h2>

				{isLoading && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="p-6 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] animate-pulse"
							>
								<div className="h-6 bg-[var(--border)] rounded mb-4" />
								<div className="h-4 bg-[var(--border)] rounded mb-2" />
								<div className="h-4 bg-[var(--border)] rounded w-3/4" />
							</div>
						))}
					</div>
				)}

				{error && (
					<div className="text-center text-[var(--text-secondary)]">
						<p>Failed to load projects. Please try again later.</p>
					</div>
				)}

				{projects && projects.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{projects.map((project, index) => (
							<ProjectCard key={project.id} project={project} index={index} />
						))}
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
