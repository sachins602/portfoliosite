"use client";

import { useEffect, useRef, useState } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

export function ScrollProgress() {
	const [progress, setProgress] = useState(0);
	const [currentSection, setCurrentSection] = useState("");
	const progressRef = useRef<HTMLDivElement>(null);

	const sections = [
		{ id: "hero", name: "Home" },
		{ id: "about", name: "About" },
		{ id: "experience", name: "Experience" },
		{ id: "projects", name: "Projects" },
		{ id: "contact", name: "Contact" },
	];

	useEffect(() => {
		const handleScroll = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY;
			const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

			setProgress(Math.min(100, Math.max(0, scrollPercentage)));

			// Determine current section
			const scrollPosition = scrollTop + windowHeight / 2;
			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setCurrentSection(section.name);
						break;
					}
				}
			}
		};

		// Throttle scroll events
		let ticking = false;
		const throttledScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", throttledScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", throttledScroll);
	}, []);

	// Animate progress bar
	useEffect(() => {
		if (!progressRef.current || prefersReducedMotion()) return;

		anime({
			targets: progressRef.current,
			width: `${progress}%`,
			duration: timing.fast,
			easing: easing.easeOut,
		});
	}, [progress]);

	return (
		<div className="fixed top-0 right-0 left-0 z-50 h-1 bg-(--bg-secondary)">
			<div
				className="h-full bg-(--accent) transition-all"
				ref={progressRef}
				style={{
					width: prefersReducedMotion() ? `${progress}%` : "0%",
				}}
			/>
			{currentSection && <div className="absolute top-2 right-4 text-(--text-secondary) text-xs">{currentSection}</div>}
		</div>
	);
}
