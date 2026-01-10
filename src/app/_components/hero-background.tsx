"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "~/lib/animations";
import anime from "~/lib/anime";

export function HeroBackground() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || prefersReducedMotion()) return;

		const container = containerRef.current;
		const particleCount = 30;

		// Create particles
		const particles: HTMLDivElement[] = [];
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement("div");
			particle.className = "absolute rounded-full bg-[var(--accent)]/20";
			particle.style.width = `${Math.random() * 4 + 2}px`;
			particle.style.height = particle.style.width;
			particle.style.left = `${Math.random() * 100}%`;
			particle.style.top = `${Math.random() * 100}%`;
			container.appendChild(particle);
			particles.push(particle);
		}

		// Animate particles
		particles.forEach((particle, index) => {
			const duration = 3000 + Math.random() * 2000;
			const delay = index * 100;

			anime({
				targets: particle,
				translateX: [
					{ value: Math.random() * 200 - 100 },
					{ value: Math.random() * 200 - 100 },
				],
				translateY: [
					{ value: Math.random() * 200 - 100 },
					{ value: Math.random() * 200 - 100 },
				],
				opacity: [{ value: 0.1 }, { value: 0.3 }, { value: 0.1 }],
				duration,
				delay,
				easing: "easeInOutSine",
				loop: true,
				direction: "alternate",
			});
		});

		return () => {
			particles.forEach((particle) => particle.remove());
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
			ref={containerRef}
		/>
	);
}
