"use client";

import {
	Box,
	Cloud,
	Code,
	Database,
	Globe,
	Server,
	Type,
	Wrench,
} from "lucide-react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

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
		<div
			className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
			ref={containerRef}
		>
			{skills.map((skill, index) => {
				const Icon = skill.icon;
				return (
					<div
						className="skill-item group cursor-pointer rounded-lg border p-4 transition-colors"
						key={index}
						onMouseEnter={(e) => {
							e.currentTarget.style.borderColor = "var(--accent)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = "var(--border)";
						}}
						style={{
							opacity: prefersReducedMotion() ? 1 : 0,
							backgroundColor: "var(--bg-secondary)",
							borderColor: "var(--border)",
						}}
					>
						<div className="flex flex-col items-center gap-2">
							<Icon
								className="h-6 w-6 transition-transform group-hover:scale-110"
								style={{ color: "var(--accent)" }}
							/>
							<span className="text-center font-medium text-sm">
								{skill.name}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
