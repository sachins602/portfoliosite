"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { prefersReducedMotion, timing } from "~/lib/animations";

interface TimelineProps {
	itemCount: number;
}

export function Timeline({ itemCount }: TimelineProps) {
	const lineRef = useRef<SVGLineElement>(null);
	const nodesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!lineRef.current || !nodesRef.current || prefersReducedMotion()) {
			if (lineRef.current) {
				lineRef.current.style.strokeDashoffset = "0";
			}
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && lineRef.current) {
						const line = lineRef.current;
						const lineLength = line.getTotalLength();
						line.style.strokeDasharray = `${lineLength}`;
						line.style.strokeDashoffset = `${lineLength}`;

						anime({
							targets: line,
							strokeDashoffset: [lineLength, 0],
							duration: timing.slow * 2,
							easing: "easeOutQuad",
							complete: () => {
								line.style.strokeDashoffset = "0";
							},
						});

						// Animate nodes
						if (nodesRef.current) {
							const nodes = nodesRef.current.children;
							anime({
								targets: nodes,
								scale: [0, 1],
								opacity: [0, 1],
								delay: anime.stagger(200),
								duration: timing.normal,
								easing: "spring(1, 80, 10, 0)",
							});
						}

						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(nodesRef.current);

		return () => {
			if (nodesRef.current) {
				observer.unobserve(nodesRef.current);
			}
		};
	}, [itemCount]);

	return (
		<div className="relative">
			{/* SVG Line */}
			<svg
				className="absolute left-8 top-0 bottom-0 w-0.5 md:left-1/2 md:-translate-x-0.5"
				style={{ height: "100%" }}
			>
				<line
					ref={lineRef}
					x1="0"
					y1="0"
					x2="0"
					y2="100%"
					stroke="var(--accent)"
					strokeWidth="2"
					strokeDasharray="0"
					strokeDashoffset="0"
				/>
			</svg>

			{/* Nodes */}
			<div ref={nodesRef} className="relative">
				{Array.from({ length: itemCount }).map((_, index) => (
					<div
						key={index}
						className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-[var(--bg-primary)] z-10"
						style={{
							top: `${(index / (itemCount - 1)) * 100}%`,
							opacity: prefersReducedMotion() ? 1 : 0,
							transform: prefersReducedMotion()
								? "scale(1)"
								: "scale(0)",
						}}
					/>
				))}
			</div>
		</div>
	);
}
