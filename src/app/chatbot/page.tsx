"use client";

import { Input } from "@douyinfe/semi-ui";
import { IconLink, IconSend } from "@douyinfe/semi-icons";
import { useState } from "react";

type Message = {
	text: string;
	sender: "user" | "assistant";
};

export default function ChatBot() {
	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const handleMessageSubmit = () => {
		if (inputValue.trim() !== "") {
			setMessages([...messages, { text: inputValue, sender: "user" }]);
			setInputValue("");
		}
	};

	const handleKeyPress = (event: { key: string }) => {
		if (event.key === "Enter") {
			handleMessageSubmit();
		}
	};

	return (
		<>
			<main className="h-[90%] overflow-y-scroll">
				{messages.map((message) => (
					<div className="px-64">
						<div className="inline-block px-4 py-4 mt-4 bg-slate-100 rounded-md">
							<span>{message.text}</span>
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
