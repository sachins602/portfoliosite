"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

const KONAMI_CODE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"KeyB",
	"KeyA",
];

export function useKonami(onActivate?: () => void) {
	const [isActive, setIsActive] = useState(false);
	const [sequence, setSequence] = useState<string[]>([]);

	useEffect(() => {
		if (isActive) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			setSequence((prev) => {
				const newSequence = [...prev, e.code].slice(-KONAMI_CODE.length);
				const matches = newSequence.every((key, index) => key === KONAMI_CODE[index]);

				if (matches && newSequence.length === KONAMI_CODE.length) {
					setIsActive(true);
					if (onActivate) {
						onActivate();
					} else {
						triggerMatrixEffect();
					}
					return [];
				}

				return newSequence;
			});
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, onActivate]);

	return { isActive, sequence };
}

function triggerMatrixEffect() {
	if (prefersReducedMotion()) return;

	// Create matrix rain effect
	const container = document.createElement("div");
	container.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
		overflow: hidden;
	`;
	document.body.appendChild(container);

	// Create notification
	const notification = document.createElement("div");
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--bg-primary);
		border: 2px solid var(--accent);
		padding: 16px 24px;
		border-radius: 8px;
		color: var(--accent);
		font-weight: bold;
		z-index: 10000;
		box-shadow: 0 4px 12px rgba(0,0,0,0.3);
	`;
	notification.textContent = "🎉 Konami Code Activated! 🎉";
	document.body.appendChild(notification);

	// Animate notification
	anime({
		targets: notification,
		opacity: [0, 1],
		scale: [0.8, 1],
		duration: timing.normal,
		easing: "spring(1, 80, 10, 0)",
	});

	// Create matrix characters
	const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
	const columns = Math.floor(window.innerWidth / 20);
	const drops: number[] = Array(columns).fill(0);

	const canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
	`;
	container.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.fillStyle = "#0f172a";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = "15px monospace";
	ctx.fillStyle = "#818cf8";

	function draw() {
		if (!ctx) return;
		ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < drops.length; i++) {
			const charIndex = Math.floor(Math.random() * chars.length);
			const text = chars[charIndex];
			if (text === undefined) continue;
			ctx.fillStyle = "#818cf8";
			const dropValue = drops[i];
			if (dropValue === undefined) continue;
			ctx.fillText(text, i * 20, dropValue * 20);

			if (dropValue * 20 > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			} else {
				drops[i] = dropValue + 1;
			}
		}
	}

	const interval = setInterval(draw, 50);

	// Cleanup after 5 seconds
	setTimeout(() => {
		clearInterval(interval);
		anime({
			targets: [container, notification],
			opacity: [1, 0],
			duration: timing.normal,
			complete: () => {
				container.remove();
				notification.remove();
			},
		});
	}, 5000);
}
