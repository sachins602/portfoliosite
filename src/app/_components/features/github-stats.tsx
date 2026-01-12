"use client";

import { FolderGit2, GitBranch, GitPullRequest, type Star as StarIcon, UserPlus, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { useGitHubStats } from "~/hooks/use-github-stats";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { AnimatedNumber } from "../ui/animated-number";
import { Skeleton } from "../ui/skeleton";

export interface StatCard {
	id: string;
	label: string;
	value: number;
	icon: typeof StarIcon;
	color: string;
	gradient: string;
}

export function GitHubStats() {
	const { data: stats, isLoading, error } = useGitHubStats();

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
		if (!stats || !cardsRef.current || hasAnimatedCards.current || prefersReducedMotion()) {
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
			easing: easing.elasticOut,
		});
	}, [stats]);

	if (isLoading) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<div className="mb-6 flex items-center justify-between">
					<Skeleton className="mx-auto h-7 w-48" variant="text" />
					<Skeleton className="h-4 w-24" variant="text" />
				</div>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
					{Array.from({ length: 5 }, (_, i) => (
						<div
							className="flex flex-col items-center rounded-xl border border-(--border) bg-linear-to-br p-4"
							// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton loaders, order never changes
							key={`github-stats-skeleton-${i}`}
						>
							<Skeleton className="mb-2 h-5 w-5" variant="circular" />
							<Skeleton className="mb-1 h-8 w-16" variant="text" />
							<Skeleton className="h-4 w-20" variant="text" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h3 className="mb-4 text-center font-semibold text-xl">GitHub Statistics</h3>
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
		<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6" ref={containerRef}>
			<div className="mb-6 flex items-center justify-between">
				<h3 className="flex-1 text-center font-semibold text-xl">GitHub Statistics</h3>
				<span className="text-(--text-secondary) text-xs">Last 12 months</span>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" ref={cardsRef}>
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
								<div className="mt-1 text-(--text-secondary) text-xs">{stat.label}</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
