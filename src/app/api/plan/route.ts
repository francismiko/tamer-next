import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const plans = await prisma.plan.findMany();

		return Response.json(plans);
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function POST(req: Request) {
	const json = await req.json();

	try {
		await prisma.plan.create({
			data: {
				...json,
			},
		});

		return Response.json({ status: "ok" });
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
