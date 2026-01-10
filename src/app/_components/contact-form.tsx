"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { api } from "~/trpc/react";

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
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
		<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
			<div>
				<label className="mb-2 block font-medium text-(--text-secondary) text-sm" htmlFor="name">
					Name
				</label>
				<input
					className={`w-full rounded-lg border bg-(--bg-secondary) px-4 py-3 ${
						errors.name ? "border-red-500" : "border-(--border) focus:border-(--accent)"
					} transition-all focus:outline-none focus:ring-(--accent)/20 focus:ring-2`}
					id="name"
					onBlur={handleInputBlur}
					onChange={(e) => setName(e.target.value)}
					onFocus={handleInputFocus}
					placeholder="Your name"
					type="text"
					value={name}
				/>
				{errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
			</div>

			<div>
				<label className="mb-2 block font-medium text-(--text-secondary) text-sm" htmlFor="email">
					Email
				</label>
				<input
					className={`w-full rounded-lg border bg-(--bg-secondary) px-4 py-3 ${
						errors.email ? "border-red-500" : "border-(--border) focus:border-(--accent)"
					} transition-all focus:outline-none focus:ring-(--accent)/20 focus:ring-2`}
					id="email"
					onBlur={handleInputBlur}
					onChange={(e) => setEmail(e.target.value)}
					onFocus={handleInputFocus}
					placeholder="your.email@example.com"
					type="email"
					value={email}
				/>
				{errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
			</div>

			<div>
				<label className="mb-2 block font-medium text-(--text-secondary) text-sm" htmlFor="message">
					Message
				</label>
				<textarea
					className={`w-full rounded-lg border bg-(--bg-secondary) px-4 py-3 ${
						errors.message ? "border-red-500" : "border-(--border) focus:border-(--accent)"
					} resize-none transition-all focus:outline-none focus:ring-(--accent)/20 focus:ring-2`}
					id="message"
					onBlur={handleInputBlur}
					onChange={(e) => setMessage(e.target.value)}
					onFocus={handleInputFocus}
					placeholder="Your message..."
					rows={6}
					value={message}
				/>
				{errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message}</p>}
			</div>

			<button
				className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-8 py-4 font-semibold text-white transition-colors hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin" />
						<span>Sending...</span>
					</>
				) : (
					"Send Message"
				)}
			</button>

			{submitStatus === "success" && (
				<div
					className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/20 p-4"
					ref={successRef}
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					<CheckCircle className="h-5 w-5 text-green-500" />
					<p className="text-green-500">{submitMessage}</p>
				</div>
			)}

			{submitStatus === "error" && (
				<div
					className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4"
					ref={errorRef}
					style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
				>
					<XCircle className="h-5 w-5 text-red-500" />
					<p className="text-red-500">{submitMessage}</p>
				</div>
			)}
		</form>
	);
}
