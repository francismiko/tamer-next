"use client";

import { Empty, Input, Spin } from "@douyinfe/semi-ui";
import { IconLink, IconSend } from "@douyinfe/semi-icons";
import { useEffect, useRef, useState } from "react";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useAuth } from "@clerk/nextjs";
import { IllustrationNoContent } from "@douyinfe/semi-illustrations";

type Message = {
	text: string;
	sender: "user" | "assistant";
};

export default function ChatBot() {
	const { isLoaded } = useAuth();
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
	) => {
		let streamQueue: string[] = [];
		let isDone = false;
		const typingInterval = setInterval(() => {
			if (!scrollRef.current) return;
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

			if (streamQueue.length > 0) {
				textRef.current[textRef.current.length - 1].text += streamQueue.shift();
				rerender();
			}

			if (streamQueue.length === 0 && isDone) {
				clearInterval(typingInterval);
			}
		}, delay);

		for await (const chunk of stream) {
			streamQueue = streamQueue.concat(chunk.split(""));
		}

		isDone = true;
		rerender();
	};

	const handleMessageSubmit = async () => {
		if (inputValue.trim() === "") return;
		const userMessage = inputValue;
		mesgsRef.current = [
			...mesgsRef.current,
			{ text: userMessage, sender: "user" },
			{ text: "", sender: "assistant" },
		];
		setIsPendding(true);
		setInputValue("");

		const parser = new StringOutputParser();
		const model = new ChatOpenAI({
			openAIApiKey: process.env.openAIApiKey,
			temperature: 0.7,
		});
		const stream = await model.pipe(parser).stream([
			["system", "你是个助手"],
			["human", userMessage],
		]);

		setIsPendding(false);
		await typewriterQueue(mesgsRef, stream, 20);
	};

	const handleKeyPress = (event: { key: string }) => {
		if (event.key === "Enter") {
			handleMessageSubmit();
		}
	};

	useEffect(() => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, []); // Remove mesgsRef.current from the dependency array

	if (!isLoaded) {
		return (
			<div className="flex justify-center items-center h-full">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<>
			<main ref={scrollRef} className="h-[90%] overflow-y-scroll">
				{mesgsRef.current.length !== 0 ? (
					mesgsRef.current.map(({ sender, text }, index) => (
						<div className="px-64 grid">
							<div
								className={`inline-block px-4 py-4 mt-4 rounded-md ${
									sender === "user"
										? "bg-slate-100 justify-self-end"
										: "bg-purple-100 justify-self-start"
								}`}
							>
								<span>
									{isPendding && mesgsRef.current.length - 1 === index ? (
										<Spin />
									) : (
										text
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
					className="w-1/2 border-1 border-slate-400 hover:border-slate-700"
				/>
			</footer>
		</>
	);
}
