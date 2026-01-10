"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import anime from "animejs";
import { prefersReducedMotion, timing, easing, stagger } from "~/lib/animations";
import Link from "next/link";

const navLinks = [
	{ href: "#about", label: "About" },
	{ href: "#experience", label: "Experience" },
	{ href: "#projects", label: "Projects" },
	{ href: "#contact", label: "Contact" },
];

export function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!menuRef.current || !overlayRef.current || !linksRef.current) return;

		if (isOpen) {
			// Open animation
			if (!prefersReducedMotion()) {
				anime({
					targets: menuRef.current,
					translateX: ["100%", "0%"],
					duration: timing.normal,
					easing: easing.easeOut,
				});

				anime({
					targets: overlayRef.current,
					opacity: [0, 1],
					duration: timing.fast,
				});

				anime({
					targets: linksRef.current.children,
					opacity: [0, 1],
					translateX: [30, 0],
					delay: anime.stagger(stagger.fast),
					duration: timing.normal,
					easing: easing.easeOut,
				});
			} else {
				menuRef.current.style.transform = "translateX(0)";
				overlayRef.current.style.opacity = "1";
			}
		} else {
			// Close animation
			if (!prefersReducedMotion()) {
				anime({
					targets: menuRef.current,
					translateX: ["0%", "100%"],
					duration: timing.fast,
					easing: easing.easeIn,
				});

				anime({
					targets: overlayRef.current,
					opacity: [1, 0],
					duration: timing.fast,
				});
			} else {
				menuRef.current.style.transform = "translateX(100%)";
				overlayRef.current.style.opacity = "0";
			}
		}
	}, [isOpen]);

	const handleLinkClick = () => {
		setIsOpen(false);
	};

	const handleOverlayClick = () => {
		setIsOpen(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
				aria-label="Toggle menu"
				aria-expanded={isOpen}
			>
				{isOpen ? (
					<X className="w-6 h-6" />
				) : (
					<Menu className="w-6 h-6" />
				)}
			</button>

			{isOpen && (
				<>
					<div
						ref={overlayRef}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
						onClick={handleOverlayClick}
						aria-hidden="true"
					/>
					<div
						ref={menuRef}
						className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--bg-secondary)] z-50 md:hidden shadow-2xl"
					>
						<div className="p-8 pt-20">
							<nav ref={linksRef} className="flex flex-col gap-6">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={handleLinkClick}
										className="text-xl font-medium hover:text-[var(--accent)] transition-colors"
									>
										{link.label}
									</Link>
								))}
							</nav>
						</div>
					</div>
				</>
			)}
		</>
	);
}
