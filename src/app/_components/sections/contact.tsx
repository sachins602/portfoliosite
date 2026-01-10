"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { useElasticHover } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import anime from "animejs";
import { ContactForm } from "../contact-form";
import { Mail, Github, Linkedin, Download } from "lucide-react";

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
		<section
			ref={sectionRef}
			id="contact"
			className="py-20 md:py-32 bg-[var(--bg-secondary)]"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title text-4xl md:text-5xl font-bold mb-16 text-center"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					Contact Me
				</h2>

				<div className="section-content grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
					{/* Contact Form */}
					<div>
						<ContactForm />
					</div>

					{/* Contact Info & Social */}
					<div className="space-y-8">
						<div>
							<h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
							<p className="text-[var(--text-secondary)] mb-6">
								I'm always open to discussing new projects, creative ideas, or
								opportunities to be part of your visions. Feel free to reach out
								through the form or any of the links below.
							</p>
						</div>

						<div className="space-y-4">
							<a
								ref={emailRef}
								href="mailto:sachinsapkota4@gmail.com"
								className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 transition-colors group"
							>
								<Mail className="w-6 h-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
								<div>
									<p className="font-medium">Email</p>
									<p className="text-sm text-[var(--text-secondary)]">
										sachinsapkota4@gmail.com
									</p>
								</div>
							</a>

							<a
								ref={githubRef}
								href="https://github.com/sachins602"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 transition-colors group"
							>
								<Github className="w-6 h-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
								<div>
									<p className="font-medium">GitHub</p>
									<p className="text-sm text-[var(--text-secondary)]">
										github.com/sachins602
									</p>
								</div>
							</a>

							<a
								ref={linkedinRef}
								href="https://linkedin.com/in/sachin-sapkota"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/80 transition-colors group"
							>
								<Linkedin className="w-6 h-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
								<div>
									<p className="font-medium">LinkedIn</p>
									<p className="text-sm text-[var(--text-secondary)]">
										Connect with me
									</p>
								</div>
							</a>
						</div>

						<a
							ref={resumeRef}
							href="/resume.pdf"
							download
							className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors group"
						>
							<Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
							<span>Download Resume</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
