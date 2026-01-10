"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

interface TimelineProps {
	itemCount: number;
}

export function Timeline({ itemCount }: TimelineProps) {
	const lineRef = useRef<SVGLineElement>(null);
	const nodesRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [nodePositions, setNodePositions] = useState<number[]>([]);

	// Calculate node positions based on actual card positions
	useEffect(() => {
		const updatePositions = () => {
			if (!containerRef.current) return;

			const timelineContainer = containerRef.current;
			const parentContainer = timelineContainer.parentElement as HTMLElement;
			if (!parentContainer) return;

			// Get the cards container (the div with space-y-12)
			const cardsContainer = parentContainer.querySelector(".space-y-12") as HTMLElement;
			if (!cardsContainer) return;

			// Use offsetHeight for consistent measurement
			const parentHeight = Math.max(
				parentContainer.offsetHeight,
				parentContainer.scrollHeight,
				cardsContainer.offsetHeight,
			);
			
			if (parentHeight === 0) return;

			const positions: number[] = [];

			// Find all experience card containers
			const cards = Array.from(
				parentContainer.querySelectorAll<HTMLElement>("[data-experience-card]"),
			);

			// Get the offset of the cards container relative to parent
			const cardsContainerOffset = cardsContainer.offsetTop;

			cards.forEach((card) => {
				// Calculate position relative to parent container
				// card.offsetTop is relative to cardsContainer, so add cardsContainerOffset
				const cardTop = cardsContainerOffset + card.offsetTop;
				const cardHeight = card.offsetHeight;
				const cardCenter = cardTop + cardHeight / 2;
				const relativePosition = (cardCenter / parentHeight) * 100;
				positions.push(Math.max(0, Math.min(100, relativePosition)));
			});

			if (positions.length > 0) {
				setNodePositions(positions);
			}
		};

		// Initial calculation with multiple attempts to ensure DOM is ready
		const timeoutId = setTimeout(updatePositions, 100);
		const timeoutId2 = setTimeout(updatePositions, 300);
		const timeoutId3 = setTimeout(updatePositions, 500);

		// Update on resize
		const resizeObserver = new ResizeObserver(updatePositions);

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		const parentContainer = containerRef.current?.parentElement;
		if (parentContainer) {
			resizeObserver.observe(parentContainer);
			// Also observe cards container
			const cardsContainer = parentContainer.querySelector(".space-y-12");
			if (cardsContainer) {
				resizeObserver.observe(cardsContainer);
			}
		}

		// Update on window resize
		window.addEventListener("resize", updatePositions);

		return () => {
			clearTimeout(timeoutId);
			clearTimeout(timeoutId2);
			clearTimeout(timeoutId3);
			resizeObserver.disconnect();
			window.removeEventListener("resize", updatePositions);
		};
	}, []);

	useEffect(() => {
		if (!lineRef.current || !nodesRef.current || prefersReducedMotion()) {
			if (lineRef.current && nodePositions.length > 0) {
				lineRef.current.style.strokeDashoffset = "0";
			}
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && lineRef.current && nodePositions.length > 0) {
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

		if (nodesRef.current) {
			observer.observe(nodesRef.current);
		}

		return () => {
			if (nodesRef.current) {
				observer.unobserve(nodesRef.current);
			}
		};
	}, [nodePositions]);

	// Calculate line start and end positions
	const lineStart = nodePositions.length > 0 ? Math.min(...nodePositions) : 0;
	const lineEnd = nodePositions.length > 0 ? Math.max(...nodePositions) : 100;

	return (
		<div className="absolute inset-0" ref={containerRef}>
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
					y1={`${lineStart}%`}
					y2={`${lineEnd}%`}
				/>
			</svg>

			{/* Nodes */}
			<div className="relative" ref={nodesRef}>
				{nodePositions.length > 0
					? nodePositions.map((position, index) => (
							<div
								className="absolute left-6 z-10 h-4 w-4 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent)] md:left-1/2 md:-translate-x-1/2"
								// biome-ignore lint/suspicious/noArrayIndexKey: Static timeline nodes, order never changes
								key={`timeline-node-${index}`}
								style={{
									top: `${position}%`,
									opacity: prefersReducedMotion() ? 1 : 0,
									transform: prefersReducedMotion()
										? "scale(1) translateY(-50%)"
										: "scale(0) translateY(-50%)",
								}}
							/>
						))
					: Array.from({ length: itemCount }).map((_, index) => (
							<div
								className="absolute left-6 z-10 h-4 w-4 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent)] md:left-1/2 md:-translate-x-1/2"
								// biome-ignore lint/suspicious/noArrayIndexKey: Static timeline nodes, order never changes
								key={`timeline-node-${index}`}
								style={{
									top: `${(index / (itemCount - 1 || 1)) * 100}%`,
									opacity: prefersReducedMotion() ? 1 : 0,
									transform: prefersReducedMotion()
										? "scale(1) translateY(-50%)"
										: "scale(0) translateY(-50%)",
								}}
							/>
						))}
			</div>
		</div>
	);
}
