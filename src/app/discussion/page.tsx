"use client";

import Container from "@/components/container";
import { useAuth, useUser } from "@clerk/nextjs";
import { Avatar, Layout, Spin } from "@douyinfe/semi-ui";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, type FC, useEffect } from "react";
import Markdown from "react-markdown";
import { io } from "socket.io-client";

type Message = {
	id: string;
	senderName: string;
	content: string;
	avatar: string;
};

export default function Discussion() {
	const { Header, Footer, Content } = Layout;
	const { user } = useUser();
	const { isLoaded } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const socket = io("http://localhost:4000");
	console.log(user?.imageUrl);

	const handleSendMessage = () => {
		if (!socket) return;
		if (!currentMessage) return;

		socket.emit("message", {
			id: user?.id,
			senderName: user?.username,
			content: currentMessage,
			avatar: user?.imageUrl,
		});

		setCurrentMessage("");
	};

	const sendMessageEvent = (message: Message) => {
		setMessages((prevMessages) => [...(prevMessages as Message[]), message]);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		socket.connect();

		socket.on("messageResponse", sendMessageEvent);

		return () => {
			socket.off("messageResponse", sendMessageEvent);
			socket.disconnect();
		};
	}, []);

	if (!isLoaded) {
		return (
			<div className="flex justify-center items-center h-full">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<main className="px-32 py-8 h-full">
			<Container className="h-full overflow-hidden px-0 py-0">
				<Header className="h-4"></Header>
				<Content className="h-3/4 px-24 overflow-y-scroll">
					{messages?.map(({ content, senderName, id, avatar }) => (
						<div className="grid">
							<div
								className={`relative ${
									id === user?.id ? "justify-self-end" : "justify-self-start"
								}`}
							>
								<Avatar
									size="default"
									src={avatar}
									className={`absolute drop-shadow-md top-6 ${
										id === user?.id ? " -right-16" : "-left-16"
									}`}
								/>
								<p>{senderName}</p>
								<div className="inline-block whitespace-normal drop-shadow-lg max-w-xs h-auto px-4 py-2 bg-indigo-50 rounded mb-8">
									<Markdown>{content}</Markdown>
								</div>
							</div>
						</div>
					))}
				</Content>
				<Footer className="h-1/4">
					<Toolbar />
					<input
						type="text"
						value={currentMessage}
						onChange={(e) => setCurrentMessage(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					{/* <Editor /> */}
				</Footer>
			</Container>
		</main>
	);
}

const Toolbar: FC<{ children?: React.ReactNode; className?: string }> = ({
	children,
	className,
}) => {
	return <div className={`${className} h-8 bg-slate-100`}>{children}</div>;
};

const Editor: FC = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: "<p>Hello World! 🌎️</p>",
	});

	return <EditorContent editor={editor} className="" />;
};
