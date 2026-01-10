import { ImageResponse } from "next/og";

export const alt = "Sachin Sapkota - Full-Stack Developer";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0f172a",
				backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "60px",
					backgroundColor: "#0f172a",
					borderRadius: "20px",
					border: "2px solid #818cf8",
				}}
			>
				<h1
					style={{
						fontSize: "72px",
						fontWeight: "bold",
						color: "#f8fafc",
						marginBottom: "20px",
					}}
				>
					Sachin Sapkota
				</h1>
				<p
					style={{
						fontSize: "32px",
						color: "#cbd5e1",
						marginTop: "0",
					}}
				>
					Full-Stack Developer
				</p>
				<p
					style={{
						fontSize: "24px",
						color: "#818cf8",
						marginTop: "10px",
					}}
				>
					Next.js, TypeScript & Golang
				</p>
			</div>
		</div>,
		{
			...size,
		},
	);
}
