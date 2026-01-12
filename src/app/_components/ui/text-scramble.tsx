"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "~/lib/animations";
import { cn } from "~/lib/utils";

interface TextScrambleProps {
	text: string;
	className?: string;
	speed?: number; // ms per character (default: 50)
	triggerOnView?: boolean;
	delay?: number; // Delay before starting animation (default: 0)
	loop?: boolean; // Continuous scrambling mode (default: false)
	chars?: string; // Custom character set for scrambling
}

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Text Scramble Effect Component
 * Characters scramble through random characters before settling on the final value.
 * Great for headings and emphasis text with a hacker/terminal aesthetic.
 */
export function TextScramble({
	text,
	className,
	speed = 50,
	triggerOnView = true,
	delay = 0,
	loop = false,
	chars = DEFAULT_CHARS,
}: TextScrambleProps) {
	const [displayText, setDisplayText] = useState(text);
	const containerRef = useRef<HTMLSpanElement>(null);
	const hasAnimated = useRef(false);
	const isAnimatingRef = useRef(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Cleanup intervals on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (loopIntervalRef.current) {
				clearInterval(loopIntervalRef.current);
			}
		};
	}, []);

	const runScramble = useCallback(() => {
		if (isAnimatingRef.current || prefersReducedMotion()) {
			setDisplayText(text);
			return;
		}

		isAnimatingRef.current = true;
		const finalChars = text.split("");
		const currentChars = Array(text.length).fill("");
		let revealed = 0;

		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			// Scramble unrevealed characters
			const scrambled = currentChars.map((_char, i) => {
				if (i < revealed) return finalChars[i];
				return chars[Math.floor(Math.random() * chars.length)] ?? "";
			});

			setDisplayText(scrambled.join(""));
			revealed++;

			if (revealed > text.length) {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				setDisplayText(text);
				isAnimatingRef.current = false;
			}
		}, speed);
	}, [text, chars, speed]);

	useEffect(() => {
		if (prefersReducedMotion()) {
			setDisplayText(text);
			return;
		}

		// Loop mode - continuous scrambling
		if (loop) {
			if (loopIntervalRef.current) {
				clearInterval(loopIntervalRef.current);
			}

			loopIntervalRef.current = setInterval(() => {
				setDisplayText(
					text
						.split("")
						.map((char, _i) => {
							// Skip spaces and punctuation for smoother effect
							if (char === " " || char === "." || char === "," || char === "!" || char === "?") {
								return char;
							}
							return Math.random() > 0.7 ? (chars[Math.floor(Math.random() * chars.length)] ?? "") : char;
						})
						.join(""),
				);
			}, 100);

			return () => {
				if (loopIntervalRef.current) {
					clearInterval(loopIntervalRef.current);
				}
			};
		}

		// Non-loop mode - trigger on view or immediately
		if (!triggerOnView) {
			const timeoutId = setTimeout(() => {
				runScramble();
			}, delay);

			return () => {
				clearTimeout(timeoutId);
			};
		}

		// Intersection Observer for viewport triggering
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !hasAnimated.current) {
					hasAnimated.current = true;
					const timeoutId = setTimeout(() => {
						runScramble();
					}, delay);

					observer.disconnect();

					return () => {
						clearTimeout(timeoutId);
					};
				}
			},
			{ threshold: 0.5 },
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [text, triggerOnView, delay, loop, chars, runScramble]);

	return (
		<span className={cn("font-mono", className)} ref={containerRef}>
			{displayText}
		</span>
	);
}

interface ScrambleLinkProps {
	children: string;
	href: string;
	className?: string;
	speed?: number;
	chars?: string;
}

/**
 * ScrambleLink variant - scrambles text on hover
 */
export function ScrambleLink({ children, href, className, speed = 50, chars = DEFAULT_CHARS }: ScrambleLinkProps) {
	const [displayText, setDisplayText] = useState(children);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isScramblingRef = useRef(false);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	const runScramble = () => {
		if (prefersReducedMotion() || isScramblingRef.current) return;

		isScramblingRef.current = true;
		const finalChars = children.split("");
		const currentChars = Array(children.length).fill("");
		let revealed = 0;

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			const scrambled = currentChars.map((_char, i) => {
				if (i < revealed) return finalChars[i];
				return chars[Math.floor(Math.random() * chars.length)] ?? "";
			});

			setDisplayText(scrambled.join(""));
			revealed++;

			if (revealed > children.length) {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				setDisplayText(children);
				isScramblingRef.current = false;
			}
		}, speed);
	};

	const handleMouseEnter = () => {
		if (prefersReducedMotion()) return;
		runScramble();
	};

	const handleMouseLeave = () => {
		if (prefersReducedMotion()) return;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setDisplayText(children);
		isScramblingRef.current = false;
	};

	return (
		<a className={cn("font-mono", className)} href={href} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			{displayText}
		</a>
	);
}
