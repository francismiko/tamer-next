import type { Chat as _Chat, Message as _Message } from "@prisma/client";
import useSWR from "swr";

type QueryParams = {
	userId: _Chat["owner"];
};

export const useMessagesByOwner = (
	queryParams: QueryParams,
): {
	messages?: _Message[];
	isMessagesLoading: boolean;
	isMessagesError: Error;
} => {
	const { userId } = queryParams;
	const { data, error, isLoading } = useSWR<_Message[]>(
		`/api/message?owner=${userId}`,
	);

	return {
		messages: data,
		isMessagesLoading: isLoading,
		isMessagesError: error,
	};
};
