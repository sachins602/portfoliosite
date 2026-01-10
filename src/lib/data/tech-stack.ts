import type { LucideIcon } from "lucide-react";
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

export interface TechNode {
	id: string;
	name: string;
	icon: LucideIcon;
	category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools";
	proficiency: number; // 1-100
	relatedProjects: string[];
}

export interface TechConnection {
	from: string;
	to: string;
	strength: number; // 1-5, how closely related
}

export const techNodes: TechNode[] = [
	// Frontend
	{
		id: "nextjs",
		name: "Next.js",
		icon: Globe,
		category: "Frontend",
		proficiency: 95,
		relatedProjects: ["WeDrive", "B2B Marketplace", "Portfolio Website"],
	},
	{
		id: "react",
		name: "React",
		icon: Code,
		category: "Frontend",
		proficiency: 92,
		relatedProjects: ["WeDrive", "B2B Marketplace", "Portfolio Website"],
	},
	{
		id: "typescript",
		name: "TypeScript",
		icon: Type,
		category: "Frontend",
		proficiency: 90,
		relatedProjects: [
			"WeDrive",
			"B2B Marketplace",
			"Portfolio Website",
			"API Gateway Service",
		],
	},
	{
		id: "tailwind",
		name: "Tailwind CSS",
		icon: Code,
		category: "Frontend",
		proficiency: 88,
		relatedProjects: ["WeDrive", "B2B Marketplace", "Portfolio Website"],
	},
	// Backend
	{
		id: "dotnet",
		name: ".NET",
		icon: Server,
		category: "Backend",
		proficiency: 75,
		relatedProjects: ["WPF Employee Management System"],
	},
	{
		id: "golang",
		name: "Golang",
		icon: Server,
		category: "Backend",
		proficiency: 85,
		relatedProjects: ["API Gateway Service"],
	},
	{
		id: "nodejs",
		name: "Node.js",
		icon: Server,
		category: "Backend",
		proficiency: 88,
		relatedProjects: ["WeDrive", "B2B Marketplace"],
	},
	// Database
	{
		id: "sql",
		name: "SQL",
		icon: Database,
		category: "Database",
		proficiency: 90,
		relatedProjects: [
			"WPF Employee Management System",
			"WeDrive",
			"B2B Marketplace",
		],
	},
	{
		id: "mongodb",
		name: "MongoDB",
		icon: Database,
		category: "Database",
		proficiency: 85,
		relatedProjects: ["WeDrive", "B2B Marketplace"],
	},
	{
		id: "drizzle",
		name: "Drizzle ORM",
		icon: Database,
		category: "Database",
		proficiency: 88,
		relatedProjects: ["Portfolio Website"],
	},
	// DevOps
	{
		id: "docker",
		name: "Docker",
		icon: Box,
		category: "DevOps",
		proficiency: 85,
		relatedProjects: ["API Gateway Service"],
	},
	{
		id: "cicd",
		name: "CI/CD",
		icon: Cloud,
		category: "DevOps",
		proficiency: 80,
		relatedProjects: ["WeDrive", "B2B Marketplace"],
	},
	// Tools
	{
		id: "git",
		name: "Git",
		icon: Wrench,
		category: "Tools",
		proficiency: 95,
		relatedProjects: [],
	},
];

export const techConnections: TechConnection[] = [
	// Frontend connections
	{ from: "nextjs", to: "react", strength: 5 },
	{ from: "react", to: "typescript", strength: 5 },
	{ from: "nextjs", to: "typescript", strength: 5 },
	{ from: "nextjs", to: "tailwind", strength: 4 },
	{ from: "react", to: "tailwind", strength: 4 },
	// Backend connections
	{ from: "nodejs", to: "typescript", strength: 4 },
	{ from: "golang", to: "docker", strength: 3 },
	{ from: "nodejs", to: "docker", strength: 3 },
	// Database connections
	{ from: "nextjs", to: "drizzle", strength: 4 },
	{ from: "nodejs", to: "mongodb", strength: 4 },
	{ from: "nodejs", to: "sql", strength: 3 },
	{ from: "dotnet", to: "sql", strength: 5 },
	// DevOps connections
	{ from: "docker", to: "cicd", strength: 4 },
	{ from: "nextjs", to: "cicd", strength: 3 },
	// Cross-category
	{ from: "typescript", to: "nodejs", strength: 4 },
	{ from: "git", to: "cicd", strength: 5 },
];

// Get nodes by category
export function getNodesByCategory(category: TechNode["category"]): TechNode[] {
	return techNodes.filter((node) => node.category === category);
}

// Get connections for a node
export function getConnectionsForNode(nodeId: string): TechConnection[] {
	return techConnections.filter(
		(conn) => conn.from === nodeId || conn.to === nodeId,
	);
}

// Get related nodes
export function getRelatedNodes(nodeId: string): TechNode[] {
	const connections = getConnectionsForNode(nodeId);
	const relatedIds = connections.map((conn) =>
		conn.from === nodeId ? conn.to : conn.from,
	);
	return techNodes.filter((node) => relatedIds.includes(node.id));
}
