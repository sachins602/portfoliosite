"use client";

import {
	FolderGit2,
	GitBranch,
	GitPullRequest,
	type Star as StarIcon,
	UserPlus,
	Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

interface StatCard {
	id: string;
	label: string;
	value: number;
	icon: typeof StarIcon;
	color: string;
	gradient: string;
}

function AnimatedNumber({
	value,
	duration = 2000,
}: {
	value: number;
	duration?: number;
}) {
	const [displayValue, setDisplayValue] = useState(0);
	const hasAnimated = useRef(false);
	const previousValue = useRef<number | null>(null);

	useEffect(() => {
		// Skip if value hasn't changed
		if (previousValue.current === value) {
			return;
		}

		// If this is the first time we get a non-zero value, animate
		if (previousValue.current === null || previousValue.current === 0) {
			if (value === 0) {
				// Still waiting for data, don't animate yet
				setDisplayValue(0);
				return;
			}

			// Got real data for the first time, animate from 0
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
				duration,
				easing: easing.easeOut,
				update: (anim: {
					animatables?: Array<{ target: { count: number } }>;
				}) => {
					setDisplayValue(Math.floor(anim.animatables?.[0]?.target.count ?? 0));
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
					duration: duration * 0.5, // Shorter duration for updates
					easing: easing.easeOut,
					update: (anim: {
						animatables?: Array<{ target: { count: number } }>;
					}) => {
						setDisplayValue(
							Math.floor(anim.animatables?.[0]?.target.count ?? 0),
						);
					},
					complete: () => {
						setDisplayValue(value);
					},
				});
			}
		}

		previousValue.current = value;
	}, [value, duration]);

	return <span>{displayValue.toLocaleString()}</span>;
}

export function GitHubStats() {
	const {
		data: stats,
		isLoading,
		error,
	} = api.githubStats.getUserStats.useQuery();

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

	const cardsRef = useRef<HTMLDivElement>(null);
	const hasAnimatedCards = useRef(false);

	useEffect(() => {
		if (
			!stats ||
			!cardsRef.current ||
			hasAnimatedCards.current ||
			prefersReducedMotion()
		) {
			return;
		}

		hasAnimatedCards.current = true;

		const cards = cardsRef.current.querySelectorAll(".stat-card");

		anime({
			targets: cards,
			opacity: [0, 1],
			scale: [0.9, 1],
			translateY: [20, 0],
			delay: anime.stagger(80),
			duration: timing.normal,
			easing: "spring(1, 80, 10, 0)",
		});
	}, [stats]);

	if (isLoading) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h3 className="mb-6 text-center font-semibold text-xl">
					GitHub Statistics
				</h3>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							className="h-24 animate-pulse rounded-lg bg-(--border)"
							key={`skeleton-${i + Math.random()}`}
						/>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h3 className="mb-4 text-center font-semibold text-xl">
					GitHub Statistics
				</h3>
				<p className="text-center text-(--text-secondary)">
					Unable to load GitHub statistics. Please check your GitHub token.
				</p>
			</div>
		);
	}

	const statCards: StatCard[] = [
		{
			id: "commits",
			label: "Commits",
			value: stats?.totalCommits ?? 0,
			icon: GitBranch,
			color: "#22c55e",
			gradient: "from-green-500/20 to-green-600/5",
		},
		{
			id: "prs",
			label: "Pull Requests",
			value: stats?.totalPRs ?? 0,
			icon: GitPullRequest,
			color: "#a855f7",
			gradient: "from-purple-500/20 to-purple-600/5",
		},
		{
			id: "repos",
			label: "Repositories",
			value: stats?.totalRepos ?? 0,
			icon: FolderGit2,
			color: "#3b82f6",
			gradient: "from-blue-500/20 to-blue-600/5",
		},
		{
			id: "followers",
			label: "Followers",
			value: stats?.followers ?? 0,
			icon: Users,
			color: "#ec4899",
			gradient: "from-pink-500/20 to-pink-600/5",
		},
		{
			id: "following",
			label: "Following",
			value: stats?.following ?? 0,
			icon: UserPlus,
			color: "#06b6d4",
			gradient: "from-cyan-500/20 to-cyan-600/5",
		},
	];

	return (
		<div
			className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6"
			ref={containerRef}
		>
			<div className="mb-6 flex items-center justify-between">
				<h3 className="flex-1 text-center font-semibold text-xl">
					GitHub Statistics
				</h3>
				<span className="text-(--text-secondary) text-xs">Last 12 months</span>
			</div>

			<div
				className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
				ref={cardsRef}
			>
				{statCards.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							className={`stat-card group relative overflow-hidden rounded-xl border border-(--border) bg-linear-to-br ${stat.gradient} p-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-(--accent)/10 hover:shadow-lg`}
							key={stat.id}
							style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
						>
							{/* Glow effect */}
							<div
								className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								style={{
									background: `radial-gradient(circle at 50% 0%, ${stat.color}15, transparent 70%)`,
								}}
							/>

							<div className="relative">
								<Icon
									className="mb-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
									style={{ color: stat.color }}
								/>
								<div className="font-bold text-(--text-primary) text-2xl">
									<AnimatedNumber value={stat.value} />
								</div>
								<div className="mt-1 text-(--text-secondary) text-xs">
									{stat.label}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
