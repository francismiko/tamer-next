import type { Plan as _Plan } from "@prisma/client";
import useSWRMutation from "swr/mutation";

export type CreatePlanArg = {
	owner: _Plan["owner"];
	target?: _Plan["target"];
	content?: _Plan["content"];
	key_result?: _Plan["key_result"];
	deadline?: _Plan["deadline"];
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
