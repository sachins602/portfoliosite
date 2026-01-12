"use client";

import { Github, Grid3x3, Linkedin, Mail, MapPin, Network } from "lucide-react";
import { Suspense, useState } from "react";
import { useElasticHover, useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { ActivityFeed } from "../features/activity-feed";
import { ContributionHeatmap } from "../features/contribution-heatmap";
import { GitHubLanguageChart } from "../features/github-language-chart";
import { GitHubStats } from "../features/github-stats";
import { PerformanceMetrics } from "../features/performance-metrics";
import { TechConstellation } from "../features/tech-constellation";
import { Terminal } from "../features/terminal/terminal";
import { Section } from "../ui/section";
import { Skeleton } from "../ui/skeleton";
import { SkillsGrid } from "../ui/skills-grid";

export function About() {
	const [showConstellation, setShowConstellation] = useState(false);

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

	const emailRef = useElasticHover<HTMLAnchorElement>();
	const githubRef = useElasticHover<HTMLAnchorElement>();
	const linkedinRef = useElasticHover<HTMLAnchorElement>();

	return (
		<Section className="bg-(--bg-primary) md:py-32" id="about" ref={sectionRef}>
			<h2
				className="section-title mb-12 text-center font-bold text-4xl md:text-5xl"
				style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
			>
				About Me
			</h2>

			<div className="section-content grid gap-12 md:grid-cols-2">
				{/* Bio */}
				<div>
					<div className="space-y-4 text-(--text-secondary)">
						<p>
							I'm a passionate Full-Stack Developer with expertise in building scalable web applications using modern
							technologies. My primary focus is on Next.js, React, TypeScript, and Golang, creating performant and
							user-friendly solutions.
						</p>
						<p>
							With experience in both frontend and backend development, I specialize in creating seamless user experiences
							while ensuring robust server-side architecture. I'm well-versed in cloud integrations, database design, and
							DevOps practices.
						</p>
						<p>
							Based in Ontario, Canada, I'm open to remote opportunities and ready to contribute to innovative projects that
							push the boundaries of web development.
						</p>
					</div>

					{/* Contact Info */}
					<div className="mt-8 space-y-4">
						<div className="flex items-center gap-3 text-(--text-secondary)">
							<MapPin className="h-5 w-5 text-(--accent)" />
							<span>Ontario, Canada</span>
						</div>
						<a
							className="flex items-center gap-3 text-(--text-secondary) transition-colors hover:text-(--accent)"
							href="mailto:sachinsapkota4@gmail.com"
							ref={emailRef}
						>
							<Mail className="h-5 w-5 text-(--accent)" />
							<span>sachinsapkota4@gmail.com</span>
						</a>
						<a
							className="flex items-center gap-3 text-(--text-secondary) transition-colors hover:text-(--accent)"
							href="https://github.com/sachins602"
							ref={githubRef}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Github className="h-5 w-5 text-(--accent)" />
							<span>github.com/sachins602</span>
						</a>
						<a
							className="flex items-center gap-3 text-(--text-secondary) transition-colors hover:text-(--accent)"
							href="https://www.linkedin.com/in/sachin-sapkota-97b467107/"
							ref={linkedinRef}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Linkedin className="h-5 w-5 text-(--accent)" />
							<span>LinkedIn Profile</span>
						</a>
					</div>
				</div>

				{/* Skills */}
				<div>
					<div className="mb-6 flex items-center justify-between">
						<h3 className="font-semibold text-2xl">Skills & Technologies</h3>
						<button
							className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-sm transition-colors hover:border-(--accent) hover:bg-(--accent)/10"
							onClick={() => setShowConstellation(!showConstellation)}
							type="button"
						>
							{showConstellation ? (
								<>
									<Grid3x3 className="h-4 w-4" />
									<span>Grid View</span>
								</>
							) : (
								<>
									<Network className="h-4 w-4" />
									<span>Network View</span>
								</>
							)}
						</button>
					</div>
					{showConstellation ? <TechConstellation /> : <SkillsGrid />}
				</div>
			</div>

			{/* Terminal Component */}
			<div className="mt-12 flex justify-center">
				<Terminal />
			</div>

			{/* Performance Metrics */}
			<div className="mt-12">
				<Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
					<PerformanceMetrics />
				</Suspense>
			</div>

			{/* GitHub Statistics */}
			<div className="mt-12">
				<Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
					<GitHubStats />
				</Suspense>
			</div>

			{/* Language Distribution */}
			<div className="mt-12">
				<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
					<GitHubLanguageChart />
				</Suspense>
			</div>

			{/* Contribution Heatmap */}
			<div className="mt-12">
				<Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
					<ContributionHeatmap />
				</Suspense>
			</div>

			{/* Activity Feed */}
			<div className="mt-12">
				<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
					<ActivityFeed />
				</Suspense>
			</div>
		</Section>
	);
}
