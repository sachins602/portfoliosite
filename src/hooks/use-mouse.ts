"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
	x: number;
	y: number;
	clientX: number;
	clientY: number;
}

/**
 * Hook for tracking mouse position relative to an element and the viewport
 * Useful for interactive animations and hover effects
 */
export function useMouse<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const mouse = useRef<MousePosition>({ x: 0, y: 0, clientX: 0, clientY: 0 });

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = element.getBoundingClientRect();
			mouse.current = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				clientX: e.clientX,
				clientY: e.clientY,
			};
		};

		element.addEventListener("mousemove", handleMouseMove);
		return () => element.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return { ref, mouse };
}
