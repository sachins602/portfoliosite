"use client";

import { Code, FolderGit2, GitCommit, GitPullRequest } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

interface Metric {
	id: string;
	label: string;
	value: number;
	icon: typeof Code;
	suffix?: string;
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
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
			duration,
			easing: easing.easeOut,
			update: (anim: { animatables?: Array<{ target: { count: number } }> }) => {
				setDisplayValue(Math.floor(anim.animatables?.[0]?.target.count ?? 0));
			},
		});
	}, [value, duration]);

	return <span>{displayValue.toLocaleString()}</span>;
}

export function PerformanceMetrics() {
	const { data: projects } = api.projects.getProjects.useQuery();

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

	// Calculate metrics
	const totalRepos = projects?.length ?? 0;
	const { data: githubStats } = api.githubStats.getUserStats.useQuery();
	const totalCommits = githubStats?.totalCommits ?? 0;
	const totalPRs = githubStats?.totalPRs ?? 0;

	const projectsCompleted = totalRepos;

	const metrics: Metric[] = [
		{
			id: "repos",
			label: "GitHub Repositories",
			value: totalRepos,
			icon: FolderGit2,
		},
		{
			id: "commits",
			label: "Total Commits",
			value: totalCommits,
			icon: GitCommit,
		},
		{
			id: "prs",
			label: "Pull Requests",
			value: totalPRs,
			icon: GitPullRequest,
		},
		{
			id: "projects",
			label: "Projects Completed",
			value: projectsCompleted,
			icon: Code,
		},
	];

	return (
		<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6" ref={containerRef}>
			<h3 className="mb-6 text-center font-semibold text-xl">Performance Metrics</h3>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{metrics.map((metric) => {
					const Icon = metric.icon;
					return (
						<div
							className="flex flex-col items-center rounded-lg border border-(--border) bg-(--bg-primary) p-4 transition-all hover:border-(--accent) hover:shadow-lg"
							key={metric.id}
						>
							<Icon className="mb-2 h-6 w-6 text-(--accent)" />
							<div className="mb-1 font-bold text-(--text-primary) text-2xl">
								<AnimatedCounter value={metric.value} />
								{metric.suffix}
							</div>
							<div className="text-center text-(--text-secondary) text-xs">{metric.label}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
