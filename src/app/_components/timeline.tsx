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
	const hasAnimatedRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Calculate node positions based on actual card positions
	useEffect(() => {
		const updatePositions = () => {
			if (!containerRef.current) return;

			const timelineContainer = containerRef.current;
			const wrapperDiv = timelineContainer.parentElement as HTMLElement;
			if (!wrapperDiv) return;

			// Get the cards container (the div with space-y-12) - it's a sibling of timelineContainer
			const cardsContainer = wrapperDiv.querySelector(".space-y-12") as HTMLElement;
			if (!cardsContainer) return;

			// Set timeline container height to match cards container
			const cardsContainerHeight = cardsContainer.scrollHeight || cardsContainer.offsetHeight;
			if (cardsContainerHeight === 0) return;
			
			// Update timeline container height to match cards
			timelineContainer.style.height = `${cardsContainerHeight}px`;

			const positions: number[] = [];

			// Find all experience card containers within the wrapper
			const cards = Array.from(
				wrapperDiv.querySelectorAll<HTMLElement>("[data-experience-card]"),
			);

			cards.forEach((card) => {
				// Calculate position relative to cards container
				const cardTop = card.offsetTop;
				const cardHeight = card.offsetHeight;
				const cardCenter = cardTop + cardHeight / 2;
				const relativePosition = (cardCenter / cardsContainerHeight) * 100;
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

		const wrapperDiv = containerRef.current?.parentElement;
		if (wrapperDiv) {
			resizeObserver.observe(wrapperDiv);
			// Also observe cards container
			const cardsContainer = wrapperDiv.querySelector(".space-y-12");
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

	// Animation effect - only run once when nodes are ready
	useEffect(() => {
		if (!lineRef.current || !nodesRef.current || prefersReducedMotion()) {
			if (lineRef.current && nodePositions.length > 0) {
				lineRef.current.style.strokeDashoffset = "0";
			}
			return;
		}

		// Don't set up observer if already animated or if positions aren't ready
		if (hasAnimatedRef.current || nodePositions.length === 0) return;

		// Clean up any existing observer
		if (observerRef.current) {
			observerRef.current.disconnect();
			observerRef.current = null;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						lineRef.current &&
						nodePositions.length > 0 &&
						!hasAnimatedRef.current
					) {
						hasAnimatedRef.current = true;

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

						// Disconnect observer after animation starts
						if (observerRef.current) {
							observerRef.current.disconnect();
							observerRef.current = null;
						}
					}
				});
			},
			{ threshold: 0.1 },
		);

		observerRef.current = observer;

		if (nodesRef.current) {
			observer.observe(nodesRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = null;
			}
		};
	}, [nodePositions]);

	// Calculate line start and end positions
	const lineStart = nodePositions.length > 0 ? Math.min(...nodePositions) : 0;
	const lineEnd = nodePositions.length > 0 ? Math.max(...nodePositions) : 100;

	return (
		<div 
			className="absolute left-0 right-0 top-0" 
			ref={containerRef}
		>
			{/* SVG Line */}
			<svg
				aria-label="Timeline line"
				className="absolute bottom-0 left-[1.875rem] top-0 w-1 md:-translate-x-1/2 md:left-1/2"
				role="img"
				style={{ height: "100%" }}
			>
				<line
					ref={lineRef}
					stroke="var(--accent)"
					strokeDasharray="0"
					strokeDashoffset="0"
					strokeWidth="3"
					x1="2"
					x2="2"
					y1={`${lineStart}%`}
					y2={`${lineEnd}%`}
				/>
			</svg>

			{/* Nodes */}
			<div className="absolute inset-0" ref={nodesRef} style={{ height: "100%" }}>
				{nodePositions.length > 0
					? nodePositions.map((position, index) => (
							<div
								className="absolute left-6 z-10 h-4 w-4 rounded-full border border-(--bg-primary) bg-(--accent) md:left-1/2 md:-translate-x-1/2"
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
								className="absolute left-6 z-10 h-4 w-4 rounded-full border border-(--bg-primary) bg-(--accent) md:left-1/2 md:-translate-x-1/2"
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
