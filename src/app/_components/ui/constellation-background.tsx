"use client";

import { useEffect, useRef } from "react";
import { getParticleCount, isLowPowerDevice, prefersReducedMotion } from "~/lib/animations";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	baseRadius: number;
	alpha: number;
}

/**
 * Interactive "Constellation" Background component
 * Uses Canvas for high-performance particle animation with mouse interaction
 */
export function ConstellationBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const particles = useRef<Particle[]>([]);
	const mouse = useRef({ x: 0, y: 0, active: false });

	useEffect(() => {
		if (prefersReducedMotion()) return;

		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		let animationId: number;
		let width = 0;
		let height = 0;

		const setupCanvas = () => {
			const rect = container.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.scale(dpr, dpr);
		};

		const initParticles = () => {
			// Adjust particle count based on device power
			const count = getParticleCount(isLowPowerDevice() ? 60 : 120);
			particles.current = Array.from({ length: count }, () => {
				const pr = Math.random() * 1.5 + 0.5;
				return {
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.3,
					vy: (Math.random() - 0.5) * 0.3,
					radius: pr,
					baseRadius: pr,
					alpha: Math.random() * 0.5 + 0.2,
				};
			});
		};

		const drawConnections = () => {
			const maxDistance = 150;
			const p = particles.current;
			const len = p.length;

			for (let i = 0; i < len; i++) {
				const p1 = p[i];
				if (!p1) continue;

				for (let j = i + 1; j < len; j++) {
					const p2 = p[j];
					if (!p2) continue;

					const dx = p1.x - p2.x;
					const dy = p1.y - p2.y;
					const distSq = dx * dx + dy * dy;

					if (distSq < maxDistance * maxDistance) {
						const dist = Math.sqrt(distSq);
						const alpha = (1 - dist / maxDistance) * 0.2;
						ctx.beginPath();
						ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
						ctx.lineWidth = 0.8;
						ctx.moveTo(p1.x, p1.y);
						ctx.lineTo(p2.x, p2.y);
						ctx.stroke();
					}
				}
			}
		};

		const animate = () => {
			ctx.clearRect(0, 0, width, height);

			const pArr = particles.current;
			for (const p of pArr) {
				// Mouse interaction logic
				if (mouse.current.active) {
					const dx = p.x - mouse.current.x;
					const dy = p.y - mouse.current.y;
					const distSq = dx * dx + dy * dy;
					const maxMouseDist = 200;

					if (distSq < maxMouseDist * maxMouseDist) {
						const dist = Math.sqrt(distSq);
						// Force falloff
						const force = (1 - dist / maxMouseDist) * 0.04;
						p.vx += (dx / dist) * force;
						p.vy += (dy / dist) * force;
						// Grow particles near mouse
						p.radius = p.baseRadius * (1 + (1 - dist / maxMouseDist) * 2);
					} else {
						p.radius = p.baseRadius;
					}
				} else {
					p.radius = p.baseRadius;
				}

				// Apply velocity
				p.x += p.vx;
				p.y += p.vy;

				// Velocity damping to prevent infinite acceleration
				p.vx *= 0.98;
				p.vy *= 0.98;

				// Boundary wrapping
				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;

				// Draw particle
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
				ctx.fill();
			}

			drawConnections();
			animationId = requestAnimationFrame(animate);
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			mouse.current = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				active: true,
			};
		};

		const handleMouseLeave = () => {
			mouse.current.active = false;
		};

		const handleResize = () => {
			setupCanvas();
			initParticles();
		};

		setupCanvas();
		initParticles();
		animate();

		// Attach listeners to window to track mouse even over other elements
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("resize", handleResize);
		window.addEventListener("mouseout", handleMouseLeave);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mouseout", handleMouseLeave);
		};
	}, []);

	return (
		<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" ref={containerRef}>
			<canvas className="block h-full w-full opacity-60" ref={canvasRef} />
		</div>
	);
}
