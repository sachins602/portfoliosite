"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "~/lib/animations";

interface ParallaxBackgroundProps {
	layers?: number;
	intensity?: number;
	className?: string;
}

export function ParallaxBackground({
	layers = 3,
	intensity = 0.5,
	className = "",
}: ParallaxBackgroundProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || prefersReducedMotion()) {
			return;
		}

		const handleScroll = () => {
			if (!containerRef.current) return;

			const scrollY = window.scrollY;
			const layers = containerRef.current.children;

			Array.from(layers).forEach((layer, index) => {
				const speed = (index + 1) * intensity * 0.1;
				const yPos = scrollY * speed;
				(layer as HTMLElement).style.transform = `translateY(${yPos}px)`;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [intensity]);

	if (prefersReducedMotion()) {
		return null;
	}

	return (
		<div
			className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
			ref={containerRef}
		>
			{Array.from({ length: layers }).map((_, index) => (
				<div
					className="absolute inset-0 opacity-20"
					// biome-ignore lint/suspicious/noArrayIndexKey: Static parallax layers, order never changes
					key={`parallax-layer-${index}`}
					style={{
						background: `radial-gradient(circle at ${20 + index * 30}% ${30 + index * 20}%, var(--accent) 0%, transparent 50%)`,
						transform: `translateY(0)`,
						willChange: "transform",
					}}
				/>
			))}
		</div>
	);
}
