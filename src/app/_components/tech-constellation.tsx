"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollTrigger } from "~/hooks/use-anime";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import {
	getConnectionsForNode,
	getNodesByCategory,
	type TechNode,
	techConnections,
	techNodes,
} from "~/lib/data/tech-stack";

interface NodePosition {
	x: number;
	y: number;
}

interface HoveredNode {
	node: TechNode;
	x: number;
	y: number;
}

export function TechConstellation() {
	const svgRef = useRef<SVGSVGElement>(null);
	const [nodePositions, setNodePositions] = useState<Map<string, NodePosition>>(
		new Map(),
	);
	const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
	const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate node positions in clusters
	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = container.clientWidth;
		const height = Math.max(600, container.clientHeight || 600);

		const positions = new Map<string, NodePosition>();
		const categories: TechNode["category"][] = [
			"Frontend",
			"Backend",
			"Database",
			"DevOps",
			"Tools",
		];

		// Cluster positions
		const clusterPositions: Record<string, { x: number; y: number }> = {
			Frontend: { x: width * 0.25, y: height * 0.3 },
			Backend: { x: width * 0.75, y: height * 0.3 },
			Database: { x: width * 0.5, y: height * 0.6 },
			DevOps: { x: width * 0.25, y: height * 0.75 },
			Tools: { x: width * 0.75, y: height * 0.75 },
		};

		// Position nodes in clusters with slight randomization
		categories.forEach((category) => {
			const nodes = getNodesByCategory(category);
			const cluster = clusterPositions[category];
			if (!cluster) return;
			const angleStep = (2 * Math.PI) / nodes.length;
			const radius = Math.min(width, height) * 0.08;

			nodes.forEach((node, index) => {
				const angle = index * angleStep;
				const offsetX = Math.cos(angle) * radius;
				const offsetY = Math.sin(angle) * radius;
				positions.set(node.id, {
					x: cluster.x + offsetX,
					y: cluster.y + offsetY,
				});
			});
		});

		setNodePositions(positions);

		// Animate nodes in
		if (!prefersReducedMotion()) {
			setTimeout(() => {
				techNodes.forEach((node, index) => {
					const pos = positions.get(node.id);
					if (pos && svgRef.current) {
						const element = svgRef.current.querySelector(
							`[data-node-id="${node.id}"]`,
						);
						if (element) {
							anime({
								targets: element,
								opacity: [0, 1],
								scale: [0, 1],
								duration: timing.normal,
								delay: index * 50,
								easing: easing.elasticOut,
							});
						}
					}
				});
			}, 200);
		}
	}, []);

	const handleNodeHover = (node: TechNode, event: React.MouseEvent) => {
		if (prefersReducedMotion()) return;

		const pos = nodePositions.get(node.id);
		if (!pos) return;

		setHoveredNode({
			node,
			x: event.clientX,
			y: event.clientY,
		});

		// Pulse animation
		const element = svgRef.current?.querySelector(
			`[data-node-id="${node.id}"]`,
		);
		if (element) {
			anime({
				targets: element,
				scale: [1, 1.2, 1],
				duration: timing.fast,
				easing: easing.elasticOut,
			});
		}

		// Glow connections
		const connections = getConnectionsForNode(node.id);
		connections.forEach((conn) => {
			const lineId = `${conn.from}-${conn.to}`;
			const line = svgRef.current?.querySelector(`[data-line-id="${lineId}"]`);
			if (line) {
				anime({
					targets: line,
					opacity: [0.3, 1],
					strokeWidth: [2, 3],
					duration: timing.fast,
					easing: easing.easeOut,
				});
			}
		});
	};

	const handleNodeLeave = () => {
		setHoveredNode(null);

		// Reset connections
		if (!prefersReducedMotion() && svgRef.current) {
			const lines = svgRef.current.querySelectorAll("[data-line-id]");
			anime({
				targets: lines,
				opacity: 0.3,
				strokeWidth: 2,
				duration: timing.fast,
				easing: easing.easeOut,
			});
		}
	};

	const handleNodeClick = (node: TechNode) => {
		setSelectedNode(selectedNode?.id === node.id ? null : node);
	};

	const sectionRef = useScrollTrigger<HTMLDivElement>((_element) => {
		// Animation handled in useEffect above
	});

	return (
		<div className="relative w-full" ref={sectionRef}>
			<div
				className="relative h-[600px] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
				ref={containerRef}
			>
				<svg
					aria-label="Technology stack constellation visualization"
					className="h-full w-full"
					ref={svgRef}
					role="img"
					viewBox={`0 0 ${containerRef.current?.clientWidth ?? 800} 600`}
				>
					{/* Connection lines */}
					{techConnections.map((conn) => {
						const fromPos = nodePositions.get(conn.from);
						const toPos = nodePositions.get(conn.to);
						if (!fromPos || !toPos) return null;

						const lineId = `${conn.from}-${conn.to}`;
						const isHovered =
							hoveredNode &&
							(hoveredNode.node.id === conn.from ||
								hoveredNode.node.id === conn.to);

						return (
							<line
								data-line-id={lineId}
								key={lineId}
								opacity={isHovered ? 1 : 0.3}
								stroke="var(--accent)"
								strokeWidth={isHovered ? 3 : 2}
								style={{
									transition: prefersReducedMotion()
										? "none"
										: "opacity 0.3s, stroke-width 0.3s",
								}}
								x1={fromPos.x}
								x2={toPos.x}
								y1={fromPos.y}
								y2={toPos.y}
							/>
						);
					})}

					{/* Nodes */}
					{techNodes.map((node) => {
						const pos = nodePositions.get(node.id);
						if (!pos) return null;

						const Icon = node.icon;
						const isHovered = hoveredNode?.node.id === node.id;
						const isSelected = selectedNode?.id === node.id;

						return (
							<g key={node.id}>
								{/* Node circle */}
								<circle
									aria-label={`${node.name} technology node`}
									className="cursor-pointer"
									cx={pos.x}
									cy={pos.y}
									data-node-id={node.id}
									fill="var(--bg-primary)"
									onClick={() => handleNodeClick(node)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleNodeClick(node);
										}
									}}
									onMouseEnter={(e) => handleNodeHover(node, e)}
									onMouseLeave={handleNodeLeave}
									r={isHovered || isSelected ? 35 : 30}
									// biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with button element
									role="button"
									stroke="var(--accent)"
									strokeWidth={isHovered || isSelected ? 3 : 2}
									style={{
										opacity: prefersReducedMotion() ? 1 : 0,
										transition: prefersReducedMotion()
											? "none"
											: "r 0.3s, stroke-width 0.3s",
									}}
									tabIndex={0}
								/>
								{/* Icon */}
								<foreignObject
									height="24"
									width="24"
									x={pos.x - 12}
									y={pos.y - 12}
								>
									<Icon
										className="pointer-events-none"
										style={{ color: "var(--accent)" }}
									/>
								</foreignObject>
								{/* Node label */}
								<text
									className="pointer-events-none select-none"
									dominantBaseline="middle"
									fill="var(--text-primary)"
									fontSize="12"
									fontWeight="500"
									textAnchor="middle"
									x={pos.x}
									y={pos.y + 50}
								>
									{node.name}
								</text>
							</g>
						);
					})}
				</svg>

				{/* Tooltip */}
				{hoveredNode && (
					<div
						className="pointer-events-none absolute z-10 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3 shadow-lg"
						style={{
							left: `${hoveredNode.x + 10}px`,
							top: `${hoveredNode.y + 10}px`,
							transform: "translate(0, -100%)",
						}}
					>
						<div className="font-semibold">{hoveredNode.node.name}</div>
						<div className="text-[var(--text-secondary)] text-sm">
							Proficiency: {hoveredNode.node.proficiency}%
						</div>
						{hoveredNode.node.relatedProjects.length > 0 && (
							<div className="mt-2 text-[var(--text-secondary)] text-xs">
								Projects: {hoveredNode.node.relatedProjects.join(", ")}
							</div>
						)}
					</div>
				)}

				{/* Selected node details */}
				{selectedNode && (
					<div className="absolute right-4 bottom-4 left-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 shadow-lg">
						<div className="mb-2 flex items-center justify-between">
							<h4 className="font-semibold text-lg">{selectedNode.name}</h4>
							<button
								className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
								onClick={() => setSelectedNode(null)}
								type="button"
							>
								×
							</button>
						</div>
						<div className="text-[var(--text-secondary)] text-sm">
							<p>Category: {selectedNode.category}</p>
							<p>Proficiency: {selectedNode.proficiency}%</p>
							{selectedNode.relatedProjects.length > 0 && (
								<p className="mt-2">
									Related Projects: {selectedNode.relatedProjects.join(", ")}
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
