"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function SettingsPage() {
	const utils = api.useUtils();
	const { data: currentStatus } = api.settings.getAvailabilityStatus.useQuery();
	const updateMutation = api.settings.updateAvailabilityStatus.useMutation({
		onSuccess: () => {
			utils.settings.getAvailabilityStatus.invalidate();
			alert("Status updated successfully!");
		},
	});

	const [selectedStatus, setSelectedStatus] = useState<string>(
		currentStatus ?? "Open to opportunities",
	);

	const handleUpdate = () => {
		updateMutation.mutate(
			selectedStatus as
				| "Available for hire"
				| "Open to opportunities"
				| "Currently employed",
		);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-8 font-bold text-3xl">Settings</h1>

			<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
				<h2 className="mb-4 font-semibold text-lg">Availability Status</h2>
				<p className="mb-4 text-[var(--text-secondary)]">
					Current status: <strong>{currentStatus ?? "Not set"}</strong>
				</p>

				<div className="mb-4">
					<label
						className="mb-2 block font-medium text-[var(--text-primary)] text-sm"
						htmlFor="status"
					>
						Select Status
					</label>
					<select
						className="w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
						id="status"
						onChange={(e) => {
							setSelectedStatus(e.target.value);
						}}
						value={selectedStatus}
					>
						<option value="Available for hire">Available for hire</option>
						<option value="Open to opportunities">Open to opportunities</option>
						<option value="Currently employed">Currently employed</option>
					</select>
				</div>

				<button
					className="rounded bg-[var(--accent)] px-4 py-2 text-white transition-colors hover:opacity-90"
					onClick={handleUpdate}
					type="button"
				>
					Update Status
				</button>
			</div>
		</div>
	);
}
