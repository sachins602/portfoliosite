"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "~/lib/animations";

interface Particle {
	id: number;
	x: number;
	y: number;
	opacity: number;
	size: number;
}

export function CursorTrail() {
	const [particles, setParticles] = useState<Particle[]>([]);
	const [isEnabled, setIsEnabled] = useState(false);
	const particleIdRef = useRef(0);
	const rafRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		// Check if enabled in localStorage
		const enabled =
			typeof window !== "undefined" &&
			localStorage.getItem("cursorTrailEnabled") === "true";
		setIsEnabled(enabled);

		// Check if touch device
		if ("ontouchstart" in window) {
			return;
		}

		if (!enabled) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (prefersReducedMotion()) return;

			// Limit particle count
			setParticles((prev) => {
				const newParticles = [
					...prev,
					{
						id: particleIdRef.current++,
						x: e.clientX,
						y: e.clientY,
						opacity: 1,
						size: Math.random() * 4 + 2,
					},
				];

				// Keep only last 25 particles
				return newParticles.slice(-25);
			});
		};

		window.addEventListener("mousemove", handleMouseMove);

		// Animate particles
		const animate = () => {
			setParticles((prev) => {
				return prev
					.map((p) => ({
						...p,
						opacity: Math.max(0, p.opacity - 0.05),
					}))
					.filter((p) => p.opacity > 0);
			});

			rafRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [isEnabled]);

	// Enable via Konami code variant or localStorage
	useEffect(() => {
		const checkKonami = () => {
			const sequence = localStorage.getItem("konamiSequence") ?? "";
			if (sequence.includes("cursor")) {
				setIsEnabled(true);
				localStorage.setItem("cursorTrailEnabled", "true");
			}
		};

		checkKonami();
		const interval = setInterval(checkKonami, 1000);
		return () => clearInterval(interval);
	}, []);

	if (!isEnabled || prefersReducedMotion()) return null;

	return (
		<div className="pointer-events-none fixed inset-0 z-[9999]">
			{particles.map((particle) => (
				<div
					className="absolute rounded-full bg-[var(--accent)]"
					key={particle.id}
					style={{
						left: `${particle.x}px`,
						top: `${particle.y}px`,
						width: `${particle.size}px`,
						height: `${particle.size}px`,
						opacity: particle.opacity,
						transform: "translate(-50%, -50%)",
						transition: "opacity 0.1s ease-out",
					}}
				/>
			))}
		</div>
	);
}
