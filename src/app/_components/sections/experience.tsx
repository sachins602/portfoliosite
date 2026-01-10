"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import anime from "animejs";
import { experiences } from "~/lib/data/experience";
import { Timeline } from "../timeline";
import { ExperienceCard } from "../experience-card";

export function Experience() {
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

	return (
		<section
			ref={sectionRef}
			id="experience"
			className="py-20 md:py-32 bg-[var(--bg-secondary)]"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title text-4xl md:text-5xl font-bold mb-16 text-center"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Experience
				</h2>

				<div className="relative max-w-4xl mx-auto">
					<Timeline itemCount={experiences.length} />

					<div className="space-y-12">
						{experiences.map((experience, index) => (
							<div
								key={experience.id}
								className={`relative pl-20 md:pl-0 md:flex md:items-center ${
									index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
								}`}
							>
								<div
									className={`md:w-1/2 ${
										index % 2 === 0 ? "md:pr-12" : "md:pl-12"
									}`}
								>
									<ExperienceCard experience={experience} index={index} />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
