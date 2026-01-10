export interface Experience {
	id: string;
	title: string;
	company: string;
	location: string;
	startDate: string;
	endDate: string | null; // null means "Present"
	bullets: string[];
	technologies: string[];
}

export const experiences: Experience[] = [
	{
		id: "1",
		title: "Full Stack Developer",
		company: "Prodigitips Media Agency",
		location: "Remote",
		startDate: "2023-01",
		endDate: null, // Present
		bullets: [
			"Developed and maintained full-stack web applications using Next.js, React, and TypeScript",
			"Implemented responsive UI components with Tailwind CSS and modern design patterns",
			"Built RESTful APIs and integrated third-party services",
			"Collaborated with cross-functional teams to deliver high-quality software solutions",
			"Optimized application performance and implemented best practices for scalability",
		],
		technologies: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Node.js",
			"SQL",
		],
	},
	{
		id: "2",
		title: "Software Developer",
		company: "E-MultiTech Pvt. Ltd.",
		location: "Hybrid",
		startDate: "2022-06",
		endDate: "2022-12",
		bullets: [
			"Helped design and implement scalable backend services using Nest.js and microservice architecture",
			"Built reusable UI components with React and styled them using Tailwind CSS",
			"Integrated PostgreSQL with Prisma ORM for efficient and type-safe database access",
			"Helped develop a real-time chat and notification system using WebSocket and Redis Pub/Sub",
			"Used Swagger for API documentation and testing, ensuring clarity for internal/external teams",
			"Helped implement authentication and role-based authorization across services",
			"Collaborated on CI/CD pipeline setup",
		],
		technologies: [
			"Nest.js",
			"React",
			"TypeScript",
			"Prisma",
			"Tailwind CSS",
			"Swagger",
			"Microservice",
			"Redis",
			"PostgreSQL",
			"WebSocket",
		],
	},
];
