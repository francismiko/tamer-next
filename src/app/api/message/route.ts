import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const owner = searchParams.get("owner");

	try {
		if (owner) {
			const chat = await prisma.chat.findFirst({
				where: {
					owner,
				},
			});

			const messages = await prisma.message.findMany({
				where: {
					chatId: chat?.id,
				},
			});

			return Response.json(messages);
		}
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function DELETE(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const owner = searchParams.get("owner");

	try {
		if (owner) {
			const chat = await prisma.chat.findFirst({
				where: {
					owner,
				},
			});

			const messages = await prisma.message.deleteMany({
				where: {
					chatId: chat?.id,
				},
			});

			return Response.json(messages);
		}
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
