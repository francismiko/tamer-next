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
import { useAuth, useUser } from "@clerk/nextjs";
import { useCreatePlan } from "@/hooks/useSWRMutate/useCreatePlan";
import { useSWRConfig } from "swr";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default function Plan() {
	const { userId, isLoaded } = useAuth();
	const { user } = useUser();
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

	const handleDeletePlan = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, { method: "DELETE" });

			mutate("/api/plan");
			Toast.success({ content: "删除成功" });
		} catch (e) {
			Toast.error({ content: "删除失败" });
		}
	};

	const handleSetStar = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, {
				method: "PUT",
				body: JSON.stringify({ is_star: true }),
			});

			mutate("/api/plan");
			Toast.success({ content: "收藏成功" });
		} catch (e) {
			Toast.error({ content: "收藏失败" });
		}
	};

	const handleSetDone = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, {
				method: "PUT",
				body: JSON.stringify({ is_done: true }),
			});

			mutate("/api/plan");
			Toast.success({ content: "标记完成成功" });
		} catch (e) {
			Toast.error({ content: "标记完成失败" });
		}
	};

	const handleCancelStar = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, {
				method: "PUT",
				body: JSON.stringify({ is_star: false }),
			});

			mutate("/api/plan");
			Toast.success({ content: "取消收藏成功" });
		} catch (e) {
			Toast.error({ content: "取消收藏失败" });
		}
	};

	const handleCancelDone = async (id: string) => {
		try {
			await fetch(`/api/plan?id=${id}`, {
				method: "PUT",
				body: JSON.stringify({ is_done: false }),
			});

			mutate("/api/plan");
			Toast.success({ content: "取消完成标记成功" });
		} catch (e) {
			Toast.error({ content: "取消完成标记失败" });
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
			render: (text: string) => {
				return <div>{dayjs(text).format("YYYY/M/D")}</div>;
			},
		},
		{
			title: "创建者",
			dataIndex: "owner",
			render: () => {
				return (
					<Image
						src={user?.imageUrl ?? ""}
						width={40}
						height={40}
						alt=""
						className="rounded"
					/>
				);
			},
		},
		{
			title: "更新于",
			dataIndex: "updated_at",
			render: (text: string) => {
				return <div>{dayjs(text).fromNow()}</div>;
			},
		},
		{
			title: "创建于",
			dataIndex: "created_at",
			render: (text: string) => {
				return <div>{dayjs(text).fromNow()}</div>;
			},
		},
		{
			title: "收藏",
			dataIndex: "is_star",
			render: (_: any, record: any) => {
				return record.is_star && <IconStar className="text-yellow-400" />;
			},
		},
		{
			title: "已完成",
			dataIndex: "is_done",
			render: (_: any, record: any) => {
				return record.is_done && <IconVerify className="text-green-500" />;
			},
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
								<Dropdown.Item
									icon={<IconStar />}
									onClick={
										!record.is_star
											? () => handleSetStar(record.id.toString())
											: () => handleCancelStar(record.id.toString())
									}
								>
									收藏
								</Dropdown.Item>
								<Dropdown.Item
									icon={<IconVerify />}
									onClick={
										!record.is_done
											? () => handleSetDone(record.id.toString())
											: () => handleCancelDone(record.id.toString())
									}
								>
									标记完成
								</Dropdown.Item>
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
