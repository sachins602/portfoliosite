export interface Testimonial {
	id: string;
	quote: string;
	author: string;
	title: string;
	company: string;
	avatar?: string;
	linkedInUrl?: string;
}

export const testimonials: Testimonial[] = [
	// Empty array for now - can be populated later with actual testimonials
];
