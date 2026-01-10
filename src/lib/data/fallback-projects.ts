export interface Project {
	id: number;
	name: string;
	description: string;
	language: string;
	stargazers_count: number;
	forks_count: number;
	html_url: string;
	homepage: string | null;
	topics: string[];
	updated_at: string;
}

export const fallbackProjects: Project[] = [
	{
		id: 1,
		name: "WeDrive",
		description:
			"A ride-sharing application built with Next.js and TypeScript, featuring real-time location tracking and payment integration.",
		language: "TypeScript",
		stargazers_count: 15,
		forks_count: 3,
		html_url: "https://github.com/sachins602/wedrive",
		homepage: null,
		topics: ["nextjs", "typescript", "react", "ride-sharing"],
		updated_at: new Date().toISOString(),
	},
	{
		id: 2,
		name: "AI Urban Planning Dashboard",
		description:
			"An intelligent dashboard for urban planning using AI/ML algorithms to analyze city data and provide insights.",
		language: "Python",
		stargazers_count: 8,
		forks_count: 2,
		html_url: "https://github.com/sachins602/ai-urban-planning",
		homepage: null,
		topics: ["python", "ai", "ml", "dashboard", "urban-planning"],
		updated_at: new Date().toISOString(),
	},
	{
		id: 3,
		name: "WPF Employee Management System",
		description:
			"A desktop application for managing employee data, built with WPF and .NET, featuring CRUD operations and reporting.",
		language: "C#",
		stargazers_count: 12,
		forks_count: 4,
		html_url: "https://github.com/sachins602/wpf-employee-management",
		homepage: null,
		topics: ["csharp", "wpf", "dotnet", "desktop-app"],
		updated_at: new Date().toISOString(),
	},
	{
		id: 4,
		name: "B2B Marketplace",
		description:
			"A business-to-business marketplace platform connecting suppliers and buyers with advanced search and filtering.",
		language: "TypeScript",
		stargazers_count: 20,
		forks_count: 5,
		html_url: "https://github.com/sachins602/b2b-marketplace",
		homepage: null,
		topics: ["nextjs", "typescript", "marketplace", "ecommerce"],
		updated_at: new Date().toISOString(),
	},
	{
		id: 5,
		name: "Portfolio Website",
		description: "This portfolio website built with Next.js 16, React 19, and anime.js animations.",
		language: "TypeScript",
		stargazers_count: 0,
		forks_count: 0,
		html_url: "https://github.com/sachins602/portfoliosite",
		homepage: null,
		topics: ["nextjs", "react", "typescript", "portfolio", "animejs"],
		updated_at: new Date().toISOString(),
	},
	{
		id: 6,
		name: "API Gateway Service",
		description: "A microservices API gateway built with Golang, handling routing, authentication, and rate limiting.",
		language: "Go",
		stargazers_count: 10,
		forks_count: 2,
		html_url: "https://github.com/sachins602/api-gateway",
		homepage: null,
		topics: ["golang", "microservices", "api-gateway", "backend"],
		updated_at: new Date().toISOString(),
	},
];
