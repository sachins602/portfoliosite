"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";

interface CodeSnippet {
	id: string;
	title: string;
	language: string;
	code: string;
}

const snippets: CodeSnippet[] = [
	{
		id: "anime-hook",
		title: "Anime.js Hook",
		language: "typescript",
		code: `export function useStaggerReveal<T extends HTMLElement>(
  items: unknown[],
  options?: {
    duration?: number;
    staggerDelay?: number;
  }
) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    anime({
      targets: ref.current.children,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100),
      duration: 500,
      easing: 'easeOutQuad'
    });
  }, []);
  
  return ref;
}`,
	},
	{
		id: "github-api",
		title: "GitHub API Integration",
		language: "typescript",
		code: `export async function fetchGitHubRepos(): Promise<Project[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  
  if (env.GITHUB_TOKEN) {
    headers.Authorization = \`token \${env.GITHUB_TOKEN}\`;
  }
  
  const response = await fetch(
    "https://api.github.com/users/sachins602/repos",
    {
      headers,
      next: { revalidate: 3600 }
    }
  );
  
  return response.json();
}`,
	},
	{
		id: "trpc-router",
		title: "tRPC Router",
		language: "typescript",
		code: `export const projectsRouter = createTRPCRouter({
  getProjects: publicProcedure.query(async () => {
    try {
      const projects = await fetchGitHubRepos();
      return projects;
    } catch (error) {
      console.error("Failed to fetch:", error);
      return fallbackProjects;
    }
  }),
});`,
	},
];

export function CodeCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const goToNext = () => {
		if (currentIndex < snippets.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			setCurrentIndex(0);
		}
	};

	const goToPrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		} else {
			setCurrentIndex(snippets.length - 1);
		}
	};

	// Animate on index change
	useEffect(() => {
		if (!containerRef.current || prefersReducedMotion()) return;

		const codeBlock = containerRef.current.querySelector(".code-block");
		if (codeBlock) {
			anime({
				targets: codeBlock,
				opacity: [0, 1],
				translateX: [20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- currentIndex is intentionally used to trigger animation
	}, [currentIndex]);

	const currentSnippet = snippets[currentIndex] ?? snippets[0];

	if (!currentSnippet) {
		return null;
	}

	return (
		<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
			<div className="mb-4 flex items-center justify-between">
				<h4 className="font-semibold text-lg">{currentSnippet.title}</h4>
				<div className="flex items-center gap-2">
					<button
						aria-label="Previous snippet"
						className="rounded p-2 transition-colors hover:bg-[var(--bg-primary)]"
						onClick={goToPrevious}
						type="button"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<span className="text-[var(--text-secondary)] text-sm">
						{currentIndex + 1} / {snippets.length}
					</span>
					<button
						aria-label="Next snippet"
						className="rounded p-2 transition-colors hover:bg-[var(--bg-primary)]"
						onClick={goToNext}
						type="button"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>
			<div className="relative" ref={containerRef}>
				<pre className="code-block overflow-x-auto rounded-lg bg-[var(--bg-primary)] p-4 text-sm">
					<code className="text-[var(--text-primary)]">
						{currentSnippet.code}
					</code>
				</pre>
			</div>
		</div>
	);
}
