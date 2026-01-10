"use client";

import { Code2, FileCode, Github, Package, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { CodeCarousel } from "../code-carousel";

interface Stat {
	id: string;
	label: string;
	value: number;
	icon: typeof Code2;
	suffix?: string;
}

const stats: Stat[] = [
	{
		id: "bundle-size",
		label: "Bundle Size",
		value: 245,
		icon: Package,
		suffix: " KB",
	},
	{
		id: "load-time",
		label: "Load Time",
		value: 1.2,
		icon: Zap,
		suffix: "s",
	},
	{
		id: "lines-of-code",
		label: "Lines of Code",
		value: 8500,
		icon: FileCode,
	},
	{
		id: "animations",
		label: "Animations",
		value: 25,
		icon: Code2,
	},
];

function AnimatedStatCounter({
	value,
	suffix,
	decimals = 0,
}: {
	value: number;
	suffix?: string;
	decimals?: number;
}) {
	const [displayValue, setDisplayValue] = useState(0);
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (hasAnimated.current || prefersReducedMotion()) {
			setDisplayValue(value);
			return;
		}

		hasAnimated.current = true;

		anime({
			targets: { count: 0 },
			count: value,
			duration: timing.slow,
			easing: easing.easeOut,
			update: (anim: {
				animatables?: Array<{ target: { count: number } }>;
			}) => {
				const current = anim.animatables?.[0]?.target.count ?? 0;
				setDisplayValue(
					decimals > 0
						? Number.parseFloat(current.toFixed(decimals))
						: Math.floor(current),
				);
			},
		});
	}, [value, decimals]);

	return (
		<span>
			{displayValue.toLocaleString()}
			{suffix}
		</span>
	);
}

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

	return (
		<section
			className="bg-(--bg-primary) py-20 md:py-32"
			id="build-info"
			ref={sectionRef}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					className="section-title mb-12 text-center font-bold text-4xl md:text-5xl"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					How This Site Was Built
				</h2>

				<div className="section-content space-y-12">
					{/* Tech Stack */}
					<div>
						<h3 className="mb-4 font-semibold text-2xl">Tech Stack</h3>
						<div className="flex flex-wrap gap-2">
							{techStack.map((tech) => (
								<span
									className="rounded-lg border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-sm"
									key={tech}
								>
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
												suffix={stat.suffix}
												value={stat.value}
											/>
										</div>
										<div className="text-center text-(--text-secondary) text-xs">
											{stat.label}
										</div>
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

					{/* Design Philosophy */}
					<div>
						<h3 className="mb-4 font-semibold text-2xl">Design Philosophy</h3>
						<div className="space-y-3 text-(--text-secondary)">
							<p>
								This portfolio was built with performance and user experience in
								mind. Every animation respects user preferences, and the site is
								optimized for fast loading and smooth interactions.
							</p>
							<p>
								The codebase follows modern React patterns with TypeScript for
								type safety, and uses tRPC for end-to-end type-safe API calls.
								All animations are powered by anime.js with careful attention to
								accessibility.
							</p>
						</div>
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
			</div>
		</section>
	);
}
