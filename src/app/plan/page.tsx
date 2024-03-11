"use client";

import {
	Button,
	Dropdown,
	Form,
	Modal,
	Spin,
	Table,
	Toast,
} from "@douyinfe/semi-ui";
import Container from "@/components/container";
import {
	IconMore,
	IconDelete,
	IconStar,
	IconVerify,
	IconEdit,
} from "@douyinfe/semi-icons";
import { useMemo, useRef, useState } from "react";
import { usePlans } from "@/hooks/useSWR/usePlans";
import { useAuth } from "@clerk/nextjs";
import { useCreatePlan } from "@/hooks/useSWRMutate/useCreatePlan";
import { useSWRConfig } from "swr";

export default function Plan() {
	const { userId, isLoaded } = useAuth();
	const { mutate } = useSWRConfig();
	const { plans, isPlansLoading } = usePlans();
	const { createPlan } = useCreatePlan();
	const [visible, setVisible] = useState(false);
	const formRef = useRef<any>(null);
	const scroll = useMemo(() => ({ y: 500 }), []);

	const showDialog = () => {
		setVisible(true);
	};

	const handleCreatePlan = async () => {
		setVisible(false);
		const formValues = formRef.current.formApi.getValues();
		await createPlan({ ...formValues, owner: userId });

		mutate("/api/plan");
		Toast.success({ content: "新建成功" });
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const handleAfterClose = () => {};

	const handleDeletePlan = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, { method: "DELETE" });

			mutate("/api/plan");
			Toast.success({ content: "删除成功" });
		} catch (e) {
			Toast.error({ content: "删除失败" });
		}
	};

	const columns = [
		{
			title: "目标",
			dataIndex: "target",
		},
		{
			title: "内容",
			dataIndex: "content",
		},
		{
			title: "阶段性结果",
			dataIndex: "key_result",
		},
		{
			title: "截止至",
			dataIndex: "deadline",
		},
		{
			title: "创建者",
			dataIndex: "owner",
			render: (text: string) => {
				return <div>{text}</div>;
			},
		},
		{
			title: "更新于",
			dataIndex: "updated_at",
		},
		{
			title: "创建于",
			dataIndex: "created_at",
		},
		{
			title: "收藏",
			dataIndex: "is_star",
		},
		{
			title: "已完成",
			dataIndex: "is_done",
		},
		{
			title: "",
			dataIndex: "operate",
			render: (_: any, record: any) => {
				return (
					<Dropdown
						trigger="hover"
						position="topLeft"
						render={
							<Dropdown.Menu>
								<Dropdown.Item icon={<IconStar />}>收藏</Dropdown.Item>
								<Dropdown.Item icon={<IconVerify />}>完成</Dropdown.Item>
								<Dropdown.Item icon={<IconEdit />}>修改</Dropdown.Item>
								<Dropdown.Item
									icon={<IconDelete />}
									onClick={() => handleDeletePlan(record.id.toString())}
									type="danger"
								>
									删除
								</Dropdown.Item>
							</Dropdown.Menu>
						}
					>
						<IconMore>始终展示</IconMore>
					</Dropdown>
				);
			},
		},
	];

	if (!isLoaded || isPlansLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<main className="px-16 py-4">
			<Container>
				<Button onClick={showDialog} className="float-right mb-2 bg-slate-200">
					新建计划
				</Button>
				{plans && (
					<Table columns={columns} dataSource={plans} scroll={scroll} />
				)}
			</Container>
			<Modal
				title="计划内容"
				visible={visible}
				onOk={handleCreatePlan}
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
						<Form.Select.Option value="单词">单词</Form.Select.Option>
						<Form.Select.Option value="语法">语法</Form.Select.Option>
						<Form.Select.Option value="写作">写作</Form.Select.Option>
						<Form.Select.Option value="阅读">阅读</Form.Select.Option>
					</Form.Select>
					<Form.Input
						field="key_result"
						label="阶段性结果"
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
