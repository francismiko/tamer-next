"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Button, Card, Space, Spin, Upload } from "@douyinfe/semi-ui";
import type { FileItem } from "@douyinfe/semi-ui/lib/es/upload";

export default function Shared() {
	const materials = ["1", "2", "3", "4", "5", "6"];
	const { Meta } = Card;

	const beforeUploadHandler = (file: File) => {
		console.log(file);
	};

	const handleOnSuccess = async (
		responseBody: any,
		file: File,
		fileList: FileItem[],
	) => {
		console.log(file);
		// await fetch("/api/upload", {
		// 	method: "POST",
		// 	body: file,
		// });
	};

	const { isLoaded } = useAuth();
	if (!isLoaded) {
		return (
			<div className="flex justify-center items-center h-full">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<main className="px-16 py-8 h-full">
			<Container className="h-full overflow-y-scroll py-4 px-8">
				<div className="grid grid-cols-4 h-96">
					<div className="h-full p-6">
						<Upload
							className="h-full"
							action="/api/upload/private"
							draggable={true}
							dragMainText={"点击上传文件或拖拽文件到这里"}
							dragSubText="支持任意类型文件"
							onSuccess={handleOnSuccess}
						/>
					</div>
					{materials.map((material, index) => (
						<div className="h-full p-6">
							<Card
								title={<Meta title="Semi Doc" />}
								headerStyle={{ padding: "8px" }}
								headerExtraContent={
									<Button theme="borderless" type="primary">
										设置
									</Button>
								}
								cover={
									<img
										alt="example"
										src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
									/>
								}
								bodyStyle={{ padding: "8px" }}
								footerLine={true}
								footerStyle={{
									display: "flex",
									justifyContent: "flex-end",
									padding: "8px",
								}}
								footer={
									<Space>
										<Button theme="borderless" type="primary">
											预览
										</Button>
										<Button className="bg-slate-200 text-black">下载</Button>
									</Space>
								}
							>
								Semi Design 是由互娱社区前端团队与 UED
								团队共同设计开发并维护的设计系统。
							</Card>
						</div>
					))}
				</div>
			</Container>
		</main>
	);
}
