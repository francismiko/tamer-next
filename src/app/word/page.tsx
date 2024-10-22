"use client";

import words from "@/data/CET-6.json";
import { useEffect, useState } from "react";
import "@/css/button.css";
import {
	Badge,
	Dropdown,
	List,
	Notification,
	SideSheet,
} from "@douyinfe/semi-ui";
import { useCreateNotebook } from "@/hooks/useSWRMutate/useCreateNotebook";
import { useAuth } from "@clerk/nextjs";
import { useNotebookByOwner } from "@/hooks/useSWR/useNotebookByOwner";
import { mutate } from "swr";

export type WordData = {
	usphone?: string;
	ukphone: string;
	name: string;
	trans: string[];
};

export default function Word() {
	const { userId } = useAuth();
	const { createNotebook } = useCreateNotebook();
	const { noteRecords } = useNotebookByOwner({ userId: userId ?? "" });
	const dataSource = noteRecords?.map(({ word_index, id }) => ({
		id,
		name: words[word_index].name,
		trans: words[word_index].trans,
	}));
	const [word, setWord] = useState<WordData>();
	const [inputWord, setInputWord] = useState("");
	const [isQuizMode, setIsQuizMode] = useState(false);
	const [wordStack, setWordStack] = useState<number[]>([]);
	const [wordIndex, setWordIndex] = useState(-1);
	const [visible, setVisible] = useState(false);

	const change = () => {
		setVisible(!visible);
	};

	const handlePrevious = () => {
		if ((wordStack as number[])?.length > 0) {
			setWordIndex((prev) => prev - 1);
		}
	};

	const handleNext = () => {
		if (wordIndex === (wordStack as number[])?.length - 1) {
			const index = Math.floor(Math.random() * words.length);
			setWordStack((prev) => [...(prev ?? []), index]);
		}
		setWordIndex((prev) => prev + 1);
	};

	const handleForget = async () => {
		if (!userId) return;
		createNotebook({
			owner: userId,
			word_index: wordStack[wordIndex],
		});

		Notification.info({
			title: "已加入复习本",
			duration: 1,
		});

		handleNext();
		mutate(`/api/word?owner=${userId}`);
	};

	const handleDeleteNoteRecord = async (id: number, name: string) => {
		await fetch(`/api/word?id=${id}`, { method: "DELETE" });
		mutate(`/api/word?owner=${userId}`);
		Notification.success({
			title: `已完成复习 - ${name}`,
			duration: 0.8,
		});
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
			handleNext();
		}
		setWord(words[wordStack[wordIndex]]);
	}, [wordIndex]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (inputWord.toLowerCase() === word?.name) {
			handleNext();
			setInputWord("");
			Notification.success({
				title: "正确",
				duration: 1,
			});
		}
	}, [inputWord]);

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
				<div className="absolute top-24">
					<Dropdown
						trigger={"click"}
						position={"bottom"}
						showTick={true}
						render={
							<Dropdown.Menu>
								<Dropdown.Item active={true}>大学英语六级</Dropdown.Item>
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
						<button type="button" className="cta">
							<span className="hover-underline-animation ">选择难度</span>
						</button>
					</Dropdown>
				</div>
				<div className="absolute right-12 bottom-12">
					<Badge
						count={noteRecords?.length}
						type="danger"
						className={`${!noteRecords && "hidden"}`}
					>
						<img
							alt=""
							src="/notebook.svg"
							className="size-32 cursor-pointer"
							onClick={change}
							onKeyDown={change}
						/>
					</Badge>
				</div>
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
					<button type="button" className="button2" onClick={handlePrevious}>
						<span className="button_top">上一个</span>
					</button>
					<button type="button" className="button2" onClick={handleForget}>
						<span className="button_top">忘记了</span>
					</button>
					<button type="button" className="button2" onClick={handleNext}>
						<span className="button_top">下一个</span>
					</button>
				</div>
			</div>
			<SideSheet title="单词复习本" visible={visible} onCancel={change}>
				<List
					bordered
					dataSource={dataSource}
					renderItem={({ name, trans, id }) => (
						<>
							<List.Item
								className="cursor-pointer hover:text-green-600"
								onClick={() => handleDeleteNoteRecord(id, name)}
							>
								{name} - {trans}
							</List.Item>
						</>
					)}
				/>
			</SideSheet>
		</div>
	);
}
