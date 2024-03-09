"use client";

import { Empty } from "@douyinfe/semi-ui";
import React from "react";
import { IllustrationIdle } from "@douyinfe/semi-illustrations";

export default function Home() {
	return (
		<div className="flex justify-center items-center h-full">
			<Empty
				image={<IllustrationIdle style={{ width: 300, height: 300 }} />}
				description={"这是一个AI 英语自学平台"}
			/>
		</div>
	);
}
