"use client";

import { Calendar, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function SubmissionsPage() {
	const utils = api.useUtils();
	const { data: submissions, isLoading } = api.admin.getSubmissions.useQuery();
	const markAsReadMutation = api.admin.markAsRead.useMutation({
		onSuccess: () => {
			utils.admin.getSubmissions.invalidate();
			utils.admin.getSubmissionStats.invalidate();
		},
	});
	const deleteMutation = api.admin.deleteSubmission.useMutation({
		onSuccess: () => {
			utils.admin.getSubmissions.invalidate();
			utils.admin.getSubmissionStats.invalidate();
		},
	});

	const [selectedSubmission, setSelectedSubmission] = useState<number | null>(
		null,
	);

	const formatDate = (timestamp: Date | null) => {
		if (!timestamp) return "N/A";
		return new Date(timestamp).toLocaleString();
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-[var(--text-secondary)]">
					Loading submissions...
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-8 font-bold text-3xl">Contact Form Submissions</h1>

			{submissions && submissions.length === 0 ? (
				<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center">
					<p className="text-[var(--text-secondary)]">No submissions yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{submissions?.map((submission) => (
						<div
							className={`rounded-lg border p-6 ${
								submission.isRead
									? "border-[var(--border)] bg-[var(--bg-secondary)]"
									: "border-[var(--accent)] bg-[var(--bg-secondary)]"
							}`}
							key={submission.id}
						>
							<div className="mb-4 flex items-start justify-between">
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-4">
										<h3 className="font-semibold text-lg">{submission.name}</h3>
										{!submission.isRead && (
											<span className="rounded-full bg-[var(--accent)] px-2 py-1 text-white text-xs">
												New
											</span>
										)}
									</div>
									<div className="mb-2 flex items-center gap-2 text-[var(--text-secondary)] text-sm">
										<Mail className="h-4 w-4" />
										<span>{submission.email}</span>
									</div>
									<div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
										<Calendar className="h-4 w-4" />
										<span>{formatDate(submission.createdAt)}</span>
									</div>
								</div>
								<div className="flex gap-2">
									{!submission.isRead && (
										<button
											className="rounded border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1 text-sm transition-colors hover:bg-[var(--bg-secondary)]"
											onClick={() => {
												markAsReadMutation.mutate({ id: submission.id });
											}}
											type="button"
										>
											Mark as Read
										</button>
									)}
									<button
										className="rounded border border-red-500 bg-red-500/10 px-3 py-1 text-red-500 text-sm transition-colors hover:bg-red-500/20"
										onClick={() => {
											if (
												confirm(
													"Are you sure you want to delete this submission?",
												)
											) {
												deleteMutation.mutate({ id: submission.id });
											}
										}}
										type="button"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
							<button
								className={`w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-left ${
									selectedSubmission === submission.id ? "" : "line-clamp-3"
								}`}
								onClick={() => {
									setSelectedSubmission(
										selectedSubmission === submission.id ? null : submission.id,
									);
								}}
								type="button"
							>
								<p className="whitespace-pre-wrap text-[var(--text-primary)]">
									{submission.message}
								</p>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
