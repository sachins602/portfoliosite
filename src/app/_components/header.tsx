"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import anime from "animejs";
import { useElasticHover } from "~/hooks/use-anime";
import { prefersReducedMotion, timing } from "~/lib/animations";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const navLinks = [
	{ href: "#about", label: "About" },
	{ href: "#experience", label: "Experience" },
	{ href: "#projects", label: "Projects" },
	{ href: "#contact", label: "Contact" },
];

export function Header() {
	const [activeSection, setActiveSection] = useState("");
	const logoRef = useRef<SVGPathElement>(null);
	const logoContainerRef = useElasticHover<HTMLAnchorElement>();

	useEffect(() => {
		// Animate logo on load
		if (logoRef.current && !prefersReducedMotion()) {
			const path = logoRef.current;
			const pathLength = path.getTotalLength();
			path.style.strokeDasharray = `${pathLength}`;
			path.style.strokeDashoffset = `${pathLength}`;

			anime({
				targets: path,
				strokeDashoffset: [pathLength, 0],
				duration: timing.slow,
				delay: 200,
				easing: "spring(1, 80, 10, 0)",
				complete: () => {
					path.style.strokeDashoffset = "0";
					path.style.fill = "currentColor";
				},
			});
		}

		// Track active section on scroll
		const handleScroll = () => {
			const sections = navLinks.map((link) => link.href.slice(1));
			const scrollPosition = window.scrollY + 100;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (
						scrollPosition >= offsetTop &&
						scrollPosition < offsetTop + offsetHeight
					) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault();
		const targetId = href.slice(1);
		const element = document.getElementById(targetId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link
						ref={logoContainerRef}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						className="flex items-center gap-2 font-bold text-xl md:text-2xl"
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 100 100"
							className="text-[var(--accent)]"
						>
							<path
								ref={logoRef}
								d="M20,20 L20,80 L80,80 L80,20 Z M30,30 L30,70 L70,70 L70,30 Z"
								stroke="currentColor"
								strokeWidth="3"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span className="hidden sm:inline">Sachin Sapkota</span>
						<span className="sm:hidden">SS</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => {
							const sectionId = link.href.slice(1);
							const isActive = activeSection === sectionId;
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={(e) => handleNavClick(e, link.href)}
									className={`relative font-medium transition-colors hover:text-[var(--accent)] ${
										isActive ? "text-[var(--accent)]" : ""
									}`}
								>
									{link.label}
									{isActive && (
										<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent)]" />
									)}
								</Link>
							);
						})}
					</nav>

					{/* Theme Toggle & Mobile Menu */}
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<MobileMenu />
					</div>
				</div>
			</div>
		</header>
	);
}
