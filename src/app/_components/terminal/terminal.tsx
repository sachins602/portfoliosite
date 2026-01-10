"use client";

import { Minus, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { easing, prefersReducedMotion, timing } from "~/lib/animations";
import anime from "~/lib/anime";
import { processCommand } from "./commands";

interface TerminalLine {
	id: string;
	type: "command" | "output";
	content: string;
	animated: boolean;
}

export function Terminal() {
	const [input, setInput] = useState("");
	const [lines, setLines] = useState<TerminalLine[]>([]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);
	const cursorRef = useRef<HTMLSpanElement>(null);
	const hasInitialized = useRef(false);

	const handleCommand = useCallback((cmd: string) => {
		if (!cmd.trim()) return;

		const commandLine: TerminalLine = {
			id: `cmd-${Date.now()}`,
			type: "command",
			content: cmd,
			animated: false,
		};

		const output = processCommand(cmd);
		const outputLines: TerminalLine[] = output.map((line, idx) => ({
			id: `out-${Date.now()}-${idx}`,
			type: "output",
			content: line,
			animated: false,
		}));

		setLines((prev) => [...prev, commandLine, ...outputLines]);
		setCommandHistory((prev) => [...prev, cmd]);
		setHistoryIndex(-1);
		setInput("");

		// Animate output lines
		if (!prefersReducedMotion() && outputLines.length > 0) {
			setTimeout(() => {
				outputLines.forEach((line, idx) => {
					const element = document.getElementById(line.id);
					if (element) {
						anime({
							targets: element,
							opacity: [0, 1],
							translateX: [-10, 0],
							duration: timing.fast,
							delay: idx * 20,
							easing: easing.easeOut,
						});
					}
				});
			}, 100);
		}
	}, []);

	// Initial demo animation
	useEffect(() => {
		if (hasInitialized.current || prefersReducedMotion()) return;
		hasInitialized.current = true;

		const demoCommands = ["whoami", "skills", "projects"];
		let currentCommand = 0;

		const runDemo = () => {
			if (currentCommand >= demoCommands.length) return;

			const cmd = demoCommands[currentCommand];
			if (!cmd) return;
			setInput(cmd);
			setTimeout(() => {
				handleCommand(cmd);
				currentCommand++;
				if (currentCommand < demoCommands.length) {
					setTimeout(runDemo, 2000);
				} else {
					setInput("");
				}
			}, 500);
		};

		setTimeout(runDemo, 1000);
	}, [handleCommand]);

	// Cursor blink animation
	useEffect(() => {
		if (!cursorRef.current || prefersReducedMotion()) return;

		const cursor = cursorRef.current;
		let isVisible = true;

		const blink = setInterval(() => {
			isVisible = !isVisible;
			cursor.style.opacity = isVisible ? "1" : "0";
		}, 530);

		return () => clearInterval(blink);
	}, []);

	// Auto-scroll to bottom
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleCommand(input);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (commandHistory.length > 0) {
				const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
				setHistoryIndex(newIndex);
				const cmd = commandHistory[newIndex];
				if (cmd) setInput(cmd);
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex >= 0) {
				const newIndex = historyIndex + 1;
				if (newIndex >= commandHistory.length) {
					setHistoryIndex(-1);
					setInput("");
				} else {
					setHistoryIndex(newIndex);
					const cmd = commandHistory[newIndex];
					if (cmd) setInput(cmd);
				}
			}
		}
	};

	return (
		<div className="w-full overflow-hidden rounded-lg border border-(--border) bg-[#1e1e1e] shadow-xl md:w-[600px]">
			{/* Window Chrome */}
			<div className="flex items-center gap-2 border-(--border) border-b bg-[#2d2d2d] px-4 py-2">
				<div className="flex gap-2">
					<div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
					<div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
					<div className="h-3 w-3 rounded-full bg-[#27c93f]" />
				</div>
				<div className="ml-auto flex gap-2">
					<Minus className="h-4 w-4 text-(--text-secondary)" />
					<Square className="h-4 w-4 text-(--text-secondary)" />
					<X className="h-4 w-4 text-(--text-secondary)" />
				</div>
			</div>

			{/* Terminal Content */}
			<div className="h-[400px] overflow-y-auto p-4 font-mono text-sm" ref={outputRef} style={{ scrollbarWidth: "thin" }}>
				{lines.length === 0 && (
					<div className="text-(--text-secondary)">
						<p>Welcome to my portfolio terminal!</p>
						<p>Type 'help' to see available commands.</p>
						<p className="mt-2 text-xs opacity-70">Demo commands will run automatically...</p>
					</div>
				)}

				{lines.map((line) => (
					<div
						className="mb-1"
						id={line.id}
						key={line.id}
						style={{
							opacity: prefersReducedMotion() ? 1 : line.animated ? 1 : 0,
						}}
					>
						{line.type === "command" ? (
							<div>
								<span className="text-[#4ec9b0]">sachin@portfolio</span>
								<span className="text-(--text-secondary)">:</span>
								<span className="text-[#4fc1ff]">~</span>
								<span className="text-(--text-secondary)">$ </span>
								<span className="text-white">{line.content}</span>
							</div>
						) : (
							<div className="text-(--text-secondary)" style={{ whiteSpace: "pre-wrap" }}>
								{line.content || " "}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Input Area */}
			<form className="flex items-center gap-2 border-(--border) border-t bg-[#1e1e1e] px-4 py-2" onSubmit={handleSubmit}>
				<span className="text-[#4ec9b0]">sachin@portfolio</span>
				<span className="text-(--text-secondary)">:</span>
				<span className="text-[#4fc1ff]">~</span>
				<span className="text-(--text-secondary)">$ </span>
				<input
					className="flex-1 bg-transparent text-white outline-none"
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					ref={inputRef}
					type="text"
					value={input}
				/>
				<span className="h-4 w-0.5 bg-(--accent)" ref={cursorRef} />
			</form>
		</div>
	);
}
