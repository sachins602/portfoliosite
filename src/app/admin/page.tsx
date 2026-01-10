"use client";

import { Mail, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function AdminDashboard() {
	const { data: stats, isLoading } = api.admin.getSubmissionStats.useQuery();
	const { data: status } = api.settings.getAvailabilityStatus.useQuery();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-8 font-bold text-3xl">Analytics Dashboard</h1>

			{/* Stats Cards */}
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
				<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
					<div className="mb-2 flex items-center gap-2">
						<MessageSquare className="h-5 w-5 text-(--accent)" />
						<h2 className="font-semibold text-lg">Total Submissions</h2>
					</div>
					<p className="font-bold text-(--text-primary) text-3xl">
						{isLoading ? "..." : (stats?.total ?? 0)}
					</p>
				</div>

				<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
					<div className="mb-2 flex items-center gap-2">
						<Mail className="h-5 w-5 text-(--accent)" />
						<h2 className="font-semibold text-lg">Unread</h2>
					</div>
					<p className="font-bold text-(--text-primary) text-3xl">
						{isLoading ? "..." : (stats?.unread ?? 0)}
					</p>
				</div>

				<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
					<div className="mb-2 flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-(--accent)" />
						<h2 className="font-semibold text-lg">Read</h2>
					</div>
					<p className="font-bold text-(--text-primary) text-3xl">
						{isLoading ? "..." : (stats?.read ?? 0)}
					</p>
				</div>
			</div>

			{/* Availability Status */}
			<div className="mb-8 rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h2 className="mb-4 font-semibold text-lg">Availability Status</h2>
				<p className="mb-4 text-(--text-secondary)">
					Current status: <strong>{status ?? "Not set"}</strong>
				</p>
				<Link
					className="inline-block rounded bg-(--accent) px-4 py-2 text-white transition-colors hover:opacity-90"
					href="/admin/settings"
				>
					Update Status
				</Link>
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg border border-(--border) bg-(--bg-secondary) p-6">
				<h2 className="mb-4 font-semibold text-lg">Quick Actions</h2>
				<div className="flex flex-wrap gap-4">
					<Link
						className="rounded border border-(--border) bg-(--bg-primary) px-4 py-2 text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
						href="/admin/submissions"
					>
						View All Submissions
					</Link>
				</div>
			</div>
		</div>
	);
}
