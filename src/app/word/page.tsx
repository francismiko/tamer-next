"use client";

import words from "@/data/CET-6.json";
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
	const [wordStack, setWordStack] = useState<number[]>([]);
	const [wordIndex, setWordIndex] = useState(-1);

	const previous = () => {
		if ((wordStack as number[])?.length > 0) {
			setWordIndex((prev) => prev - 1);
		}
	};

	const next = () => {
		if (wordIndex === (wordStack as number[])?.length - 1) {
			const index = Math.floor(Math.random() * words.length);
			setWordStack((prev) => [...(prev ?? []), index]);
		}
		setWordIndex((prev) => prev + 1);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleKeyDown = (e: any) => {
			const { key } = e;

			if (!isQuizMode) return;
			if (key === "Backspace") {
				setInputWord((prevInputWord) => prevInputWord.slice(0, -1));
			} else if (/[a-zA-Z]/.test(key) && key.length === 1) {
				setInputWord((prevInputWord) => prevInputWord + key.toLowerCase());
			}

			if (inputWord.toLowerCase() === word?.name) {
				setInputWord("");
			}

			if (key === "Enter") {
				e.preventDefault();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [inputWord, isQuizMode]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (wordIndex === -1) {
			next();
		}
		setWord(words[wordStack[wordIndex]]);
	}, [wordIndex]);

	return (
		<div className="flex relative justify-center items-center h-full">
			<div className="flex flex-col items-center">
				<button
					type="button"
					className="button"
					onClick={() => {
						setIsQuizMode((prev) => !prev);
						setInputWord("");
					}}
				>
					{isQuizMode ? "关闭默写模式" : "开启默写模式"}
				</button>
				{!isQuizMode ? (
					<div className="text-6xl font-bold mb-2">{word?.name}</div>
				) : (
					<div className="text-6xl font-bold mb-2">
						{inputWord || "_________"}
					</div>
				)}
				<div className="text-2xl font-bold">{word?.ukphone}</div>
				<div className="text-xl font-bold  text-gray- 500">{word?.trans} </div>
				<div className="flex gap-12 mt-12">
					<button type="button" className="button2" onClick={previous}>
						<span className="button_top">上一个</span>
					</button>
					<button type="button" className="button2">
						<span className="button_top">忘记了</span>
					</button>
					<button type="button" className="button2" onClick={next}>
						<span className="button_top">下一个</span>
					</button>
				</div>
			</div>
		</div>
	);
}
