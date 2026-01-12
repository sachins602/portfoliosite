import * as React from "react";
import { cn } from "~/lib/utils";

interface SectionProps extends React.ComponentPropsWithRef<"section"> {
	container?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
	({ children, container = true, className, ...props }, ref) => {
		const content = container ? <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div> : children;

		return (
			<section className={cn("py-20", className)} ref={ref} {...props}>
				{content}
			</section>
		);
	},
);

Section.displayName = "Section";
