"use client";

import { Button, Form, Modal, Table } from "@douyinfe/semi-ui";
import Container from "@/components/container";
import { IconMore } from "@douyinfe/semi-icons";
import { useRef, useState, type LegacyRef } from "react";

export default function Org() {
	const [visible, setVisible] = useState(false);
	const formRef = useRef<any>(null);

	const showDialog = () => {
		setVisible(true);
	};
	const handleOk = () => {
		setVisible(false);
		const formContent = formRef.current.formApi.getValues();

		console.log(formContent);
	};
	const handleCancel = () => {
		setVisible(false);
	};
	const handleAfterClose = () => {};

	const columns = [
		{
			title: "目标",
			dataIndex: "target",
			render: (text: string) => {
				return <div>{text}</div>;
			},
		},
		{
			title: "内容",
			dataIndex: "content",
			render: (text: string) => {
				return <div>{text}</div>;
			},
		},
		{
			title: "截止时间",
		},
		{
			title: "创建者",
			dataIndex: "owner",
			render: (text: string) => {
				return <div>{text}</div>;
			},
		},
		{
			title: "更新日期",
			dataIndex: "updateTime",
		},
		{
			title: "创建日期",
			dataIndex: "updateTime",
		},
		{
			title: "",
			dataIndex: "operate",
			render: () => {
				return <IconMore />;
			},
		},
	];
	const data = [
		{
			key: "1",
			name: "Semi Design 设计稿.fig",
			nameIconSrc:
				"https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png",
			size: "2M",
			owner: "姜鹏志",
			updateTime: "2020-02-02 05:13",
			avatarBg: "grey",
		},
	];

	const handleCreatePlan = () => {};

	return (
		<main className="px-16 py-4">
			<Container>
				<Button onClick={showDialog} className="float-right mb-2">
					新建计划
				</Button>
				<Table columns={columns} dataSource={data} pagination={false} />
			</Container>
			<Modal
				title="计划内容"
				visible={visible}
				onOk={handleOk}
				afterClose={handleAfterClose} //>=1.16.0
				onCancel={handleCancel}
				okButtonProps={{ theme: "light" }}
				okText={"提交"}
				closeOnEsc={true}
			>
				<Form labelPosition="inset" layout="horizontal" ref={formRef}>
					<Form.Input
						field="target"
						label="目标"
						trigger="blur"
						style={{ width: 350 }}
					/>
					<Form.Select field="content" label="内容" style={{ width: 350 }}>
						<Form.Select.Option value="word">单词</Form.Select.Option>
						<Form.Select.Option value="grammar">语法</Form.Select.Option>
						<Form.Select.Option value="writing">写作</Form.Select.Option>
						<Form.Select.Option value="read">阅读</Form.Select.Option>
					</Form.Select>
					<Form.Input
						field="key-result"
						label="阶段性结果 1"
						trigger="blur"
						style={{ width: 350 }}
					/>
					<Form.Input
						field="key-result"
						label="阶段性结果 2"
						trigger="blur"
						style={{ width: 350 }}
					/>
					<Form.Input
						field="key-result"
						label="阶段性结果 3"
						trigger="blur"
						style={{ width: 350 }}
					/>
					<Form.DatePicker
						field="deadline"
						label="截止日期"
						style={{ width: 350 }}
						initValue={new Date()}
					/>
				</Form>
			</Modal>
		</main>
	);
}
