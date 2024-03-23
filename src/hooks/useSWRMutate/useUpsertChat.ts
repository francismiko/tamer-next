import useSWRMutation from "swr/mutation";

export type UpsertChatArg = {
	owner: string;
	messages?: Message[];
};

type Message = {
	sender: "user" | "assistant";
	text: string;
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
