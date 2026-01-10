import { env } from "~/env";
import type { Project } from "~/lib/data/fallback-projects";

export interface GitHubRepo {
	id: number;
	name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	html_url: string;
	homepage: string | null;
	topics: string[];
	updated_at: string;
	fork: boolean;
	size: number;
}

export async function fetchGitHubRepos(): Promise<Project[]> {
	try {
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `token ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch(
			"https://api.github.com/users/sachins602/repos?sort=updated&per_page=100",
			{
				headers,
				next: { revalidate: 3600 }, // Cache for 1 hour
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const repos: GitHubRepo[] = await response.json();

		// Filter and process repos
		const filtered = repos
			.filter((repo) => {
				// Filter out forks
				if (repo.fork) return false;
				// Filter out very small repos (less than 100 lines)
				if (repo.size < 100) return false;
				// Must have description
				if (!repo.description || repo.description.trim().length === 0)
					return false;
				return true;
			})
			.sort((a, b) => {
				// Sort by stars first, then by updated date
				if (b.stargazers_count !== a.stargazers_count) {
					return b.stargazers_count - a.stargazers_count;
				}
				return (
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);
			})
			.slice(0, 8) // Top 8 repos
			.map((repo) => ({
				id: repo.id,
				name: repo.name,
				description: repo.description ?? "",
				language: repo.language ?? "Other",
				stargazers_count: repo.stargazers_count,
				forks_count: repo.forks_count,
				html_url: repo.html_url,
				homepage: repo.homepage,
				topics: repo.topics,
				updated_at: repo.updated_at,
			}));

		return filtered;
	} catch (error) {
		console.error("Error fetching GitHub repos:", error);
		throw error;
	}
}
