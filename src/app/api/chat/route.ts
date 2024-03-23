import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	const body = await req.json();
	console.log(body);

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
