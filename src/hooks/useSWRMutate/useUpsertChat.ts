import type { Chat as _Chat, Message as _Message } from "@prisma/client";
import useSWRMutation from "swr/mutation";

export type UpsertChatArg = {
	owner: _Chat["owner"];
	messages?: Message[];
};

export type Message = {
	sender: _Message["sender"];
	text: _Message["text"];
};

export const useUpsertChat = (): {
	upsertChat: typeof trigger;
	isChatMutating: boolean;
} => {
	const { trigger, isMutating } = useSWRMutation(
		"/api/chat/upsertChat",
		async (url: string, { arg }: { arg: UpsertChatArg }) => {
			await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...arg }),
			});
		},
	);

	return {
		upsertChat: trigger,
		isChatMutating: isMutating,
	};
};
