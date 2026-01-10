"use client";

import { useRef } from "react";
import { MapPin, Mail, Github, Linkedin } from "lucide-react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { useElasticHover } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import anime from "animejs";
import { SkillsGrid } from "../skills-grid";

export function About() {
	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		const title = element.querySelector(".section-title");
		const content = element.querySelector(".section-content");

		if (title) {
			anime({
				targets: title,
				opacity: [0, 1],
				translateY: [-20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}

		if (content) {
			anime({
				targets: content,
				opacity: [0, 1],
				translateY: [30, 0],
				delay: 200,
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
	});

	const emailRef = useElasticHover<HTMLAnchorElement>();
	const githubRef = useElasticHover<HTMLAnchorElement>();
	const linkedinRef = useElasticHover<HTMLAnchorElement>();

	return (
		<section
			ref={sectionRef}
			id="about"
			className="py-20 md:py-32 bg-[var(--bg-primary)]"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title text-4xl md:text-5xl font-bold mb-12 text-center"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					About Me
				</h2>

				<div className="section-content grid md:grid-cols-2 gap-12">
					{/* Bio */}
					<div>
						<div className="space-y-4 text-[var(--text-secondary)]">
							<p>
								I'm a passionate Full-Stack Developer with expertise in building
								scalable web applications using modern technologies. My primary
								focus is on Next.js, React, TypeScript, and .NET, creating
								performant and user-friendly solutions.
							</p>
							<p>
								With experience in both frontend and backend development, I
								specialize in creating seamless user experiences while ensuring
								robust server-side architecture. I'm well-versed in cloud
								integrations, database design, and DevOps practices.
							</p>
							<p>
								Based in Brampton, Ontario, Canada, I'm open to remote
								opportunities and ready to contribute to innovative projects that
								push the boundaries of web development.
							</p>
						</div>

						{/* Contact Info */}
						<div className="mt-8 space-y-4">
							<div className="flex items-center gap-3 text-[var(--text-secondary)]">
								<MapPin className="w-5 h-5 text-[var(--accent)]" />
								<span>Brampton, Ontario, Canada</span>
							</div>
							<a
								ref={emailRef}
								href="mailto:sachinsapkota4@gmail.com"
								className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
							>
								<Mail className="w-5 h-5 text-[var(--accent)]" />
								<span>sachinsapkota4@gmail.com</span>
							</a>
							<a
								ref={githubRef}
								href="https://github.com/sachins602"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
							>
								<Github className="w-5 h-5 text-[var(--accent)]" />
								<span>github.com/sachins602</span>
							</a>
							<a
								ref={linkedinRef}
								href="https://linkedin.com/in/sachin-sapkota"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
							>
								<Linkedin className="w-5 h-5 text-[var(--accent)]" />
								<span>LinkedIn Profile</span>
							</a>
						</div>
					</div>

					{/* Skills */}
					<div>
						<h3 className="text-2xl font-semibold mb-6">Skills & Technologies</h3>
						<SkillsGrid />
					</div>
				</div>
			</div>
		</section>
	);
}
