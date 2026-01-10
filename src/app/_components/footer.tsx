"use client";

import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

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
			className="border-[var(--border)] border-t bg-[var(--bg-primary)] py-12"
			ref={footerRef}
			style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Brand */}
					<div>
						<h3 className="mb-4 font-bold text-xl">Sachin Sapkota</h3>
						<p className="text-[var(--text-secondary)] text-sm">
							Full-Stack Developer building scalable web applications.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold text-sm">Quick Links</h4>
						<nav className="flex flex-col gap-2">
							{navLinks.map((link) => (
								<Link
									className="text-[var(--text-secondary)] text-sm transition-colors hover:text-[var(--accent)]"
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Social */}
					<div>
						<h4 className="mb-4 font-semibold text-sm">Connect</h4>
						<div className="flex gap-4">
							<a
								aria-label="GitHub"
								className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-secondary)]"
								href="https://github.com/sachins602"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Github className="h-5 w-5 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]" />
							</a>
							<a
								aria-label="LinkedIn"
								className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-secondary)]"
								href="https://linkedin.com/in/sachin-sapkota"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Linkedin className="h-5 w-5 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]" />
							</a>
							<a
								aria-label="Email"
								className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-secondary)]"
								href="mailto:sachinsapkota4@gmail.com"
							>
								<Mail className="h-5 w-5 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]" />
							</a>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-[var(--border)] border-t pt-8 sm:flex-row">
					<p className="text-[var(--text-secondary)] text-sm">
						© {new Date().getFullYear()} Sachin Sapkota. All rights reserved.
					</p>
					<button
						aria-label="Back to top"
						className="flex items-center gap-2 rounded-lg px-4 py-2 text-[var(--text-secondary)] text-sm transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]"
						onClick={scrollToTop}
						type="button"
					>
						<ArrowUp className="h-4 w-4" />
						<span>Back to top</span>
					</button>
				</div>
			</div>
		</footer>
	);
}
