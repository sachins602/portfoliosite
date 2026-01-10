"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import anime from "animejs";
import { api } from "~/trpc/react";
import { prefersReducedMotion, timing, easing } from "~/lib/animations";

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [submitMessage, setSubmitMessage] = useState("");

	const formRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLDivElement>(null);
	const errorRef = useRef<HTMLDivElement>(null);

	const submitMutation = api.contact.submitContact.useMutation({
		onSuccess: (data) => {
			setSubmitStatus("success");
			setSubmitMessage(data.message);
			setName("");
			setEmail("");
			setMessage("");
			setErrors({});

			if (!prefersReducedMotion() && successRef.current) {
				anime({
					targets: successRef.current,
					opacity: [0, 1],
					scale: [0.8, 1],
					duration: timing.normal,
					easing: easing.elasticOut,
				});
			}
		},
		onError: (error) => {
			setSubmitStatus("error");
			setSubmitMessage(error.message || "Something went wrong. Please try again.");

			if (!prefersReducedMotion() && errorRef.current) {
				anime({
					targets: errorRef.current,
					opacity: [0, 1],
					translateX: [-10, 0, 10, 0],
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Invalid email address";
		}

		if (!message.trim()) {
			newErrors.message = "Message is required";
		} else if (message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitStatus("idle");

		if (!validate()) {
			if (!prefersReducedMotion() && formRef.current) {
				anime({
					targets: formRef.current,
					translateX: [-10, 10, -10, 10, 0],
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
			return;
		}

		setIsSubmitting(true);
		submitMutation.mutate({ name, email, message });
	};

	const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (!prefersReducedMotion()) {
			anime({
				targets: e.target,
				scale: [1, 1.02],
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (!prefersReducedMotion()) {
			anime({
				targets: e.target,
				scale: [1.02, 1],
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium mb-2 text-[var(--text-secondary)]"
				>
					Name
				</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					className={`w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border ${
						errors.name
							? "border-red-500"
							: "border-[var(--border)] focus:border-[var(--accent)]"
					} focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all`}
					placeholder="Your name"
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-500">{errors.name}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-2 text-[var(--text-secondary)]"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					className={`w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border ${
						errors.email
							? "border-red-500"
							: "border-[var(--border)] focus:border-[var(--accent)]"
					} focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all`}
					placeholder="your.email@example.com"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-500">{errors.email}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="message"
					className="block text-sm font-medium mb-2 text-[var(--text-secondary)]"
				>
					Message
				</label>
				<textarea
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					rows={6}
					className={`w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border ${
						errors.message
							? "border-red-500"
							: "border-[var(--border)] focus:border-[var(--accent)]"
					} focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none`}
					placeholder="Your message..."
				/>
				{errors.message && (
					<p className="mt-1 text-sm text-red-500">{errors.message}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="w-5 h-5 animate-spin" />
						<span>Sending...</span>
					</>
				) : (
					"Send Message"
				)}
			</button>

			{submitStatus === "success" && (
				<div
					ref={successRef}
					className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-3"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					<CheckCircle className="w-5 h-5 text-green-500" />
					<p className="text-green-500">{submitMessage}</p>
				</div>
			)}

			{submitStatus === "error" && (
				<div
					ref={errorRef}
					className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3"
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					<XCircle className="w-5 h-5 text-red-500" />
					<p className="text-red-500">{submitMessage}</p>
				</div>
			)}
		</form>
	);
}
