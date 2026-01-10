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
		location: "Remote",
		startDate: "2022-06",
		endDate: "2022-12",
		bullets: [
			"Developed enterprise-level applications using .NET framework",
			"Designed and implemented database schemas and optimized queries",
			"Worked on both frontend and backend development tasks",
			"Participated in code reviews and maintained code quality standards",
			"Delivered features on time while ensuring high code quality",
		],
		technologies: [".NET", "C#", "SQL Server", "JavaScript", "HTML", "CSS"],
	},
];
