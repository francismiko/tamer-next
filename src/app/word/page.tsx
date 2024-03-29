"use client";

import words from "@/data/CET-6.json";
import { Button } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import "@/css/button.css";

export type WordData = {
	usphone?: string;
	ukphone: string;
	name: string;
	trans: string[];
};

export default function Word() {
	const [word, setWord] = useState<WordData>();
	const [inputWord, setInputWord] = useState("");
	const [isQuizMode, setIsQuizMode] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleKeyDown = (e: any) => {
			const keyPressed = e.key.toLowerCase();
			if (keyPressed === "backspace") {
				setInputWord((prevInputWord) => prevInputWord.slice(0, -1));
			} else if (/[a-zA-Z]/.test(keyPressed)) {
				setInputWord((prevInputWord) => prevInputWord + keyPressed);
			}

			if (inputWord.toLowerCase() === word?.name) {
				alert("Congratulations! You spelled the word correctly!");
				setInputWord("");
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [inputWord]);

	useEffect(() => {
		setWord(words[Math.floor(Math.random() * words.length)]);
	}, []);

	return (
		<div className="flex relative justify-center items-center h-full">
			<div className="flex flex-col items-center">
				<button
					type="button"
					className="button"
					onClick={() => setIsQuizMode((prev) => !prev)}
				>
					{isQuizMode ? "关闭默写模式" : "开启默写模式"}
				</button>
				{!isQuizMode ? (
					<div className="text-6xl font-bold mb-2">{word?.name}</div>
				) : (
					<div className="text-6xl font-bold mb-2">
						{inputWord || "Type here"}
					</div>
				)}
				<div className="text-2xl font-bold">{word?.ukphone}</div>
				<div className="text-xl font-bold  text-gray- 500">{word?.trans} </div>
				<div className="flex gap-12 mt-12">
					<button type="button" className="button2">
						<span className="button_top">上一个</span>
					</button>
					<button type="button" className="button2">
						<span className="button_top">忘记了</span>
					</button>
					<button type="button" className="button2">
						<span className="button_top">下一个</span>
					</button>
				</div>
			</div>
		</div>
	);
}
