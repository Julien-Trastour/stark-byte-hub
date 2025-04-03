import type { LabelHTMLAttributes } from "react";
import clsx from "clsx";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", htmlFor, ...props }: Props) {
	return (
		<label
			{...props}
			htmlFor={htmlFor}
			className={clsx("block text-sm font-medium text-gray-300 mb-1", className)}
		/>
	);
}
