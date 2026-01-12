"use client";

import { Download, Github, Linkedin, Mail } from "lucide-react";
import { useElasticHover, useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { ContactForm } from "../features/contact-form";

export function Contact() {
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

	const githubRef = useElasticHover<HTMLAnchorElement>();
	const linkedinRef = useElasticHover<HTMLAnchorElement>();
	const emailRef = useElasticHover<HTMLAnchorElement>();
	const resumeRef = useElasticHover<HTMLAnchorElement>();

	return (
		<section className="bg-(--bg-secondary) py-20 md:py-32" id="contact" ref={sectionRef}>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title mb-16 text-center font-bold text-4xl md:text-5xl"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Contact Me
				</h2>

				<div className="section-content mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
					{/* Contact Form */}
					<div>
						<ContactForm />
					</div>

					{/* Contact Info & Social */}
					<div className="space-y-8">
						<div>
							<h3 className="mb-4 font-semibold text-2xl">Get in Touch</h3>
							<p className="mb-6 text-(--text-secondary)">
								I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel
								free to reach out through the form or any of the links below.
							</p>
						</div>

						<div className="space-y-4">
							<a
								className="group flex items-center gap-4 rounded-lg bg-(--bg-primary) p-4 transition-colors hover:bg-(--bg-primary)/80"
								href="mailto:sachinsapkota4@gmail.com"
								ref={emailRef}
							>
								<Mail className="h-6 w-6 text-(--accent) transition-transform group-hover:scale-110" />
								<div>
									<p className="font-medium">Email</p>
									<p className="text-(--text-secondary) text-sm">sachinsapkota4@gmail.com</p>
								</div>
							</a>

							<a
								className="group flex items-center gap-4 rounded-lg bg-(--bg-primary) p-4 transition-colors hover:bg-(--bg-primary)/80"
								href="https://github.com/sachins602"
								ref={githubRef}
								rel="noopener noreferrer"
								target="_blank"
							>
								<Github className="h-6 w-6 text-(--accent) transition-transform group-hover:scale-110" />
								<div>
									<p className="font-medium">GitHub</p>
									<p className="text-(--text-secondary) text-sm">github.com/sachins602</p>
								</div>
							</a>

							<a
								className="group flex items-center gap-4 rounded-lg bg-(--bg-primary) p-4 transition-colors hover:bg-(--bg-primary)/80"
								href="https://www.linkedin.com/in/sachin-sapkota-97b467107/"
								ref={linkedinRef}
								rel="noopener noreferrer"
								target="_blank"
							>
								<Linkedin className="h-6 w-6 text-(--accent) transition-transform group-hover:scale-110" />
								<div>
									<p className="font-medium">LinkedIn</p>
									<p className="text-(--text-secondary) text-sm">Connect with me</p>
								</div>
							</a>
						</div>

						<a
							className="group flex items-center justify-center gap-3 rounded-lg bg-(--accent) px-6 py-4 font-semibold text-white transition-colors hover:bg-(--accent-hover)"
							download
							href="/resume.pdf"
							ref={resumeRef}
						>
							<Download className="h-5 w-5 transition-transform group-hover:scale-110" />
							<span>Download Resume</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
