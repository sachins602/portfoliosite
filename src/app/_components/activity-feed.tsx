"use client";

import { GitBranch, Github, GitMerge, Plus, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import { useScrollTrigger, useStaggerReveal } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

const getEventIcon = (type: string) => {
	switch (type) {
		case "PushEvent":
			return GitBranch;
		case "WatchEvent":
			return Star;
		case "CreateEvent":
			return Plus;
		case "ForkEvent":
			return GitMerge;
		default:
			return Github;
	}
};

export function ActivityFeed() {
	const {
		data: activities,
		isLoading,
		error,
	} = api.githubActivity.getActivity.useQuery();

	const containerRef = useScrollTrigger<HTMLDivElement>((element) => {
		if (prefersReducedMotion()) return;

		anime({
			targets: element,
			opacity: [0, 1],
			translateY: [20, 0],
			duration: timing.normal,
			easing: easing.easeOut,
		});
	});

	const listRef = useStaggerReveal<HTMLUListElement>(activities ?? [], {
		duration: timing.normal,
		staggerDelay: 50,
		translateY: 20,
	});

	// Animate new items when data changes
	const prevActivitiesRef = useRef<string[]>([]);
	useEffect(() => {
		if (!activities || prefersReducedMotion()) return;

		const currentIds = activities.map((a) => a.id);
		const newIds = currentIds.filter(
			(id) => !prevActivitiesRef.current.includes(id),
		);

		if (newIds.length > 0 && listRef.current) {
			const items = Array.from(listRef.current.children);
			newIds.forEach((newId) => {
				const itemIndex = currentIds.indexOf(newId);
				const item = items[itemIndex];
				if (item) {
					anime({
						targets: item,
						opacity: [0, 1],
						translateY: [-10, 0],
						duration: timing.fast,
						easing: easing.easeOut,
					});
				}
			});
		}

		prevActivitiesRef.current = currentIds;
	}, [activities, listRef]);

	if (isLoading) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
				<div className="mb-3 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">Recent Activity</h3>
				</div>
				<div className="space-y-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							className="animate-pulse rounded bg-[var(--border)] p-2"
							key={`activity-skeleton-${i + Math.random()}`}
						>
							<div className="h-4 w-3/4 rounded bg-[var(--bg-primary)]" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
				<div className="mb-3 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">Recent Activity</h3>
				</div>
				<p className="text-center text-[var(--text-secondary)] py-4">
					Unable to load activity. Please check your GitHub token.
				</p>
			</div>
		);
	}

	if (!activities || activities.length === 0) {
		return (
			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
				<div className="mb-3 flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">Recent Activity</h3>
				</div>
				<p className="text-center text-[var(--text-secondary)] py-4">
					No recent activity found. Add a GITHUB_TOKEN to your .env to see activity.
				</p>
			</div>
		);
	}

	return (
		<div
			className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
			ref={containerRef}
		>
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Github className="h-5 w-5 text-[var(--accent)]" />
					<h3 className="font-semibold text-lg">Recent Activity</h3>
				</div>
				<a
					className="text-[var(--accent)] text-sm transition-colors hover:underline"
					href="https://github.com/sachins602"
					rel="noopener noreferrer"
					target="_blank"
				>
					View more
				</a>
			</div>
			<ul className="space-y-2" ref={listRef}>
				{activities.map((activity) => {
					const Icon = getEventIcon(activity.type);
					return (
						<li
							className="flex items-center gap-3 rounded p-2 transition-colors hover:bg-[var(--bg-primary)]"
							key={activity.id}
						>
							<Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
							<div className="min-w-0 flex-1">
								<a
									className="block truncate font-medium text-[var(--text-primary)] text-sm transition-colors hover:text-[var(--accent)]"
									href={activity.repoUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									{activity.message}
								</a>
								<p className="text-[var(--text-secondary)] text-xs">
									{activity.timeAgo}
								</p>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
