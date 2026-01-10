"use client";

import { useScrollTrigger } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import anime from "animejs";
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

const navLinks = [
	{ href: "#about", label: "About" },
	{ href: "#experience", label: "Experience" },
	{ href: "#projects", label: "Projects" },
	{ href: "#contact", label: "Contact" },
];

export function Footer() {
	const footerRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		anime({
			targets: element,
			opacity: [0, 1],
			translateY: [20, 0],
			duration: timing.normal,
			easing: easing.easeOut,
		});
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer
			ref={footerRef}
			className="py-12 bg-[var(--bg-primary)] border-t border-[var(--border)]"
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Brand */}
					<div>
						<h3 className="text-xl font-bold mb-4">Sachin Sapkota</h3>
						<p className="text-sm text-[var(--text-secondary)]">
							Full-Stack Developer building scalable web applications.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-sm font-semibold mb-4">Quick Links</h4>
						<nav className="flex flex-col gap-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Social */}
					<div>
						<h4 className="text-sm font-semibold mb-4">Connect</h4>
						<div className="flex gap-4">
							<a
								href="https://github.com/sachins602"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
								aria-label="GitHub"
							>
								<Github className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" />
							</a>
							<a
								href="https://linkedin.com/in/sachin-sapkota"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" />
							</a>
							<a
								href="mailto:sachinsapkota4@gmail.com"
								className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
								aria-label="Email"
							>
								<Mail className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" />
							</a>
						</div>
					</div>
				</div>

				<div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-[var(--text-secondary)]">
						© {new Date().getFullYear()} Sachin Sapkota. All rights reserved.
					</p>
					<button
						type="button"
						onClick={scrollToTop}
						className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
						aria-label="Back to top"
					>
						<ArrowUp className="w-4 h-4" />
						<span>Back to top</span>
					</button>
				</div>
			</div>
		</footer>
	);
}
