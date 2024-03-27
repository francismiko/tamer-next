"use client";

import {
	Button,
	Empty,
	Input,
	Popconfirm,
	Spin,
	Toast,
} from "@douyinfe/semi-ui";
import { IconLink, IconSend } from "@douyinfe/semi-icons";
import { useEffect, useRef, useState } from "react";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useAuth } from "@clerk/nextjs";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";
import Markdown from "react-markdown";
import {
	useUpsertChat,
	type Message,
} from "@/hooks/useSWRMutate/useUpsertChat";
import { useMessagesByOwner } from "@/hooks/useSWR/useMessagesByOwner";
import { mutate } from "swr";

export default function ChatBot() {
	const { userId } = useAuth();
	const { upsertChat } = useUpsertChat();
	const { messages } = useMessagesByOwner({
		userId: userId as string,
	});
	const [inputValue, setInputValue] = useState("");
	const [isPendding, setIsPendding] = useState(false);
	const mesgsRef = useRef<Message[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [, forceUpdate] = useState(1);

	const rerender = () => {
		forceUpdate((prev) => -prev);
	};

	const typewriterQueue = async (
		textRef: typeof mesgsRef,
		stream: AsyncIterable<string>,
		delay: number,
	): Promise<string> => {
		let streamQueue: string[] = [];
		let isDone = false;
		let chunkCache = "";

		const typingInterval = setInterval(() => {
			if (!scrollRef.current) return;
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

			if (streamQueue.length > 0) {
				(textRef.current[textRef.current.length - 1].text as string) +=
					streamQueue.shift();
				rerender();
			}

			if (streamQueue.length === 0 && isDone) {
				clearInterval(typingInterval);
			}
		}, delay);

		for await (const chunk of stream) {
			chunkCache += chunk;
			streamQueue = streamQueue.concat(chunk.split(""));
		}

		isDone = true;
		rerender();

		return chunkCache;
	};

	const handleMessageSubmit = async () => {
		if (!userId) return;
		if (inputValue.trim() === "") return;

		const userMessage = inputValue;

		mesgsRef.current = [
			...mesgsRef.current,
			{ text: userMessage, sender: "USER" },
			{ text: "", sender: "ASSISTANT" },
		];

		setIsPendding(true);
		setInputValue("");

		const parser = new StringOutputParser();
		const model = new ChatOpenAI(
			{
				openAIApiKey: process.env.openAIApiKey,
				temperature: 0.9,
			},
			{ baseURL: process.env.proxyUrl },
		);
		const stream = await model.pipe(parser).stream([
			[
				"system",
				"你是个英语学习助手, 负责用幽默风趣的风格去回答用户问题或对题目进行批改解答, 对用户提出的问题用尽可能详细易懂的话术去解答描述, 如果对方对学习英语的方法存在困惑, 请列举一些有效的学习方案, 要求: 在每句话中加入表情让对话更有趣些",
			],
			["human", userMessage],
		]);

		setIsPendding(false);

		const assistantMessage = await typewriterQueue(mesgsRef, stream, 10);

		await upsertChat({
			owner: userId,
			messages: [
				{ sender: "USER", text: userMessage },
				{ sender: "ASSISTANT", text: assistantMessage },
			],
		});
	};

	const handleDeleteMesgs = async () => {
		try {
			await fetch(`/api/message?owner=${userId}`, { method: "DELETE" });

			mutate(`/api/message?owner=${userId}`);
			Toast.success({ content: "删除成功" });
		} catch (e) {
			Toast.error({ content: "删除失败" });
		}
	};

	const handleKeyPress = (event: { key: string }) => {
		if (event.key === "Enter") {
			handleMessageSubmit();
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!messages) return;
		mesgsRef.current = messages?.map((message) => ({
			text: message.text,
			sender: message.sender,
		})) as Message[];

		rerender();
	}, [messages]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [mesgsRef.current]);

	return (
		<>
			<main ref={scrollRef} className="h-[90%] overflow-y-scroll">
				{mesgsRef?.current?.length !== 0 ? (
					mesgsRef?.current?.map(({ sender, text }, index) => (
						<div className="px-64 grid">
							<div
								className={`inline-block px-8 py-4 mt-4 rounded-md mb-4 ${
									sender === "USER"
										? "bg-slate-100 justify-self-end"
										: "bg-purple-50 justify-self-start"
								}`}
							>
								<span>
									{isPendding && mesgsRef?.current?.length - 1 === index ? (
										<Spin />
									) : (
										<Markdown>{text}</Markdown>
									)}
								</span>
							</div>
						</div>
					))
				) : (
					<div className="flex justify-center items-center h-full">
						<Empty
							image={
								<IllustrationNoContent style={{ width: 250, height: 250 }} />
							}
							description={"开启你的英语自学之路"}
						/>
					</div>
				)}
				<Popconfirm
					title="确定是否清除当前的聊天历史？"
					position="bottomRight"
					okButtonProps={{ className: "bg-slate-200 text-black" }}
					onConfirm={handleDeleteMesgs}
				>
					<Button
						theme="borderless"
						type="danger"
						className=" absolute top-20 right-20"
					>
						清除聊天
					</Button>
				</Popconfirm>
			</main>
			<footer className="h-[10%] w-full flex justify-center">
				<Input
					value={inputValue}
					onChange={(value) => setInputValue(value)}
					onKeyDown={handleKeyPress}
					prefix={<IconLink />}
					suffix={
						<IconSend
							onClick={handleMessageSubmit}
							className="cursor-pointer"
						/>
					}
					size="large"
					showClear
					className="w-1/2 rounded-full border-1 border-slate-400 hover:border-slate-700"
				/>
			</footer>
		</>
	);
}
