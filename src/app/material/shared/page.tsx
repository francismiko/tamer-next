"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Spin } from "@douyinfe/semi-ui";

export default function Shared() {
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
			<Container className="h-full overflow-y-scroll"></Container>
		</main>
	);
}
