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

export interface GitHubEvent {
	id: string;
	type: string;
	repo: {
		name: string;
		url: string;
	};
	created_at: string;
	payload?: {
		action?: string;
		ref?: string;
		ref_type?: string;
		commits?: Array<{
			message: string;
			sha: string;
		}>;
	};
}

export interface ActivityItem {
	id: string;
	type: string;
	message: string;
	repoName: string;
	repoUrl: string;
	timestamp: string;
	timeAgo: string;
}

export async function fetchGitHubEvents(): Promise<ActivityItem[]> {
	try {
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `token ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch(
			"https://api.github.com/users/sachins602/events?per_page=10",
			{
				headers,
				next: { revalidate: 1800 }, // Cache for 30 minutes
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const events: GitHubEvent[] = await response.json();

		const formatTimeAgo = (dateString: string): string => {
			const date = new Date(dateString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			const diffHours = Math.floor(diffMs / 3600000);
			const diffDays = Math.floor(diffMs / 86400000);

			if (diffMins < 1) return "just now";
			if (diffMins < 60)
				return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
			if (diffHours < 24)
				return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
			if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
			return date.toLocaleDateString();
		};

		const formatEventMessage = (event: GitHubEvent): string => {
			const repoName = event.repo.name.split("/")[1] ?? event.repo.name;

			switch (event.type) {
				case "PushEvent":
					return `Pushed to ${repoName}`;
				case "CreateEvent": {
					const refType = event.payload?.ref_type ?? "repository";
					return `Created ${refType} ${repoName}`;
				}
				case "WatchEvent":
					return `Starred ${repoName}`;
				case "ForkEvent":
					return `Forked ${repoName}`;
				case "IssuesEvent": {
					const action = event.payload?.action ?? "updated";
					return `${action.charAt(0).toUpperCase() + action.slice(1)} issue in ${repoName}`;
				}
				case "PullRequestEvent": {
					const prAction = event.payload?.action ?? "updated";
					return `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} pull request in ${repoName}`;
				}
				default:
					return `Activity on ${repoName}`;
			}
		};

		return events
			.filter((event) => {
				// Filter out private events or events we can't format
				return event.repo?.name;
			})
			.slice(0, 10)
			.map((event) => ({
				id: event.id,
				type: event.type,
				message: formatEventMessage(event),
				repoName: event.repo.name.split("/")[1] ?? event.repo.name,
				repoUrl: `https://github.com/${event.repo.name}`,
				timestamp: event.created_at,
				timeAgo: formatTimeAgo(event.created_at),
			}));
	} catch (error) {
		console.error("Error fetching GitHub events:", error);
		return [];
	}
}

export interface ContributionDay {
	date: string;
	contributionCount: number;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

export interface ContributionData {
	weeks: ContributionWeek[];
	totalContributions: number;
}

export async function fetchGitHubContributions(): Promise<ContributionData> {
	try {
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v4+json",
			"Content-Type": "application/json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
		}

		// Calculate date range (past year)
		const endDate = new Date();
		const startDate = new Date();
		startDate.setFullYear(startDate.getFullYear() - 1);

		const query = `
			query($username: String!, $from: DateTime!, $to: DateTime!) {
				user(login: $username) {
					contributionsCollection(from: $from, to: $to) {
						contributionCalendar {
							weeks {
								contributionDays {
									date
									contributionCount
								}
							}
							totalContributions
						}
					}
				}
			}
		`;

		const variables = {
			username: "sachins602",
			from: startDate.toISOString(),
			to: endDate.toISOString(),
		};

		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers,
			body: JSON.stringify({ query, variables }),
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			throw new Error(`GitHub GraphQL API error: ${response.status}`);
		}

		const result = await response.json();

		if (result.errors) {
			throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
		}

		const calendar =
			result.data?.user?.contributionsCollection?.contributionCalendar;

		if (!calendar) {
			throw new Error("No contribution calendar data found");
		}

		return {
			weeks: calendar.weeks ?? [],
			totalContributions: calendar.totalContributions ?? 0,
		};
	} catch (error) {
		console.error("Error fetching GitHub contributions:", error);
		// Return empty data structure on error
		return {
			weeks: [],
			totalContributions: 0,
		};
	}
}
