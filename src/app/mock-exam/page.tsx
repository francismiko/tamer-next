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
	const [translation, setTranslation] = useState<string>("");
	const [writing, setWriting] = useState<string>("");
	const [isEmpty, setIsEmpty] = useState<boolean>(true);
	const { isLoaded } = useAuth();

	const handleGenerateExam = async () => {
		const stream = async (prompt: string) => {
			const parser = new StringOutputParser();
			const model = new OpenAI(
				{
					modelName: "gpt-3.5-turbo",
					openAIApiKey: process.env.openAIApiKey,
					temperature: 0.8,
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

		const outputFromat =
			"要求: 使用markdown格式输出, 不要输出答案, 除标题外都用英文";
		const systemFromat =
			"你需要帮我模拟一次学生的英语等级考试, 模拟题目标题格式和题目内容, 遵循以下要求和标准: \n";

		setIsEmpty(false);

		await Promise.all([
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的选择题, 生成5个不同题型的选择题 前面放个大标题'选择题练习(5 questions, 15 points)', ${outputFromat}`,
				),
				setSelect,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读理解题目, 只需要你生成其中的第一篇即可, 题材是关于商业新闻的, 控制阅读时间在10-15分钟至少700字, 至少有3个选择题目, 难度为中等, 前面放个大标题'阅读练习 (3 passages, 30 points)', ${outputFromat}`,
				),
				setReadingPart1,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读理解题目, 只需要你生成其中的第二篇即可, 题材是关于科技环境的, 控制阅读时间在10-15分钟至少700字, 至少有3个选择题目, 难度为中等, 前面放个标题'Passage 2', ${outputFromat}`,
				),
				setReadingPart2,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读理解题目, 只需要你生成其中的第三篇即可, 题材是关于人文故事的, 控制阅读时间在15-20分钟至少900字, 至少有3个选择题目, 难度为困难, 前面放个标题'Passage 3', ${outputFromat}`,
				),
				setReadingPart3,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的翻译题目, 生成2个英译中的题目, 3个中译英的题目, 前面放个大标题'翻译练习(5 question, 30 points)', ${outputFromat}`,
				),
				setTranslation,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的写作题目, 要求词数在250-300之间, 题目描述和要求用英文描述, 题材不限, 前面放个大标题'写作练习(1 question, 25 points)', ${outputFromat}`,
				),
				setWriting,
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
					!select &&
					!readingPart1 &&
					!readingPart2 &&
					!readingPart3 &&
					!translation &&
					!writing ? (
						<div className="flex justify-center items-center h-full">
							<Spin size="large" />
						</div>
					) : (
						<>
							<Markdown>{select}</Markdown>
							<Divider margin="12px" />
							<Markdown>{readingPart1}</Markdown>
							<Divider margin="12px" />
							<Markdown>{readingPart2}</Markdown>
							<Divider margin="12px" />
							<Markdown>{readingPart3}</Markdown>
							<Divider margin="12px" />
							<Markdown>{translation}</Markdown>
							<Divider margin="12px" />
							<Markdown>{writing}</Markdown>
						</>
					)
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
