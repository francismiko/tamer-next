import type { NextRequest } from "next/server";
import OSS from "ali-oss";

// const client = new OSS({
// 	region: "oss-cn-hangzhou",
// 	accessKeyId: process.env.OSS_ACCESS_KEY_ID as string,
// 	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET as string,
// 	bucket: "tamer",
// });

export async function GET(req: NextRequest) {
	try {
		return Response.json({});
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	console.log(formData);

	try {
		return Response.json({});
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	try {
		return Response.json({});
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}

export async function PUT(req: NextRequest) {
	const body = await req.json();
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	try {
		return Response.json({});
	} catch (e: any) {
		console.log(e);
		return Response.json({ status: "error", message: e.message });
	}
}
