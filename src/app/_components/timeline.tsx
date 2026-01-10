"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

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
	}, []);

	return (
		<div className="relative">
			{/* SVG Line */}
			<svg
				aria-label="Timeline line"
				className="absolute top-0 bottom-0 left-8 w-0.5 md:left-1/2 md:-translate-x-0.5"
				role="img"
				style={{ height: "100%" }}
			>
				<line
					ref={lineRef}
					stroke="var(--accent)"
					strokeDasharray="0"
					strokeDashoffset="0"
					strokeWidth="2"
					x1="0"
					x2="0"
					y1="0"
					y2="100%"
				/>
			</svg>

			{/* Nodes */}
			<div className="relative" ref={nodesRef}>
				{/* biome-ignore lint/suspicious/noArrayIndexKey: Static timeline nodes, order never changes */}
				{Array.from({ length: itemCount }).map((_, index) => (
					<div
						className="absolute left-6 z-10 h-4 w-4 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent)] md:left-1/2 md:-translate-x-1/2"
						key={`timeline-node-${index}`}
						style={{
							top: `${(index / (itemCount - 1)) * 100}%`,
							opacity: prefersReducedMotion() ? 1 : 0,
							transform: prefersReducedMotion() ? "scale(1)" : "scale(0)",
						}}
					/>
				))}
			</div>
		</div>
	);
}
