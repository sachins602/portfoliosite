interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	variant?: "default" | "text" | "circular" | "rectangular";
	width?: string | number;
	height?: string | number;
}

export function Skeleton({ className, variant = "default", width, height, style, ...props }: SkeletonProps) {
	const baseClasses = "animate-pulse bg-(--border)";

	const variantClasses = {
		default: "rounded-md",
		text: "rounded",
		circular: "rounded-full",
		rectangular: "rounded-none",
	};

	const combinedStyle: React.CSSProperties = {
		...(width && { width: typeof width === "number" ? `${width}px` : width }),
		...(height && { height: typeof height === "number" ? `${height}px` : height }),
		...style,
	};

	return (
		<div className={`${baseClasses} ${variantClasses[variant]} ${className ?? ""}`} style={combinedStyle} {...props} />
	);
}
