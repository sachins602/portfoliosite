"use client";

import { type ReactNode, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { cn } from "~/lib/utils";

interface GhostTextProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
	offsetDistance?: number; // Max offset in pixels (default: 4)
	variant?: "rgb" | "blur";
}

export function GhostText({
	children,
	className = "",
	offsetDistance = 6,
	variant = "rgb",
	style,
	...props
}: GhostTextProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const redRef = useRef<HTMLSpanElement>(null);
	const greenRef = useRef<HTMLSpanElement>(null);
	const blueRef = useRef<HTMLSpanElement>(null);
	const blurRef = useRef<HTMLSpanElement>(null);

	const handleMouseEnter = () => {
		if (prefersReducedMotion()) return;

		if (variant === "rgb") {
			const rgbTargets = [redRef.current, greenRef.current, blueRef.current].filter(
				(t): t is HTMLSpanElement => t !== null,
			);

			if (rgbTargets.length > 0) {
				// Initial pop
				anime({
					targets: rgbTargets,
					opacity: [0, 0.7],
					duration: timing.fast,
					easing: easing.easeOut,
				});

				if (redRef.current) {
					anime({
						targets: redRef.current,
						translateX: [-offsetDistance, -offsetDistance / 2],
						translateY: [-offsetDistance / 2, -offsetDistance / 4],
						duration: timing.normal,
						easing: easing.elasticOut,
					});
				}

				if (greenRef.current) {
					anime({
						targets: greenRef.current,
						translateX: [offsetDistance, offsetDistance / 2],
						translateY: [0, 0],
						duration: timing.normal,
						easing: easing.elasticOut,
					});
				}

				if (blueRef.current) {
					anime({
						targets: blueRef.current,
						translateX: [0, 0],
						translateY: [offsetDistance / 2, offsetDistance / 4],
						duration: timing.normal,
						easing: easing.elasticOut,
					});
				}
			}
		} else if (blurRef.current) {
			anime({
				targets: blurRef.current,
				opacity: [0, 0.6],
				scale: [1, 1.05],
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (prefersReducedMotion() || variant !== "rgb") return;
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;

		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		// Normalized direction from -1 to 1
		const angleX = (e.clientX - centerX) / (rect.width / 2);
		const angleY = (e.clientY - centerY) / (rect.height / 2);

		if (redRef.current) {
			redRef.current.style.transform = `translate(${-angleX * offsetDistance}px, ${-angleY * offsetDistance}px)`;
		}
		if (greenRef.current) {
			greenRef.current.style.transform = `translate(${angleX * offsetDistance}px, ${angleY * offsetDistance}px)`;
		}
		if (blueRef.current) {
			blueRef.current.style.transform = `translate(0px, ${angleY * (offsetDistance / 2)}px)`;
		}
	};

	const handleMouseLeave = () => {
		if (prefersReducedMotion()) return;

		if (variant === "rgb") {
			const targets = [redRef.current, greenRef.current, blueRef.current].filter((t): t is HTMLSpanElement => t !== null);

			if (targets.length > 0) {
				anime({
					targets,
					translateX: 0,
					translateY: 0,
					opacity: 0,
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
		} else if (blurRef.current) {
			anime({
				targets: blurRef.current,
				opacity: 0,
				scale: 1,
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Decorative component with mouse-only interactions
		<div
			className={cn("group relative inline-block cursor-default", className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			ref={containerRef}
			style={style}
			{...props}
		>
			{variant === "rgb" && (
				<>
					{/* Red channel */}
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 select-none text-red-500/80 mix-blend-screen"
						ref={redRef}
						style={{ opacity: 0, willChange: "transform, opacity" }}
					>
						{children}
					</span>
					{/* Green channel */}
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 select-none text-green-500/80 mix-blend-screen"
						ref={greenRef}
						style={{ opacity: 0, willChange: "transform, opacity" }}
					>
						{children}
					</span>
					{/* Blue channel */}
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 select-none text-blue-500/80 mix-blend-screen"
						ref={blueRef}
						style={{ opacity: 0, willChange: "transform, opacity" }}
					>
						{children}
					</span>
				</>
			)}

			{variant === "blur" && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 select-none mix-blend-plus-lighter"
					ref={blurRef}
					style={{
						opacity: 0,
						filter: "blur(6px) brightness(1.2)",
						willChange: "transform, opacity",
					}}
				>
					{children}
				</span>
			)}

			{/* Original text (screen reader accessible) */}
			<span className="relative z-10 block">{children}</span>
		</div>
	);
}
