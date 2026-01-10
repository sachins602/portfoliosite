"use client";

import { Accessibility, Gauge, Search, Shield } from "lucide-react";
import { useEffect, useRef } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

interface Score {
	id: string;
	label: string;
	value: number;
	icon: typeof Gauge;
	color: string;
}

const scores: Score[] = [
	{
		id: "performance",
		label: "Performance",
		value: 98,
		icon: Gauge,
		color: "var(--accent)",
	},
	{
		id: "accessibility",
		label: "Accessibility",
		value: 96,
		icon: Accessibility,
		color: "var(--accent)",
	},
	{
		id: "best-practices",
		label: "Best Practices",
		value: 97,
		icon: Shield,
		color: "var(--accent)",
	},
	{
		id: "seo",
		label: "SEO",
		value: 99,
		icon: Search,
		color: "var(--accent)",
	},
];

function CircularProgress({
	score,
	color,
	size = 80,
	strokeWidth = 6,
}: {
	score: number;
	color: string;
	size?: number;
	strokeWidth?: number;
}) {
	const circleRef = useRef<SVGCircleElement>(null);
	const hasAnimated = useRef(false);
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		if (!circleRef.current || hasAnimated.current || prefersReducedMotion()) {
			if (circleRef.current) {
				const offset = circumference - (score / 100) * circumference;
				circleRef.current.style.strokeDashoffset = `${offset}`;
			}
			return;
		}

		hasAnimated.current = true;
		const circle = circleRef.current;

		// Set up the circle for animation
		circle.style.strokeDasharray = `${circumference}`;
		circle.style.strokeDashoffset = `${circumference}`;

		anime({
			targets: circle,
			strokeDashoffset: [
				circumference,
				circumference - (score / 100) * circumference,
			],
			duration: timing.slow,
			easing: easing.easeOut,
		});
	}, [score, circumference]);

	return (
		<svg className="-rotate-90 transform" height={size} width={size}>
			{/* Background circle */}
			<circle
				cx={size / 2}
				cy={size / 2}
				fill="none"
				r={radius}
				stroke="var(--border)"
				strokeWidth={strokeWidth}
			/>
			{/* Progress circle */}
			<circle
				cx={size / 2}
				cy={size / 2}
				fill="none"
				r={radius}
				ref={circleRef}
				stroke={color}
				strokeLinecap="round"
				strokeWidth={strokeWidth}
				style={{
					strokeDasharray: `${circumference}`,
					strokeDashoffset: `${circumference}`,
				}}
			/>
		</svg>
	);
}

export function LighthouseScores() {
	const containerRef = useScrollTrigger<HTMLDivElement>((element) => {
		if (prefersReducedMotion()) return;

		anime({
			targets: element,
			opacity: [0, 1],
			translateY: [30, 0],
			duration: timing.normal,
			easing: easing.easeOut,
		});
	});

	return (
		<div
			className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
			ref={containerRef}
		>
			<h3 className="mb-6 text-center font-semibold text-xl">
				Lighthouse Scores
			</h3>
			<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
				{scores.map((score) => {
					const Icon = score.icon;
					return (
						<div className="flex flex-col items-center" key={score.id}>
							<div className="relative mb-4">
								<CircularProgress
									color={score.color}
									score={score.value}
									size={100}
									strokeWidth={8}
								/>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<div className="font-bold text-[var(--text-primary)] text-lg">
											{score.value}
										</div>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Icon className="h-4 w-4 text-[var(--accent)]" />
								<div className="font-medium text-[var(--text-primary)] text-sm">
									{score.label}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
