"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectSearchProps {
	onSearchChange: (query: string) => void;
}

export function ProjectSearch({ onSearchChange }: ProjectSearchProps) {
	const [query, setQuery] = useState("");
	const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

	useEffect(() => {
		// Debounce search
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			onSearchChange(query);
		}, 300) as unknown as NodeJS.Timeout;

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [query, onSearchChange]);

	return (
		<div className="relative mb-8">
			<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-(--text-secondary)" />
			<input
				className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) px-12 py-3 text-(--text-primary) outline-none transition-colors focus:border-(--accent) focus:ring-(--accent)/20 focus:ring-2"
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search projects by name, description, or tech stack..."
				type="text"
				value={query}
			/>
			{query && (
				<button
					className="absolute top-1/2 right-4 -translate-y-1/2 text-(--text-secondary) hover:text-(--accent)"
					onClick={() => setQuery("")}
					type="button"
				>
					×
				</button>
			)}
		</div>
	);
}
