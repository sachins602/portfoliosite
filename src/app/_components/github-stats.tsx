"use client";

import { GitBranch, GitPullRequest, AlertCircle, Star, Users, FolderGit2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

interface StatCard {
    id: string;
    label: string;
    value: number;
    icon: typeof Star;
    color: string;
    gradient: string;
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
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
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <h3 className="mb-6 text-center font-semibold text-xl">GitHub Statistics</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={`skeleton-${i}`}
                            className="h-24 animate-pulse rounded-lg bg-[var(--border)]"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <h3 className="mb-4 text-center font-semibold text-xl">GitHub Statistics</h3>
                <p className="text-center text-[var(--text-secondary)]">
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
            id: "issues",
            label: "Issues",
            value: stats?.totalIssues ?? 0,
            icon: AlertCircle,
            color: "#f59e0b",
            gradient: "from-amber-500/20 to-amber-600/5",
        },
        {
            id: "stars",
            label: "Total Stars",
            value: stats?.totalStars ?? 0,
            icon: Star,
            color: "#eab308",
            gradient: "from-yellow-500/20 to-yellow-600/5",
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
    ];

    return (
        <div
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
            ref={containerRef}
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-center font-semibold text-xl flex-1">
                    GitHub Statistics
                </h3>
                <span className="text-[var(--text-secondary)] text-xs">
                    Last 12 months
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" ref={cardsRef}>
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className={`stat-card group relative overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-br ${stat.gradient} p-4 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10 hover:-translate-y-1`}
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
                                <div className="font-bold text-2xl text-[var(--text-primary)]">
                                    <AnimatedNumber value={stat.value} />
                                </div>
                                <div className="text-[var(--text-secondary)] text-xs mt-1">
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
