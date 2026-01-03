import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";

type CloseButtonProps = {
	disabled: boolean;
	onButtonClick: () => void;
	buttonLabel: string;
};

export default function CloseButton({ buttonLabel, onButtonClick, disabled }: CloseButtonProps) {
	return (
		<Button
			onClick={onButtonClick}
			disabled={disabled}
			className={clsx(
				"text-sm font-medium text-gray-900",
				"bg-slate-200 hover:bg-slate-300",
				"px-4 py-2",
				"border border-slate-200",
				"focus-visible:ring-slate-200 focus-visible:ring-1"
			)}>
			<span>{buttonLabel}</span>
		</Button>
	);
}
