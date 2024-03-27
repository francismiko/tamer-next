"use client";

import Container from "@/components/container";
import { useAuth } from "@clerk/nextjs";
import { Layout, Spin } from "@douyinfe/semi-ui";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { FC } from "react";

export default function Discussion() {
	const { Header, Footer, Content } = Layout;
	const { isLoaded } = useAuth();

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
				<Content className="bg-slate-500 h-3/4">Content</Content>
				<Footer className="h-1/4">
					<Toolbar>1</Toolbar>
					<Editor />
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
