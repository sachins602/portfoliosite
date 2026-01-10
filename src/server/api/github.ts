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
				// TODO: Change to 3 days for production
				next: { revalidate: 0 }, // Cache for 3 days
			},
		);

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const repos: GitHubRepo[] = await response.json();

		// Process repos (no filtering - show all repos)
		const filtered = repos
			.sort((a, b) => {
				// Sort by stars first, then by updated date
				if (b.stargazers_count !== a.stargazers_count) {
					return b.stargazers_count - a.stargazers_count;
				}
				return (
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
				);
			})
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
			Accept: "application/vnd.github.v4+json",
			"Content-Type": "application/json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
		}

		// Use GraphQL to fetch recent activity from repositories
		// This is more reliable than the Events API which often returns empty
		const query = `
			query($username: String!) {
				user(login: $username) {
					repositories(
						first: 2,
						ownerAffiliations: OWNER,
						orderBy: {field: UPDATED_AT, direction: DESC}
					) {
						nodes {
							name
							url
							defaultBranchRef {
								target {
									... on Commit {
										history(first: 3) {
											nodes {
												oid
												messageHeadline
												committedDate
												url
											}
										}
									}
								}
							}
							updatedAt
						}
					}
				}
			}
		`;

		const variables = {
			username: "sachins602",
		};

		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers,
			body: JSON.stringify({ query, variables }),
			next: { revalidate: 0 }, // Cache for 30 minutes
		});

		if (!response.ok) {
			throw new Error(`GitHub GraphQL API error: ${response.status}`);
		}

		const result = await response.json();

		if (result.errors) {
			console.error("GraphQL errors:", result.errors);
			// Fallback to REST API if GraphQL fails
			return await fetchGitHubEventsFallback();
		}

		const repos = result.data?.user?.repositories?.nodes ?? [];

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

		const activities: ActivityItem[] = [];

		// Collect commits, PRs, and issues from all repos
		for (const repo of repos) {
			const repoName = repo.name;
			const repoUrl = repo.url;

			// Add recent commits
			const commits = repo.defaultBranchRef?.target?.history?.nodes ?? [];
			for (const commit of commits) {
				activities.push({
					id: `commit-${commit.oid}`,
					type: "PushEvent",
					message: `Pushed to ${repoName}: ${commit.messageHeadline}`,
					repoName,
					repoUrl,
					timestamp: commit.committedDate,
					timeAgo: formatTimeAgo(commit.committedDate),
				});
			}

			// Add recent pull requests
			const prs = repo.pullRequests?.nodes ?? [];
			for (const pr of prs) {
				activities.push({
					id: `pr-${repoName}-${pr.number}`,
					type: "PullRequestEvent",
					message: `${pr.state === "MERGED" ? "Merged" : "Updated"} pull request in ${repoName}: ${pr.title}`,
					repoName,
					repoUrl: pr.url,
					timestamp: pr.updatedAt,
					timeAgo: formatTimeAgo(pr.updatedAt),
				});
			}

			// Add recent issues
			const issues = repo.issues?.nodes ?? [];
			for (const issue of issues) {
				activities.push({
					id: `issue-${repoName}-${issue.number}`,
					type: "IssuesEvent",
					message: `Opened issue in ${repoName}: ${issue.title}`,
					repoName,
					repoUrl: issue.url,
					timestamp: issue.updatedAt,
					timeAgo: formatTimeAgo(issue.updatedAt),
				});
			}
		}

		// Sort by timestamp (most recent first)
		return activities.sort(
			(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
	} catch (error) {
		console.error("Error fetching GitHub events:", error);
		// Fallback to REST API
		return await fetchGitHubEventsFallback();
	}
}

// Fallback to REST API Events endpoint
async function fetchGitHubEventsFallback(): Promise<ActivityItem[]> {
	try {
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `token ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch(
			"https://api.github.com/users/sachins602/events?per_page=6",
			{
				headers,
				next: { revalidate: 1800 },
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
				return event.repo?.name;
			})
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
		console.error("Error in fallback GitHub events fetch:", error);
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

// ============ GitHub User Stats ============

export interface GitHubUserStats {
	totalCommits: number;
	totalPRs: number;
	totalIssues: number;
	totalStars: number;
	totalRepos: number;
	followers: number;
	following: number;
}

export async function fetchGitHubUserStats(): Promise<GitHubUserStats> {
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
						totalCommitContributions
						totalPullRequestContributions
						totalIssueContributions
						totalPullRequestReviewContributions
					}
					repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
						totalCount
						nodes {
							stargazerCount
						}
					}
					followers {
						totalCount
					}
					following {
						totalCount
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

		const user = result.data?.user;
		if (!user) {
			throw new Error("No user data found");
		}

		const contributions = user.contributionsCollection;
		const totalStars =
			user.repositories.nodes?.reduce(
				(sum: number, repo: { stargazerCount: number }) =>
					sum + (repo?.stargazerCount ?? 0),
				0,
			) ?? 0;

		return {
			totalCommits: contributions?.totalCommitContributions ?? 0,
			totalPRs: contributions?.totalPullRequestContributions ?? 0,
			totalIssues: contributions?.totalIssueContributions ?? 0,
			totalStars,
			totalRepos: user.repositories?.totalCount ?? 0,
			followers: user.followers?.totalCount ?? 0,
			following: user.following?.totalCount ?? 0,
		};
	} catch (error) {
		console.error("Error fetching GitHub user stats:", error);
		return {
			totalCommits: 0,
			totalPRs: 0,
			totalIssues: 0,
			totalStars: 0,
			totalRepos: 0,
			followers: 0,
			following: 0,
		};
	}
}

// ============ Language Statistics ============

export interface LanguageStat {
	name: string;
	percentage: number;
	color: string;
	bytes: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Python: "#3572A5",
	Go: "#00ADD8",
	Rust: "#dea584",
	Java: "#b07219",
	"C++": "#f34b7d",
	C: "#555555",
	"C#": "#178600",
	PHP: "#4F5D95",
	Ruby: "#701516",
	Swift: "#F05138",
	Kotlin: "#A97BFF",
	Dart: "#00B4AB",
	HTML: "#e34c26",
	CSS: "#563d7c",
	SCSS: "#c6538c",
	Vue: "#41b883",
	Shell: "#89e051",
	Dockerfile: "#384d54",
	Other: "#8b949e",
};

export async function fetchLanguageStats(): Promise<LanguageStat[]> {
	try {
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
		};

		if (env.GITHUB_TOKEN) {
			headers.Authorization = `token ${env.GITHUB_TOKEN}`;
		}

		// First, get all repos
		const reposResponse = await fetch(
			"https://api.github.com/users/sachins602/repos?per_page=100",
			{
				headers,
				next: { revalidate: 3600 },
			},
		);

		if (!reposResponse.ok) {
			throw new Error(`GitHub API error: ${reposResponse.status}`);
		}

		const repos: GitHubRepo[] = await reposResponse.json();

		// Fetch languages for each repo and aggregate
		const languageTotals: Record<string, number> = {};

		await Promise.all(
			repos.map(async (repo) => {
				try {
					const langResponse = await fetch(
						`https://api.github.com/repos/sachins602/${repo.name}/languages`,
						{
							headers,
							next: { revalidate: 3600 },
						},
					);

					if (langResponse.ok) {
						const languages: Record<string, number> = await langResponse.json();
						for (const [lang, bytes] of Object.entries(languages)) {
							languageTotals[lang] = (languageTotals[lang] ?? 0) + bytes;
						}
					}
				} catch {
					// Skip repos that fail
				}
			}),
		);

		// Convert to array and calculate percentages
		const totalBytes = Object.values(languageTotals).reduce(
			(sum, bytes) => sum + bytes,
			0,
		);

		const stats: LanguageStat[] = Object.entries(languageTotals)
			.map(([name, bytes]) => ({
				name,
				bytes,
				percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
				color: LANGUAGE_COLORS[name] ?? LANGUAGE_COLORS.Other ?? "#8b949e",
			}))
			.sort((a, b) => b.bytes - a.bytes);

		return stats;
	} catch (error) {
		console.error("Error fetching language stats:", error);
		return [];
	}
}
