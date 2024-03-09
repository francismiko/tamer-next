import useSWRMutation from "swr/mutation";

export type CreatePlanArg = {
	owner: string;
	title?: string;
	content?: string;
	key_result?: string;
	deadline?: Date;
};

export const useCreatePlan = (): {
	createPlan: typeof trigger;
	isPlanMutating: boolean;
} => {
	const { trigger, isMutating } = useSWRMutation(
		"/api/plan",
		async (url: string, { arg }: { arg: CreatePlanArg }) => {
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
		createPlan: trigger,
		isPlanMutating: isMutating,
	};
};
