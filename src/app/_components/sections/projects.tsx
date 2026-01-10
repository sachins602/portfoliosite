"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
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

	const {
		data: projects,
		isLoading,
		error,
	} = api.projects.getProjects.useQuery();

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

				{isLoading && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
								key={i}
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

				{projects && projects.length > 0 && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project, index) => (
							<ProjectCard index={index} key={project.id} project={project} />
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
