import type { Notebook as _Notebook } from "@prisma/client";
import useSWRMutation from "swr/mutation";

export type CreateNotebookArg = {
	owner: _Notebook["owner"];
	word_index: _Notebook["word_index"];
};

export const useCreateNotebook = (): {
	createNotebook: typeof trigger;
	isNotebookMutating: boolean;
} => {
	const { trigger, isMutating } = useSWRMutation(
		"/api/word",
		async (url: string, { arg }: { arg: CreateNotebookArg }) => {
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
		createNotebook: trigger,
		isNotebookMutating: isMutating,
	};
};
