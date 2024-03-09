"use client";

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

	return <></>;
}
