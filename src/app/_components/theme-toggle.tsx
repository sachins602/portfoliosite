"use client";

import { useEffect, useState, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import anime from "animejs";
import { prefersReducedMotion } from "~/lib/animations";

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
		document.documentElement.classList.toggle("light", initialTheme === "light");
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
				type="button"
				className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
				aria-label="Toggle theme"
			>
				<Moon className="w-5 h-5" />
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
			aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
		>
			<div ref={iconRef} className="relative w-5 h-5">
				{theme === "dark" ? (
					<Moon className="w-5 h-5 absolute inset-0" />
				) : (
					<Sun className="w-5 h-5 absolute inset-0" />
				)}
			</div>
		</button>
	);
}
