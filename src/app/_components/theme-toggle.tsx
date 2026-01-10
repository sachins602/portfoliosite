"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "~/lib/animations";
import anime from "~/lib/anime";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("dark");
	const [mounted, setMounted] = useState(false);
	const iconRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("theme") as "light" | "dark" | null;
		const systemPrefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initialTheme = stored ?? (systemPrefersDark ? "dark" : "light");
		setTheme(initialTheme);
		document.documentElement.classList.toggle(
			"light",
			initialTheme === "light",
		);
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
	}, []);

	const toggleTheme = () => {
		if (!mounted) return;

		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("light", newTheme === "light");
		document.documentElement.classList.toggle("dark", newTheme === "dark");

		// Animate icon morph
		if (!prefersReducedMotion() && iconRef.current) {
			anime({
				targets: iconRef.current,
				rotate: [0, 360],
				scale: [1, 1.2, 1],
				duration: 500,
				easing: "spring(1, 80, 10, 0)",
			});
		}
	};

	if (!mounted) {
		return (
			<button
				aria-label="Toggle theme"
				className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-secondary)]"
				type="button"
			>
				<Moon className="h-5 w-5" />
			</button>
		);
	}

	return (
		<button
			aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
			className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-secondary)]"
			onClick={toggleTheme}
			type="button"
		>
			<div className="relative h-5 w-5" ref={iconRef}>
				{theme === "dark" ? (
					<Moon className="absolute inset-0 h-5 w-5" />
				) : (
					<Sun className="absolute inset-0 h-5 w-5" />
				)}
			</div>
		</button>
	);
}
