import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const chat = await prisma.chat.upsert({
			where: {
				owner: body.owner,
			},
			update: {
				messages: { create: body.messages },
			},
			create: {
				owner: body.owner,
			},
		});

		return Response.json({ status: "ok", data: chat });
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
