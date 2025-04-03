import { cn } from "../../lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({
	className,
	...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			{...props}
			className={cn(
				"w-full rounded-md border border-[#2a2a2a] bg-[#121212] px-3 py-2 text-sm text-white shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00aaff]",
				className
			)}
		/>
	);
}
