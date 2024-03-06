"use client";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Layout, Nav, Button } from "@douyinfe/semi-ui";
import {
	IconSemiLogo,
	IconBell,
	IconHelpCircle,
	IconHome,
} from "@douyinfe/semi-icons";
import { UserButton } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { Header, Sider, Content } = Layout;
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<Layout
						style={{
							border: "1px solid var(--semi-color-border)",
							height: "100vh",
						}}
					>
						<Sider
							style={{
								backgroundColor: "var(--semi-color-bg-1)",
								height: "100%",
							}}
						>
							<Nav
								style={{ height: "100%" }}
								onSelect={(data) => console.log("trigger onSelect: ", data)}
								onClick={(data) => console.log("trigger onClick: ", data)}
							>
								<Nav.Header
									logo={
										<IconSemiLogo style={{ height: "36px", fontSize: 36 }} />
									}
									text={"Semi 运营后台"}
								/>
								<Nav.Item
									link="/"
									itemKey={"home"}
									text={"主页"}
									icon={<IconHome />}
								/>
								<Nav.Item
									link="/chatbot"
									itemKey={"chatbot"}
									text={"AI 问答"}
								/>
								<Nav.Footer collapseButton={true} />
							</Nav>
						</Sider>
						<Layout>
							<Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
								<Nav
									mode="horizontal"
									footer={
										<>
											<Button
												theme="borderless"
												icon={<IconBell size="large" />}
												style={{
													color: "var(--semi-color-text-2)",
													marginRight: "12px",
												}}
											/>
											<Button
												theme="borderless"
												icon={<IconHelpCircle size="large" />}
												style={{
													color: "var(--semi-color-text-2)",
													marginRight: "12px",
												}}
											/>
											<UserButton />
										</>
									}
								/>
							</Header>
							<Content
								style={{
									padding: "24px",
									backgroundColor: "var(--semi-color-bg-0)",
								}}
							>
								{children}
							</Content>
						</Layout>
					</Layout>
				</body>
			</html>
		</ClerkProvider>
	);
}
