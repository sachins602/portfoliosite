"use client";

import { AlertCircle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

/**
 * React Error Boundary component
 * Catches React rendering errors and prevents the entire app from crashing
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error in development
		if (process.env.NODE_ENV === "development") {
			console.error("ErrorBoundary caught an error:", error, errorInfo);
		}

		// Call optional error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<AlertCircle className="h-12 w-12 text-(--text-secondary)" />
						<div>
							<h3 className="mb-2 font-semibold text-(--text-primary) text-lg">Something went wrong</h3>
							<p className="mb-4 text-(--text-secondary) text-sm">
								{this.state.error?.message || "An unexpected error occurred"}
							</p>
							<button
								className="rounded-lg border border-(--accent) bg-(--accent)/10 px-4 py-2 font-semibold text-(--accent) transition-colors hover:bg-(--accent)/20"
								onClick={this.handleReset}
								type="button"
							>
								Try again
							</button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
