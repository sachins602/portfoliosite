"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { testimonials } from "~/lib/data/testimonials";
import { TestimonialCard } from "../testimonial-card";

export function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const sectionRef = useScrollTrigger<HTMLElement>((element) => {
		if (prefersReducedMotion()) return;

		const title = element.querySelector(".section-title");
		const content = element.querySelector(".section-content");

		if (title) {
			anime({
				targets: title,
				opacity: [0, 1],
				translateY: [-20, 0],
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}

		if (content) {
			anime({
				targets: content,
				opacity: [0, 1],
				translateY: [30, 0],
				delay: 200,
				duration: timing.normal,
				easing: easing.easeOut,
			});
		}
	});

	// Auto-play carousel
	useEffect(() => {
		if (testimonials.length === 0 || isPaused) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		}, 5000); // Change every 5 seconds

		return () => {
			clearInterval(interval);
		};
	}, [isPaused]);

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	};

	const goToPrevious = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length,
		);
	};

	const goToIndex = (index: number) => {
		setCurrentIndex(index);
	};

	if (testimonials.length === 0) {
		return null; // Don't render if no testimonials
	}

	return (
		<section
			className="section-content min-h-screen py-20"
			id="testimonials"
			ref={sectionRef}
		>
			<div className="container mx-auto px-4">
				<h2 className="section-title mb-12 text-center font-bold text-4xl">
					<span className="relative inline-block">
						Testimonials
						<span className="absolute bottom-0 left-0 h-1 w-full origin-left bg-linear-to-r from-(--accent) to-transparent" />
					</span>
				</h2>

				<section
					aria-label="Testimonials carousel"
					className="section-content relative mx-auto max-w-4xl"
					onMouseEnter={() => {
						setIsPaused(true);
					}}
					onMouseLeave={() => {
						setIsPaused(false);
					}}
				>
					<div className="relative h-80">
						{testimonials.map((testimonial, index) => (
							<TestimonialCard
								index={index}
								isActive={index === currentIndex}
								key={testimonial.id}
								testimonial={testimonial}
							/>
						))}
					</div>

					{testimonials.length > 1 && (
						<>
							<button
								aria-label="Previous testimonial"
								className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 rounded-full border border-(--border) bg-(--bg-secondary) p-2 transition-colors hover:border-(--accent) hover:bg-(--bg-primary)"
								onClick={goToPrevious}
								type="button"
							>
								<ChevronLeft className="h-6 w-6 text-(--accent)" />
							</button>
							<button
								aria-label="Next testimonial"
								className="absolute top-1/2 right-0 -translate-x-full -translate-y-1/2 rounded-full border border-(--border) bg-(--bg-secondary) p-2 transition-colors hover:border-(--accent) hover:bg-(--bg-primary)"
								onClick={goToNext}
								type="button"
							>
								<ChevronRight className="h-6 w-6 text-(--accent)" />
							</button>
						</>
					)}

					{testimonials.length > 1 && (
						<div className="mt-8 flex justify-center gap-2">
							{testimonials.map((testimonial, index) => (
								<button
									aria-label={`Go to testimonial ${index + 1}`}
									className={`h-2 rounded-full transition-all ${
										index === currentIndex
											? "w-8 bg-(--accent)"
											: "w-2 bg-(--border)"
									}`}
									key={`testimonial-dot-${testimonial.id}`}
									onClick={() => {
										goToIndex(index);
									}}
									type="button"
								/>
							))}
						</div>
					)}
				</section>
			</div>
		</section>
	);
}
