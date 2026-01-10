"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { experiences } from "~/lib/data/experience";
import { ExperienceCard } from "../experience-card";
import { Timeline } from "../timeline";

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
		<section className="bg-(--bg-secondary) py-20 md:py-32" id="experience" ref={sectionRef}>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title mb-16 text-center font-bold text-4xl md:text-5xl"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Experience
				</h2>

				<div className="relative mx-auto max-w-4xl" data-timeline-container>
					<div className="relative">
						<Timeline itemCount={experiences.length} />

						<div className="space-y-12">
							{experiences.map((experience, index) => (
								<div
									className={`relative pl-20 md:flex md:items-center md:pl-0 ${
										index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
									}`}
									data-experience-card
									key={experience.id}
								>
									<div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
										<ExperienceCard experience={experience} index={index} />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
