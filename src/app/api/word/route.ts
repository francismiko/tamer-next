import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const owner = searchParams.get("owner");

	try {
		if (owner) {
			const records = await prisma.notebook.findMany({
				where: {
					owner,
				},
			});

			return Response.json(records);
		}
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

export async function DELETE(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const id = searchParams.get("id");

	try {
		if (id) {
			const record = await prisma.notebook.delete({
				where: {
					id: parseInt(id),
				},
			});

			return Response.json(record);
		}
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
