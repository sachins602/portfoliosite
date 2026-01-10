"use client";

import { Code, Database, Globe, Server, Type, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";
import { easing, prefersReducedMotion } from "~/lib/animations";
import anime from "~/lib/anime";

interface TechCubeProps {
	size?: number;
}

const techFaces = [
	{ icon: Globe, label: "Next.js", color: "text-blue-500" },
	{ icon: Type, label: "TypeScript", color: "text-blue-600" },
	{ icon: Code, label: "React", color: "text-cyan-500" },
	{ icon: Server, label: "Golang", color: "text-cyan-400" },
	{ icon: Database, label: "SQL", color: "text-green-500" },
	{ icon: Wrench, label: "Tools", color: "text-orange-500" },
];

export function TechCube({ size = 150 }: TechCubeProps) {
	const cubeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!cubeRef.current || prefersReducedMotion()) {
			return;
		}

		// Continuous rotation animation
		anime({
			targets: cubeRef.current,
			rotateY: 360,
			duration: 20000, // 20 seconds for full rotation
			easing: easing.linear,
			loop: true,
		});

		// Add slight vertical rotation for more dynamic effect
		anime({
			targets: cubeRef.current,
			rotateX: [0, 15, 0],
			duration: 10000,
			easing: easing.easeInOut,
			loop: true,
			direction: "alternate",
		});
	}, []);

	return (
		<div
			className="relative"
			style={{
				width: `${size}px`,
				height: `${size}px`,
				perspective: "1000px",
			}}
		>
			<div
				className="preserve-3d relative"
				ref={cubeRef}
				style={{
					width: "100%",
					height: "100%",
					transformStyle: "preserve-3d",
				}}
			>
				{/* Front face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `translateZ(${size / 2}px)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[0]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[0]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[0]?.label}
						</span>
					</div>
				</div>

				{/* Back face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[1]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[1]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[1]?.label}
						</span>
					</div>
				</div>

				{/* Right face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `rotateY(90deg) translateZ(${size / 2}px)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[2]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[2]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[2]?.label}
						</span>
					</div>
				</div>

				{/* Left face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[3]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[3]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[3]?.label}
						</span>
					</div>
				</div>

				{/* Top face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `rotateX(90deg) translateZ(${size / 2}px)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[4]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[4]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[4]?.label}
						</span>
					</div>
				</div>

				{/* Bottom face */}
				<div
					className="absolute flex items-center justify-center rounded-lg border border-(--border) bg-(--bg-secondary)/80 backdrop-blur-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
					}}
				>
					<div className="flex flex-col items-center gap-2">
						{(() => {
							const Icon = techFaces[5]?.icon;
							return Icon ? (
								<Icon className={`h-8 w-8 ${techFaces[5]?.color}`} />
							) : null;
						})()}
						<span className="font-medium text-(--text-primary) text-xs">
							{techFaces[5]?.label}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
