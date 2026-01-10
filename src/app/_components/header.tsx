"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useElasticHover } from "~/hooks/use-anime";
import { prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
	{ href: "#about", label: "About" },
	{ href: "#experience", label: "Experience" },
	{ href: "#projects", label: "Projects" },
	{ href: "#contact", label: "Contact" },
];

export function Header() {
	const [activeSection, setActiveSection] = useState("");
	const [logoClickCount, setLogoClickCount] = useState(0);
	const logoRef = useRef<SVGPathElement>(null);
	const logoContainerRef = useElasticHover<HTMLAnchorElement>();

	useEffect(() => {
		// Load click count from localStorage
		const savedCount = localStorage.getItem("logoClickCount");
		if (savedCount) {
			setLogoClickCount(Number.parseInt(savedCount, 10));
		}

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

	const handleNavClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		e.preventDefault();
		const targetId = href.slice(1);
		const element = document.getElementById(targetId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		const newCount = logoClickCount + 1;
		setLogoClickCount(newCount);
		localStorage.setItem("logoClickCount", newCount.toString());

		if (newCount === 10) {
			triggerLogoSurprise();
			setLogoClickCount(0);
			localStorage.setItem("logoClickCount", "0");
		}
	};

	const triggerLogoSurprise = () => {
		if (prefersReducedMotion()) return;

		// Create confetti effect
		const colors = ["#818cf8", "#4fc1ff", "#4ec9b0", "#ffbd2e", "#ff5f56"];
		const confetti: Array<{
			element: HTMLDivElement;
			x: number;
			y: number;
			vx: number;
			vy: number;
			color: string;
		}> = [];

		for (let i = 0; i < 50; i++) {
			const particle = document.createElement("div");
			particle.style.cssText = `
				position: fixed;
				width: 8px;
				height: 8px;
				background: ${colors[Math.floor(Math.random() * colors.length)]};
				border-radius: 50%;
				pointer-events: none;
				z-index: 10000;
			`;
			document.body.appendChild(particle);

			confetti.push({
				element: particle,
				x: window.innerWidth / 2,
				y: 100,
				vx: (Math.random() - 0.5) * 10,
				vy: Math.random() * 5 + 2,
				color: colors[Math.floor(Math.random() * colors.length)] ?? "#818cf8",
			});
		}

		// Animate confetti
		const animate = () => {
			confetti.forEach((particle) => {
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.vy += 0.3; // gravity

				particle.element.style.left = `${particle.x}px`;
				particle.element.style.top = `${particle.y}px`;
				particle.element.style.opacity = String(
					Math.max(0, 1 - (particle.y / window.innerHeight) * 2),
				);
			});

			if (confetti.some((p) => p.y < window.innerHeight + 100)) {
				requestAnimationFrame(animate);
			} else {
				for (const particle of confetti) {
					particle.element.remove();
				}
			}
		};

		animate();

		// Show message
		const message = document.createElement("div");
		message.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: var(--bg-primary);
			border: 2px solid var(--accent);
			padding: 24px 32px;
			border-radius: 12px;
			color: var(--accent);
			font-weight: bold;
			font-size: 18px;
			z-index: 10001;
			box-shadow: 0 8px 24px rgba(0,0,0,0.3);
			text-align: center;
		`;
		message.textContent = "🎉 You found the easter egg! 🎉";
		document.body.appendChild(message);

		anime({
			targets: message,
			opacity: [0, 1],
			scale: [0.5, 1],
			duration: timing.normal,
			easing: "spring(1, 80, 10, 0)",
		});

		setTimeout(() => {
			anime({
				targets: message,
				opacity: [1, 0],
				scale: [1, 0.8],
				duration: timing.normal,
				complete: () => message.remove(),
			});
		}, 3000);
	};

	return (
		<header className="fixed top-0 right-0 left-0 z-50 border-[var(--border)] border-b bg-[var(--bg-primary)]/80 backdrop-blur-md">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between md:h-20">
					{/* Logo */}
					<Link
						className="flex items-center gap-2 font-bold text-xl md:text-2xl"
						href="#"
						onClick={handleLogoClick}
						ref={logoContainerRef}
					>
						<svg
							aria-label="Portfolio logo"
							className="text-[var(--accent)]"
							height="32"
							role="img"
							viewBox="0 0 100 100"
							width="32"
						>
							<path
								d="M20,20 L20,80 L80,80 L80,20 Z M30,30 L30,70 L70,70 L70,30 Z"
								fill="none"
								ref={logoRef}
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="3"
							/>
						</svg>
						<span className="hidden sm:inline">Sachin Sapkota</span>
						<span className="sm:hidden">SS</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-8 md:flex">
						{navLinks.map((link) => {
							const sectionId = link.href.slice(1);
							const isActive = activeSection === sectionId;
							return (
								<Link
									className={`relative font-medium transition-colors hover:text-[var(--accent)] ${
										isActive ? "text-[var(--accent)]" : ""
									}`}
									href={link.href}
									key={link.href}
									onClick={(e) => handleNavClick(e, link.href)}
								>
									{link.label}
									{isActive && (
										<span className="absolute right-0 -bottom-1 left-0 h-0.5 bg-[var(--accent)]" />
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
