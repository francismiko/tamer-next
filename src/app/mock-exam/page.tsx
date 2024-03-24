"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Button, Divider, Empty, Spin } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { IllustrationSuccess } from "@douyinfe/semi-illustrations";
import { OpenAI } from "langchain/llms/openai";
import { useState } from "react";
import { StringOutputParser } from "langchain/schema/output_parser";
import Markdown from "react-markdown";

export default function MockExam() {
	const [select, setSelect] = useState<string>("");
	const [readingPart1, setReadingPart1] = useState<string>("");
	const [readingPart2, setReadingPart2] = useState<string>("");
	const [readingPart3, setReadingPart3] = useState<string>("");
	const [isEmpty, setIsEmpty] = useState<boolean>(true);
	const { isLoaded } = useAuth();

	const handleGenerateExam = async () => {
		const stream = async (prompt: string) => {
			const parser = new StringOutputParser();
			const model = new OpenAI(
				{
					openAIApiKey: process.env.openAIApiKey,
					temperature: 0.7,
				},
				{ baseURL: process.env.proxyUrl },
			);
			return model.pipe(parser).stream(prompt);
		};

		const handleStream = async (
			stream: AsyncIterable<string>,
			setState: React.Dispatch<React.SetStateAction<string>>,
		) => {
			for await (const chunk of stream) {
				setState((prev) => prev + chunk);
			}
		};

		const outputFromat = "要求: 使用markdown格式输出, 不要输出答案";
		const systemFromat =
			"你需要帮我模拟在中国的英语升学考试, 模拟题目标题格式和题目内容, 遵循以下要求和标准: \n";

		setIsEmpty(false);

		await Promise.all([
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的选择题5个, 前面放个大标题'选择题练习(5 questions, 15 points)', ${outputFromat}`,
				),
				setSelect,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读题目, 只需要你生成其中的第一篇即可, 控制阅读时间在10-15分钟, 前面放个大标题'阅读练习 (3 questions, 30 points)', ${outputFromat}`,
				),
				setReadingPart1,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读题目, 只需要你生成其中的第二篇即可, 控制阅读时间在10-15分钟, 前面放个标题'Passage 2', ${outputFromat}`,
				),
				setReadingPart2,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读题目, 只需要你生成其中的第三篇即可, 控制阅读时间在10-15分钟, 前面放个标题'Passage 3', ${outputFromat}`,
				),
				setReadingPart3,
			),
		]);
	};

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
				{!isEmpty ? (
					<>
						<Markdown>{select}</Markdown>
						<Divider margin="12px" />
						<Markdown>{readingPart1}</Markdown>
						<Divider margin="12px" />
						<Markdown>{readingPart2}</Markdown>
						<Divider margin="12px" />
						<Markdown>{readingPart3}</Markdown>
					</>
				) : (
					<div className="flex justify-center items-center h-full flex-col">
						<Empty
							image={
								<IllustrationSuccess style={{ width: 250, height: 250 }} />
							}
						/>
						<Button
							icon={<IconPlus />}
							iconPosition="right"
							onClick={handleGenerateExam}
						>
							生成试卷
						</Button>
					</div>
				)}
			</Container>
		</main>
	);
}
