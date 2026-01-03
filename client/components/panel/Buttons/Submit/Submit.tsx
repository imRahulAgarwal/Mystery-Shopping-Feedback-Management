import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";
import React from "react";

type SubmitButtonProps = {
	onButtonClick: () => void;
	buttonLabel: string | React.ReactNode;
	disabled: boolean;
};

export default function SubmitButton({ buttonLabel, onButtonClick, disabled }: SubmitButtonProps) {
	return (
		<Button
			type="submit"
			onClick={onButtonClick}
			disabled={disabled}
			className={clsx(
				"text-sm font-medium text-white",
				"bg-blue-500 hover:bg-blue-600",
				"px-4 py-2",
				"border border-blue-500",
				"focus-visible:ring-blue-500 focus-visible:ring-1"
			)}>
			<span>{buttonLabel}</span>
		</Button>
	);
}
