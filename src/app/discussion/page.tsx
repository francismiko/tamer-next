"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Layout, Spin } from "@douyinfe/semi-ui";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, type FC, useEffect } from "react";
import { io } from "socket.io-client";

export default function Discussion() {
	const { Header, Footer, Content } = Layout;
	const { isLoaded } = useAuth();
	const [messages, setMessages] = useState<string[]>([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const socket = io("http://localhost:4000");

	const handleSendMessage = () => {
		if (!socket) return;
		console.log(socket);

		socket.emit("message", currentMessage);
		setCurrentMessage("");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		socket.connect();
		console.log(socket);

		socket.emit("test", "This is a test message from client");

		socket.on("test", (response) => {
			console.log("Received response from server:", response);
		});

		socket.on("message", (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		return () => {
			if (!socket) return;

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
				<Header className="h-4">Header</Header>
				<Content className="h-3/4">
					{messages.map((message, index) => (
						<p>{message}</p>
					))}
				</Content>
				<Footer className="h-1/4">
					<Toolbar>1</Toolbar>
					<input
						type="text"
						value={currentMessage}
						onChange={(e) => setCurrentMessage(e.target.value)}
					/>
					<button type="button" onClick={handleSendMessage}>
						Send
					</button>
					{/* <Editor /> */}
				</Footer>
			</Container>
		</main>
	);
}

const Toolbar: FC<{ children: React.ReactNode; className?: string }> = ({
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
