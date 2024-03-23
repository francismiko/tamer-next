import type { Plan as _Plan } from "@prisma/client";
import useSWR from "swr";

export const usePlans = (): {
	plans?: _Plan[];
	isPlansLoading: boolean;
	isPlansError: Error;
} => {
	const { data, error, isLoading } = useSWR<_Plan[]>("/api/plan");

	return {
		plans: data,
		isPlansLoading: isLoading,
		isPlansError: error,
	};
};
