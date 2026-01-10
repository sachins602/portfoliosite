"use client";

import { useStaggerReveal } from "~/hooks/use-anime";
import { useScrollTrigger } from "~/hooks/use-anime";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";
import {
	Code,
	Database,
	Server,
	Cloud,
	Wrench,
	Type,
	Globe,
	Box,
} from "lucide-react";

const skills = [
	// Frontend
	{ name: "Next.js", category: "Frontend", icon: Globe },
	{ name: "React", category: "Frontend", icon: Code },
	{ name: "TypeScript", category: "Frontend", icon: Type },
	{ name: "Tailwind CSS", category: "Frontend", icon: Code },
	// Backend
	{ name: ".NET", category: "Backend", icon: Server },
	{ name: "Golang", category: "Backend", icon: Server },
	{ name: "Node.js", category: "Backend", icon: Server },
	// Database
	{ name: "SQL", category: "Database", icon: Database },
	{ name: "MongoDB", category: "Database", icon: Database },
	{ name: "Drizzle ORM", category: "Database", icon: Database },
	// DevOps
	{ name: "Docker", category: "DevOps", icon: Box },
	{ name: "CI/CD", category: "DevOps", icon: Cloud },
	// Tools
	{ name: "Git", category: "Tools", icon: Wrench },
];

export function SkillsGrid() {
	const containerRef = useScrollTrigger<HTMLDivElement>((element) => {
		if (prefersReducedMotion()) {
			element.style.opacity = "1";
			return;
		}

		const items = element.querySelectorAll(".skill-item");
		anime({
			targets: items,
			opacity: [0, 1],
			translateY: [30, 0],
			scale: [0.8, 1],
			delay: anime.stagger(50),
			duration: timing.normal,
			easing: easing.elasticOut,
		});
	});

	return (
		<div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{skills.map((skill, index) => {
				const Icon = skill.icon;
				return (
					<div
						key={index}
						className="skill-item p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
						style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
					>
						<div className="flex flex-col items-center gap-2">
							<Icon className="w-6 h-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
							<span className="text-sm font-medium text-center">
								{skill.name}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
