import { experiences } from "~/lib/data/experience";
import { fallbackProjects } from "~/lib/data/fallback-projects";

const skills = [
	"Next.js",
	"React",
	"TypeScript",
	"Tailwind CSS",
	".NET",
	"Golang",
	"Node.js",
	"SQL",
	"MongoDB",
	"Drizzle ORM",
	"Docker",
	"CI/CD",
	"Git",
];

export function processCommand(input: string): string[] {
	const command = input.trim().toLowerCase();
	const parts = input.trim().split(/\s+/);

	// Clear command
	if (command === "clear") {
		return [];
	}

	// Help command
	if (command === "help") {
		return [
			"Available commands:",
			"  help          - Show this help message",
			"  whoami       - Display name and title",
			"  skills       - List technical skills",
			"  experience   - Show work history summary",
			"  projects     - List featured projects",
			"  contact      - Show contact information",
			"  clear        - Clear terminal output",
			"",
			"Easter eggs:",
			"  sudo hire-me",
			'  git commit -m "hired"',
			"  ls",
			"  cat readme",
		];
	}

	// Whoami command
	if (command === "whoami") {
		return [
			"Sachin Sapkota",
			"Full-Stack Developer | Next.js, TypeScript & Golang",
			"Building scalable web apps from Ontario, Canada",
		];
	}

	// Skills command
	if (command === "skills") {
		return ["Technical Skills:", "", ...skills.map((skill) => `  • ${skill}`)];
	}

	// Experience command
	if (command === "experience") {
		const lines: string[] = ["Work Experience:", ""];
		experiences.forEach((exp) => {
			const endDate = exp.endDate ?? "Present";
			lines.push(
				`${exp.title} at ${exp.company}`,
				`  Location: ${exp.location}`,
				`  Period: ${exp.startDate} - ${endDate}`,
				`  Technologies: ${exp.technologies.join(", ")}`,
				"",
			);
		});
		return lines;
	}

	// Projects command
	if (command === "projects") {
		const lines: string[] = ["Featured Projects:", ""];
		fallbackProjects.slice(0, 6).forEach((project) => {
			lines.push(
				`${project.name}`,
				`  ${project.description}`,
				`  Language: ${project.language}`,
				`  Stars: ${project.stargazers_count} | Forks: ${project.forks_count}`,
				"",
			);
		});
		return lines;
	}

	// Contact command
	if (command === "contact") {
		return [
			"Contact Information:",
			"",
			"  Email: sachinsapkota4@gmail.com",
			"  GitHub: github.com/sachins602",
			"  LinkedIn: linkedin.com/in/sachin-sapkota",
			"  Location: Ontario, Canada",
		];
	}

	// Easter egg: sudo hire-me
	if (command === "sudo hire-me") {
		return [
			"🎉 You're hired! (In my dreams)",
			"",
			"Actually, I'm open to opportunities!",
			"Feel free to reach out via the contact form.",
			"",
			"Let's build something amazing together! 🚀",
		];
	}

	// Easter egg: git commit
	if (parts[0] === "git" && parts[1] === "commit" && parts[2] === "-m") {
		const message = parts.slice(3).join(" ");
		if (message.toLowerCase().includes("hired")) {
			return [
				'[main abc1234] "hired"',
				" 1 file changed, 1 insertion(+)",
				"",
				"✨ Congratulations! You've successfully committed to hiring me!",
				"",
				"Now let's make this a reality. Contact me! 📧",
			];
		}
		return [`[main abc1234] "${message}"`, " 1 file changed, 1 insertion(+)"];
	}

	// Easter egg: ls
	if (command === "ls") {
		return [
			"Portfolio Sections:",
			"",
			"  about/       - About me and skills",
			"  experience/  - Work history",
			"  projects/    - Featured projects",
			"  contact/     - Get in touch",
		];
	}

	// Easter egg: cat readme
	if (parts[0] === "cat" && parts[1] === "readme") {
		return [
			"README.md",
			"",
			"# Sachin Sapkota - Full-Stack Developer",
			"",
			"## About",
			"Passionate Full-Stack Developer specializing in Next.js, React,",
			"TypeScript, and Golang. Based in Ontario, Canada.",
			"",
			"## Skills",
			"Expert in modern web technologies, cloud integrations, and",
			"DevOps practices. Always learning, always building.",
			"",
			"## Contact",
			"Open to remote opportunities and exciting projects!",
			"",
			"---",
			"Let's connect and build something great! 🚀",
		];
	}

	// Unknown command
	return [
		`Command not found: ${input}`,
		"Type 'help' to see available commands.",
	];
}
