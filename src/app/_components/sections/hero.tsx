"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { useScrollTrigger } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import { HeroBackground } from "../hero-background";
import { ArrowDown } from "lucide-react";

const name = "Sachin Sapkota";
const subtitle = "Full-Stack Developer | Next.js & .NET Specialist";
const tagline = "Building scalable web apps from Brampton, Ontario";

export function Hero() {
	const nameRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLDivElement>(null);
	const taglineRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const [subtitleText, setSubtitleText] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		// Animate name letters
		if (nameRef.current) {
			const letters = nameRef.current.children;
			anime({
				targets: letters,
				opacity: [0, 1],
				translateY: [30, 0],
				delay: anime.stagger(50, { start: 200 }),
				duration: timing.normal,
				easing: easing.elasticOut,
			});
		}

		// Start typing effect after name animation
		setTimeout(() => {
			if (subtitleRef.current) {
				let currentIndex = 0;
				const chars = subtitle.split("");

				const typeChar = () => {
					if (currentIndex < chars.length) {
						setSubtitleText(subtitle.slice(0, currentIndex + 1));
						currentIndex++;
						setTimeout(typeChar, 50);
					} else {
						setShowCursor(false);
						// Animate tagline
						if (taglineRef.current) {
							anime({
								targets: taglineRef.current,
								opacity: [0, 1],
								translateY: [20, 0],
								duration: timing.normal,
								easing: easing.easeOut,
							});
						}
						// Animate buttons
						if (buttonsRef.current) {
							anime({
								targets: buttonsRef.current.children,
								opacity: [0, 1],
								scale: [0.8, 1],
								delay: anime.stagger(100),
								duration: timing.normal,
								easing: easing.elasticOut,
							});
						}
					}
				};

				typeChar();
			}
		}, 600);
	});

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<section
			ref={sectionRef}
			id="hero"
			className="relative min-h-screen flex items-center justify-center overflow-hidden"
		>
			<HeroBackground />
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center">
					{/* Name */}
					<h1
						ref={nameRef}
						className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6"
					>
						{name.split("").map((char, index) => (
							<span
								key={index}
								className="inline-block"
								style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
							>
								{char === " " ? "\u00A0" : char}
							</span>
						))}
					</h1>

					{/* Subtitle with typing effect */}
					<div
						ref={subtitleRef}
						className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 text-[var(--text-secondary)] min-h-[2em]"
					>
						{subtitleText}
						{showCursor && (
							<span className="inline-block w-0.5 h-[1em] bg-[var(--accent)] ml-1 animate-pulse" />
						)}
					</div>

					{/* Tagline */}
					<p
						ref={taglineRef}
						className="text-lg sm:text-xl text-[var(--text-secondary)] mb-12"
						style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
					>
						{tagline}
					</p>

					{/* CTA Buttons */}
					<div
						ref={buttonsRef}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
					>
						<button
							type="button"
							onClick={() => scrollToSection("projects")}
							className="px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors transform hover:scale-105 active:scale-95"
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
						>
							View Projects
						</button>
						<button
							type="button"
							onClick={() => scrollToSection("contact")}
							className="px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-lg font-semibold hover:bg-[var(--accent)]/10 transition-colors transform hover:scale-105 active:scale-95"
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
						>
							Contact Me
						</button>
					</div>

					{/* Scroll indicator */}
					<div className="mt-16 animate-bounce">
						<ArrowDown className="w-6 h-6 mx-auto text-[var(--text-secondary)]" />
					</div>
				</div>
			</div>
		</section>
	);
}
