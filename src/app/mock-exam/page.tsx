"use client";

import Container from "@/components/container";
import {
	Button,
	Divider,
	Dropdown,
	Empty,
	Spin,
	TextArea,
	Notification,
} from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import { IllustrationSuccess } from "@douyinfe/semi-illustrations";
import { OpenAI } from "langchain/llms/openai";
import { useState } from "react";
import { StringOutputParser } from "langchain/schema/output_parser";
import Markdown from "react-markdown";
import "@/css/button.css";

export default function MockExam() {
	const [select, setSelect] = useState<string>("");
	const [readingPart1, setReadingPart1] = useState<string>("");
	const [readingPart2, setReadingPart2] = useState<string>("");
	const [readingPart3, setReadingPart3] = useState<string>("");
	const [translation, setTranslation] = useState<string>("");
	const [writing, setWriting] = useState<string>("");
	const [textAreaValues, setTextAreaValues] = useState<string[]>([
		"",
		"",
		"",
		"",
		"",
		"",
	]);
	const examContent = [
		select,
		readingPart1,
		readingPart2,
		readingPart3,
		translation,
		writing,
	];
	const [parseSelect, setParseSelect] = useState<string>("");
	const [parseReadingPart1, setParseReadingPart1] = useState<string>("");
	const [parseReadingPart2, setParseReadingPart2] = useState<string>("");
	const [parseReadingPart3, setParseReadingPart3] = useState<string>("");
	const [parseTranslation, setParseTranslation] = useState<string>("");
	const [parseWriting, setParseWriting] = useState<string>("");
	const parseExamContent = [
		parseSelect,
		parseReadingPart1,
		parseReadingPart2,
		parseReadingPart3,
		parseTranslation,
		parseWriting,
	];
	const setParseExamContent = [
		setParseSelect,
		setParseReadingPart1,
		setParseReadingPart2,
		setParseReadingPart3,
		setParseTranslation,
		setParseWriting,
	];
	const [isEmpty, setIsEmpty] = useState<boolean>(true);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const handleStream = async (
		stream: AsyncIterable<string>,
		setState: React.Dispatch<React.SetStateAction<string>>,
	) => {
		for await (const chunk of stream) {
			setState((prev) => prev + chunk);
		}
	};

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
					`${systemFromat}模拟CET-6难度的阅读理解选择题目, 只需要你生成其中的第一篇即可, 题材是关于商业新闻的, 控制阅读时间在10-15分钟至少700字, 至少有3个选择题目, 难度为中等, 前面放个大标题'阅读练习 (3 passages, 30 points)', ${outputFromat}`,
				),
				setReadingPart1,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读理解选择题目, 只需要你生成其中的第二篇即可, 题材是关于科技环境的, 控制阅读时间在10-15分钟至少700字, 至少有3个选择题目, 难度为中等, 前面放个标题'Passage 2', ${outputFromat}`,
				),
				setReadingPart2,
			),
			handleStream(
				await stream(
					`${systemFromat}模拟CET-6难度的阅读理解选择题目, 只需要你生成其中的第三篇即可, 题材是关于人文故事的, 控制阅读时间在15-20分钟至少900字, 至少有3个选择题目, 难度为困难, 前面放个标题'Passage 3', ${outputFromat}`,
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

	const handleTextAreaChange = (index: number, value: string) => {
		setTextAreaValues((prevValues) => {
			const newValues = [...prevValues];
			newValues[index] = value;
			return newValues;
		});
	};

	const handleSubmitExam = async (answers: string[]) => {
		if (textAreaValues.some((value) => value === "")) {
			Notification.error({
				title: "还有没回答的题目!",
				duration: 0.8,
			});
			return;
		}

		const model = new OpenAI(
			{
				modelName: "gpt-3.5-turbo",
				openAIApiKey: process.env.openAIApiKey,
				temperature: 0,
			},
			{ baseURL: process.env.proxyUrl },
		);

		answers.forEach(async (answer, index) => {
			const prompt = `这是我给出的题目:
			'''
			${examContent[index]}
			'''
			然后这是用户给出的答案:
			'''
			${answer}
			'''
			请你作为阅卷人来评判用户的答案, 并给出正确的答案和答案解析.
			`;
			const stream = await model.stream(prompt);
			handleStream(stream, setParseExamContent[index]);
		});
	};

	return (
		<main className="px-16 py-8 h-full">
			<Container className="h-full overflow-y-scroll py-4 px-8">
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
							<button
								type="button"
								className="cta fixed right-28 top-28 z-10"
								onClick={() => handleSubmitExam(textAreaValues)}
							>
								<span className="hover-underline-animation font-medium italic">
									提交试卷
								</span>
							</button>
							{examContent.map((content, index) => (
								<>
									<Markdown>{content}</Markdown>
									<h6>答题区：</h6>
									<TextArea
										showClear
										placeholder="在此填入答案..."
										value={textAreaValues[index]}
										onChange={(value) => handleTextAreaChange(index, value)}
										autosize
									/>
									<Markdown className="text-red-400">
										{parseExamContent[index]}
									</Markdown>
									{index < examContent.length - 1 && <Divider margin="12px" />}
								</>
							))}
						</>
					)
				) : (
					<div className="flex justify-center items-center h-full flex-col">
						<Empty
							image={
								<IllustrationSuccess style={{ width: 250, height: 250 }} />
							}
						/>
						<Dropdown
							trigger={"click"}
							position={"bottom"}
							showTick={true}
							render={
								<Dropdown.Menu>
									<Dropdown.Item onClick={handleGenerateExam}>
										大学英语六级
									</Dropdown.Item>
									<Dropdown.Item disabled={true}>大学英语四级</Dropdown.Item>
									<Dropdown.Item disabled={true}>考研英语</Dropdown.Item>
									<Dropdown.Item disabled={true}>高中英语</Dropdown.Item>
									<Dropdown.Item disabled={true}>初中英语</Dropdown.Item>
									<Dropdown.Item disabled={true}>小学英语</Dropdown.Item>
									<Dropdown.Item disabled={true}>雅思托福</Dropdown.Item>
									<Dropdown.Item disabled={true}>专业英语四级</Dropdown.Item>
									<Dropdown.Item disabled={true}>专业英语八级</Dropdown.Item>
								</Dropdown.Menu>
							}
						>
							<Button icon={<IconPlus />} iconPosition="right">
								生成试卷
							</Button>
						</Dropdown>
					</div>
				)}
			</Container>
		</main>
	);
}
