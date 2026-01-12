"use client";

import { Code2, FileCode, Github, Package, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { useBuildStats } from "~/hooks/use-build-stats";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { CodeCarousel } from "../features/code-carousel";
import { GhostText } from "../ui/ghost-text";

interface Stat {
	id: string;
	label: string;
	value: number | null;
	icon: typeof Code2;
	suffix?: string;
	isLoading?: boolean;
}

function AnimatedStatCounter({
	value,
	suffix,
	decimals = 0,
	isLoading = false,
}: {
	value: number | null;
	suffix?: string;
	decimals?: number;
	isLoading?: boolean;
}) {
	const [displayValue, setDisplayValue] = useState(0);
	const hasAnimated = useRef(false);
	const previousValue = useRef<number | null>(null);

	useEffect(() => {
		// Don't animate if loading or value is null
		if (isLoading || value === null) {
			if (value === null) {
				setDisplayValue(0);
			}
			return;
		}

		// If value hasn't changed, don't re-animate
		if (previousValue.current === value) {
			return;
		}

		// If this is the first time we get a non-null value, animate
		if (previousValue.current === null || previousValue.current === 0) {
			if (prefersReducedMotion()) {
				setDisplayValue(value);
				hasAnimated.current = true;
				previousValue.current = value;
				return;
			}

			hasAnimated.current = true;
			anime({
				targets: { count: 0 },
				count: value,
				duration: timing.slow,
				easing: easing.easeOut,
				update: (anim: { animatables?: Array<{ target: { count: number } }> }) => {
					const current = anim.animatables?.[0]?.target.count ?? 0;
					setDisplayValue(decimals > 0 ? Number.parseFloat(current.toFixed(decimals)) : Math.floor(current));
				},
				complete: () => {
					setDisplayValue(value);
				},
			});
		} else {
			// Value changed after initial animation, update directly or animate
			if (prefersReducedMotion()) {
				setDisplayValue(value);
			} else {
				// Animate from previous to new value
				const startValue = previousValue.current;
				anime({
					targets: { count: startValue },
					count: value,
					duration: timing.slow * 0.5, // Shorter duration for updates
					easing: easing.easeOut,
					update: (anim: { animatables?: Array<{ target: { count: number } }> }) => {
						const current = anim.animatables?.[0]?.target.count ?? 0;
						setDisplayValue(decimals > 0 ? Number.parseFloat(current.toFixed(decimals)) : Math.floor(current));
					},
					complete: () => {
						setDisplayValue(value);
					},
				});
			}
		}

		previousValue.current = value;
	}, [value, decimals, isLoading]);

	if (isLoading || value === null) {
		return (
			<span>
				<span className="inline-block h-5 w-12 animate-pulse rounded bg-(--border)" />
				{suffix}
			</span>
		);
	}

	return (
		<span>
			{displayValue.toLocaleString()}
			{suffix}
		</span>
	);
}

import { Section } from "../ui/section";

export function BuildInfo() {
	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		const title = element.querySelector(".section-title");
		const content = element.querySelector(".section-content");

		if (title) {
			anime({
				targets: title,
				opacity: [0, 1],
				translateY: [-20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}

		if (content) {
			anime({
				targets: content,
				opacity: [0, 1],
				translateY: [30, 0],
				delay: 200,
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
	});

	// Fetch build stats from API
	const { data: buildStats, isLoading: isLoadingBuildStats } = useBuildStats();

	// Client-side performance metrics
	const [performanceMetrics, setPerformanceMetrics] = useState<{
		bundleSize: number | null;
		loadTime: number | null;
	}>({
		bundleSize: null,
		loadTime: null,
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		// Measure load time using Performance API
		const measureLoadTime = () => {
			if (window.performance?.timing) {
				const timing = window.performance.timing;
				const loadTime = (timing.loadEventEnd - timing.navigationStart) / 1000; // Convert to seconds
				setPerformanceMetrics((prev) => ({ ...prev, loadTime }));
			} else if (window.performance?.getEntriesByType) {
				// Use Navigation Timing API v2
				const navEntries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
				if (navEntries.length > 0 && navEntries[0]) {
					const loadTime = navEntries[0].loadEventEnd / 1000; // Convert to seconds
					setPerformanceMetrics((prev) => ({ ...prev, loadTime }));
				}
			}
		};

		// Measure bundle size using Resource Timing API
		const measureBundleSize = () => {
			if (window.performance?.getEntriesByType) {
				const resources = window.performance.getEntriesByType("resource") as PerformanceResourceTiming[];
				let totalSize = 0;

				// Sum up JavaScript and CSS file sizes
				for (const resource of resources) {
					if (resource.name.includes("/_next/static") && (resource.name.endsWith(".js") || resource.name.endsWith(".css"))) {
						// Use transferSize if available (actual bytes transferred), otherwise use decodedBodySize
						const size = resource.transferSize || resource.decodedBodySize || 0;
						totalSize += size;
					}
				}

				// Convert to KB
				const bundleSizeKB = totalSize / 1024;
				setPerformanceMetrics((prev) => ({ ...prev, bundleSize: bundleSizeKB }));
			}
		};

		// Wait for page to fully load
		if (document.readyState === "complete") {
			measureLoadTime();
			measureBundleSize();
		} else {
			window.addEventListener("load", () => {
				measureLoadTime();
				measureBundleSize();
			});
		}
	}, []);

	const techStack = [
		"Next.js 16",
		"React 19",
		"TypeScript",
		"Tailwind CSS 4",
		"anime.js",
		"tRPC",
		"Drizzle ORM",
		"SQLite",
	];

	const stats: Stat[] = [
		{
			id: "bundle-size",
			label: "Bundle Size",
			value: performanceMetrics.bundleSize,
			icon: Package,
			suffix: " KB",
			isLoading: performanceMetrics.bundleSize === null,
		},
		{
			id: "load-time",
			label: "Load Time",
			value: performanceMetrics.loadTime,
			icon: Zap,
			suffix: "s",
			isLoading: performanceMetrics.loadTime === null,
		},
		{
			id: "lines-of-code",
			label: "Lines of Code",
			value: buildStats?.linesOfCode ?? null,
			icon: FileCode,
			isLoading: isLoadingBuildStats,
		},
		{
			id: "animations",
			label: "Animations",
			value: buildStats?.animations ?? null,
			icon: Code2,
			isLoading: isLoadingBuildStats,
		},
	];

	return (
		<Section className="bg-(--bg-primary) md:py-32" id="build-info" ref={sectionRef}>
			<h2
				className="section-title mb-12 text-center font-bold text-4xl md:text-5xl"
				style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
			>
				<GhostText offsetDistance={8}>How This Site Was Built</GhostText>
			</h2>

			<div className="section-content space-y-12">
				{/* Tech Stack */}
				<div>
					<h3 className="mb-4 font-semibold text-2xl">Tech Stack</h3>
					<div className="flex flex-wrap gap-2">
						{techStack.map((tech) => (
							<span className="rounded-lg border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-sm" key={tech}>
								{tech}
							</span>
						))}
					</div>
				</div>

				{/* Live Stats */}
				<div>
					<h3 className="mb-4 font-semibold text-2xl">Live Stats</h3>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									className="flex flex-col items-center rounded-lg border border-(--border) bg-(--bg-secondary) p-4"
									key={stat.id}
								>
									<Icon className="mb-2 h-6 w-6 text-(--accent)" />
									<div className="mb-1 font-bold text-(--text-primary) text-xl">
										<AnimatedStatCounter
											decimals={stat.id === "load-time" ? 1 : 0}
											isLoading={stat.isLoading}
											suffix={stat.suffix}
											value={stat.value}
										/>
									</div>
									<div className="text-center text-(--text-secondary) text-xs">{stat.label}</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Code Carousel */}
				<div>
					<h3 className="mb-4 font-semibold text-2xl">Code Snippets</h3>
					<CodeCarousel />
				</div>

				{/* GitHub Link */}
				<div className="flex justify-center">
					<a
						className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-secondary) px-6 py-3 transition-all hover:border-(--accent) hover:bg-(--accent)/10"
						href="https://github.com/sachins602"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Github className="h-5 w-5" />
						<span>View on GitHub</span>
					</a>
				</div>
			</div>
		</Section>
	);
}
