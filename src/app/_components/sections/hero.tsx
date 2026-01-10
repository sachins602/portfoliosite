"use client";

import { ArrowDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { HeroBackground } from "../hero-background";

const name = "Sachin Sapkota";
const subtitle = "Full-Stack Developer | Next.js & .NET Specialist";
const tagline = "Building scalable web apps from Brampton, Ontario";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export function Hero() {
	const nameRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLDivElement>(null);
	const taglineRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const greetingRef = useRef<HTMLDivElement>(null);
	const [subtitleText, setSubtitleText] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const [greeting] = useState(getGreeting);
	const hasAnimated = useRef(false);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Memoize the animation callback to prevent re-triggering
	const animationCallback = useCallback((_element: HTMLElement) => {
		if (prefersReducedMotion() || hasAnimated.current) return;
		hasAnimated.current = true;

		// Animate greeting
		if (greetingRef.current) {
			anime({
				targets: greetingRef.current,
				opacity: [0, 1],
				translateY: [20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}

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
		typingTimeoutRef.current = setTimeout(() => {
			if (subtitleRef.current) {
				let currentIndex = 0;
				const chars = subtitle.split("");

				const typeChar = () => {
					if (currentIndex < chars.length) {
						setSubtitleText(subtitle.slice(0, currentIndex + 1));
						currentIndex++;
						typingTimeoutRef.current = setTimeout(typeChar, 50);
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
	}, []);

	const sectionRef = useScrollTrigger<HTMLElement>(animationCallback, {
		once: true,
		threshold: 0.1,
	});

	// Cleanup typing timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<section
			className="relative flex min-h-screen items-center justify-center overflow-hidden"
			id="hero"
			ref={sectionRef}
		>
			<HeroBackground />
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					{/* Greeting */}
					<div
						className="mb-4 text-[var(--text-secondary)] text-lg sm:text-xl"
						ref={greetingRef}
						style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
					>
						{greeting}!
					</div>

					{/* Name */}
					<h1
						className="mb-6 font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
						ref={nameRef}
					>
						{name.split("").map((char, index) => (
							<span
								className="inline-block"
								key={index}
								style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
							>
								{char === " " ? "\u00A0" : char}
							</span>
						))}
					</h1>

					{/* Subtitle with typing effect */}
					<div
						className="mb-4 min-h-[2em] font-medium text-[var(--text-secondary)] text-xl sm:text-2xl md:text-3xl"
						ref={subtitleRef}
					>
						{subtitleText}
						{showCursor && (
							<span className="ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-[var(--accent)]" />
						)}
					</div>

					{/* Tagline */}
					<p
						className="mb-12 text-[var(--text-secondary)] text-lg sm:text-xl"
						ref={taglineRef}
						style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
					>
						{tagline}
					</p>

					{/* CTA Buttons */}
					<div
						className="flex flex-col items-center justify-center gap-4 sm:flex-row"
						ref={buttonsRef}
					>
						<button
							className="transform rounded-lg bg-[var(--accent)] px-8 py-4 font-semibold text-white transition-colors hover:scale-105 hover:bg-[var(--accent-hover)] active:scale-95"
							onClick={() => scrollToSection("projects")}
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
							type="button"
						>
							View Projects
						</button>
						<button
							className="transform rounded-lg border-2 border-[var(--accent)] px-8 py-4 font-semibold text-[var(--accent)] transition-colors hover:scale-105 hover:bg-[var(--accent)]/10 active:scale-95"
							onClick={() => scrollToSection("contact")}
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
							type="button"
						>
							Contact Me
						</button>
					</div>

					{/* Scroll indicator */}
					<div className="mt-16 animate-bounce">
						<ArrowDown className="mx-auto h-6 w-6 text-[var(--text-secondary)]" />
					</div>
				</div>
			</div>
		</section>
	);
}
