import { NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(request: Request) {
	try {
		const { password } = (await request.json()) as { password: string };

		// Simple password check - in production, use proper authentication
		if (env.ADMIN_PASSWORD && password === env.ADMIN_PASSWORD) {
			return NextResponse.json({ success: true });
		}

		return NextResponse.json({ error: "Invalid password" }, { status: 401 });
	} catch (error) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}
