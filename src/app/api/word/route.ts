import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const plans = await prisma.plan.findMany();

		return Response.json(plans);
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const notebook = await prisma.notebook.create({
			data: {
				...body,
			},
		});

		return Response.json({ status: "ok", data: notebook });
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
