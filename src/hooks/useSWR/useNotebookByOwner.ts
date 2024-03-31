import type { Notebook as _Notebook } from "@prisma/client";
import useSWRImmutable from "swr/immutable";

type QueryParams = {
	userId: _Notebook["owner"];
};

export const useNotebookByOwner = (
	queryParams: QueryParams,
): {
	noteRecords?: _Notebook[];
	isMessagesLoading: boolean;
	isMessagesError: Error;
} => {
	const { userId } = queryParams;
	const { data, error, isLoading } = useSWRImmutable<_Notebook[]>(
		`/api/word?owner=${userId}`,
	);

	return {
		noteRecords: data,
		isMessagesLoading: isLoading,
		isMessagesError: error,
	};
};
