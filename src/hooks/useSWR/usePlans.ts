import type { Plan } from "@prisma/client";
import useSWR from "swr";

export const usePlans = (): {
	plans: Plan[] | undefined;
	isPlansLoading: boolean;
	isPlansError: Error;
} => {
	const { data, error, isLoading } = useSWR<Plan[]>("/api/plan"); // Fix: Change the type of useSWR to Plan[]

	return {
		plans: data,
		isPlansLoading: isLoading,
		isPlansError: error,
	};
};
