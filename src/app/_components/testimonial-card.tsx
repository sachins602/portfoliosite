"use client";

import { ExternalLink, Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import type { Testimonial } from "~/lib/data/testimonials";

interface TestimonialCardProps {
	testimonial: Testimonial;
	index: number;
	isActive: boolean;
}

export function TestimonialCard({
	testimonial,
	index: _index,
	isActive,
}: TestimonialCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!cardRef.current || prefersReducedMotion()) {
			if (cardRef.current) {
				cardRef.current.style.opacity = "1";
			}
			return;
		}

		if (isActive) {
			anime({
				targets: cardRef.current,
				opacity: [0, 1],
				scale: [0.9, 1],
				rotateY: [15, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		} else {
			anime({
				targets: cardRef.current,
				opacity: [1, 0],
				scale: [1, 0.9],
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	}, [isActive]);

	return (
		<div
			className={`absolute inset-0 flex flex-col justify-between rounded-lg border border-(--border) bg-(--bg-secondary) p-6 shadow-lg transition-all ${
				isActive
					? "pointer-events-auto opacity-100"
					: "pointer-events-none opacity-0"
			}`}
			ref={cardRef}
			style={{
				opacity: prefersReducedMotion() ? (isActive ? 1 : 0) : undefined,
			}}
		>
			<div>
				<div className="mb-4 text-(--accent)">
					<Quote className="h-8 w-8" />
				</div>
				<blockquote className="mb-4 text-(--text-primary) text-lg italic">
					"{testimonial.quote}"
				</blockquote>
			</div>

			<div className="flex items-center gap-4">
				{testimonial.avatar ? (
					<Image
						alt={testimonial.author}
						className="h-12 w-12 rounded-full object-cover"
						height={48}
						src={testimonial.avatar}
						width={48}
					/>
				) : (
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--accent)/20 font-semibold text-(--accent)">
						{testimonial.author.charAt(0).toUpperCase()}
					</div>
				)}
				<div className="flex-1">
					<div className="font-semibold text-(--text-primary)">
						{testimonial.author}
					</div>
					<div className="text-(--text-secondary) text-sm">
						{testimonial.title} at {testimonial.company}
					</div>
				</div>
				{testimonial.linkedInUrl && (
					<a
						aria-label="View LinkedIn recommendation"
						className="rounded p-2 transition-colors hover:bg-(--bg-primary)"
						href={testimonial.linkedInUrl}
						rel="noopener noreferrer"
						target="_blank"
					>
						<ExternalLink className="h-5 w-5 text-(--accent)" />
					</a>
				)}
			</div>
		</div>
	);
}
