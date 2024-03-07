"use client";

import { Input } from "@douyinfe/semi-ui";
import { IconLink, IconSend } from "@douyinfe/semi-icons";
import { useReducer, useRef, useState } from "react";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";

type Message = {
	text: string;
	sender: "user" | "assistant";
};

export default function ChatBot() {
	const [inputValue, setInputValue] = useState("");
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
				console.log("cleared");
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

		await typewriterQueue(mesgsRef, stream, 20);
	};

	const handleKeyPress = (event: { key: string }) => {
		if (event.key === "Enter") {
			handleMessageSubmit();
		}
	};

	return (
		<>
			<main ref={scrollRef} className="h-[90%] overflow-y-scroll">
				{mesgsRef.current.map(({ sender, text }) => (
					<div className="px-64 grid">
						<div
							className={`inline-block px-4 py-4 mt-4 rounded-md ${
								sender === "user"
									? "bg-slate-100 justify-self-end"
									: "bg-purple-100 justify-self-start"
							}`}
						>
							<span>{text}</span>
						</div>
					</div>
				))}
			</main>
			<footer className="h-[10%] w-full flex justify-center items-center">
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
					className="w-3/5 border-1 border-slate-400 hover:border-slate-700"
				/>
			</footer>
		</>
	);
}