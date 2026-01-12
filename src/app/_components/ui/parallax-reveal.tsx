"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { prefersReducedMotion } from "~/lib/animations";
import { cn } from "~/lib/utils";

interface ParallaxRevealProps {
	children: ReactNode;
	speed?: number; // Parallax speed multiplier (default: 0.3)
	direction?: "up" | "down" | "left" | "right";
	className?: string;
	opacity?: boolean; // Enable opacity fade tied to scroll progress
	rootMargin?: string; // IntersectionObserver rootMargin (default: "0px")
}

export function ParallaxReveal({
	children,
	speed = 0.3,
	direction = "up",
	className,
	opacity = false,
	rootMargin = "0px",
}: ParallaxRevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (prefersReducedMotion() || !ref.current) return;

		const element = ref.current;
		let rafId: number;
		let isIntersecting = false;

		// Use IntersectionObserver to only animate when element is in viewport
		const observer = new IntersectionObserver(
			(entries) => {
				isIntersecting = entries[0]?.isIntersecting ?? false;
				if (isIntersecting) {
					handleScroll();
				}
			},
			{ rootMargin },
		);

		observer.observe(element);

		const handleScroll = () => {
			if (!isIntersecting) return;

			const rect = element.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			// Calculate progress (0 = just entering, 1 = fully visible, >1 = scrolled past)
			const progress = Math.max(0, Math.min(1, 1 - rect.top / viewportHeight));

			// Calculate offset based on progress and speed
			const offset = progress * 100 * speed;

			let transform = "";
			switch (direction) {
				case "up":
					transform = `translateY(${-offset}px)`;
					break;
				case "down":
					transform = `translateY(${offset}px)`;
					break;
				case "left":
					transform = `translateX(${-offset}px)`;
					break;
				case "right":
					transform = `translateX(${offset}px)`;
					break;
			}

			element.style.transform = transform;

			// Apply opacity fade if enabled
			if (opacity) {
				element.style.opacity = progress.toString();
			}
		};

		const throttledScroll = () => {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				handleScroll();
				rafId = 0;
			});
		};

		window.addEventListener("scroll", throttledScroll, { passive: true });
		handleScroll(); // Initial calculation

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", throttledScroll);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [speed, direction, opacity, rootMargin]);

	return (
		<div className={cn("will-change-transform", className)} ref={ref}>
			{children}
		</div>
	);
}

interface ParallaxLayerProps {
	children: ReactNode;
	speed?: number;
	direction?: "up" | "down" | "left" | "right";
	className?: string;
	opacity?: boolean;
	rootMargin?: string;
}

export function ParallaxLayer({
	children,
	speed = 0.3,
	direction = "up",
	className,
	opacity = false,
	rootMargin = "0px",
}: ParallaxLayerProps) {
	return (
		<ParallaxReveal className={className} direction={direction} opacity={opacity} rootMargin={rootMargin} speed={speed}>
			{children}
		</ParallaxReveal>
	);
}

interface ParallaxGroupProps {
	children: ReactNode;
	className?: string;
}

export function ParallaxGroup({ children, className }: ParallaxGroupProps) {
	return <div className={cn("relative", className)}>{children}</div>;
}
