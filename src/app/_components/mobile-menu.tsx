"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { easing, prefersReducedMotion, stagger, timing } from "~/lib/animations";
import anime from "~/lib/anime";

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
				aria-expanded={isOpen}
				aria-label="Toggle menu"
				className="rounded-lg p-2 transition-colors hover:bg-(--bg-secondary) md:hidden"
				onClick={() => setIsOpen(!isOpen)}
				type="button"
			>
				{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</button>

			{isOpen && (
				<>
					<div
						aria-hidden="true"
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
						onClick={handleOverlayClick}
						ref={overlayRef}
					/>
					<div
						className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-(--bg-secondary) shadow-2xl md:hidden"
						ref={menuRef}
					>
						<div className="p-8 pt-20">
							<nav className="flex flex-col gap-6" ref={linksRef}>
								{navLinks.map((link) => (
									<Link
										className="font-medium text-xl transition-colors hover:text-(--accent)"
										href={link.href}
										key={link.href}
										onClick={handleLinkClick}
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
