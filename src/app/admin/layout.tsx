"use client";

import { useEffect, useState } from "react";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [password, setPassword] = useState("");

	useEffect(() => {
		// Check if already authenticated
		const authStatus = sessionStorage.getItem("admin_authenticated");
		if (authStatus === "true") {
			setIsAuthenticated(true);
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		// Simple password check - in production, use proper authentication
		const response = await fetch("/api/admin/auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});

		if (response.ok) {
			sessionStorage.setItem("admin_authenticated", "true");
			setIsAuthenticated(true);
		} else {
			alert("Invalid password");
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-(--text-secondary)">Loading...</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="w-full max-w-md rounded-lg border border-(--border) bg-(--bg-secondary) p-8">
					<h1 className="mb-6 text-center font-bold text-2xl">Admin Login</h1>
					<form onSubmit={handleLogin}>
						<div className="mb-4">
							<label
								className="mb-2 block font-medium text-(--text-primary) text-sm"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="w-full rounded border border-(--border) bg-(--bg-primary) px-4 py-2 text-(--text-primary) focus:border-(--accent) focus:outline-none"
								id="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								type="password"
								value={password}
							/>
						</div>
						<button
							className="w-full rounded bg-(--accent) px-4 py-2 font-medium text-white transition-colors hover:opacity-90"
							type="submit"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-(--bg-primary)">
			<nav className="border-(--border) border-b bg-(--bg-secondary)">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<h1 className="font-bold text-xl">Admin Dashboard</h1>
					<div className="flex gap-4">
						<a className="text-(--accent) hover:underline" href="/admin">
							Dashboard
						</a>
						<a
							className="text-(--accent) hover:underline"
							href="/admin/submissions"
						>
							Submissions
						</a>
						<button
							className="text-(--text-secondary) hover:underline"
							onClick={() => {
								sessionStorage.removeItem("admin_authenticated");
								window.location.href = "/admin";
							}}
							type="button"
						>
							Logout
						</button>
					</div>
				</div>
			</nav>
			<main>{children}</main>
		</div>
	);
}
