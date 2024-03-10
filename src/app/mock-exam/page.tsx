"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Button, Spin } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";

export default function MockExam() {
	const exam = "";
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
			<Container className="h-full overflow-y-scroll">
				{exam ? (
					"123"
				) : (
					<Button icon={<IconPlus />} iconPosition="right">
						生成试卷
					</Button>
				)}
			</Container>
		</main>
	);
}
