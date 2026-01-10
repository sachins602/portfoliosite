"use client";

import { useEffect, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

const statusColors: Record<string, string> = {
	"Available for hire": "bg-green-500",
	"Open to opportunities": "bg-blue-500",
	"Currently employed": "bg-purple-500",
};

const statusLabels: Record<string, string> = {
	"Available for hire": "Available",
	"Open to opportunities": "Open",
	"Currently employed": "Employed",
};

export function AvailabilityBadge() {
	const badgeRef = useRef<HTMLDivElement>(null);
	const { data: status } = api.settings.getAvailabilityStatus.useQuery();

	useEffect(() => {
		if (!badgeRef.current || prefersReducedMotion() || !status) {
			return;
		}

		// Pulse animation
		anime({
			targets: badgeRef.current,
			scale: [1, 1.1, 1],
			duration: timing.slow,
			easing: easing.easeInOut,
			loop: true,
			direction: "alternate",
		});
	}, [status]);

	if (!status) {
		return null;
	}

	return (
		<div
			className="flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-4 py-2"
			ref={badgeRef}
		>
			<div
				className={`h-2 w-2 rounded-full ${statusColors[status] ?? statusColors["Open to opportunities"]}`}
			/>
			<span className="font-medium text-(--text-primary) text-sm">
				{statusLabels[status] ?? status}
			</span>
		</div>
	);
}
