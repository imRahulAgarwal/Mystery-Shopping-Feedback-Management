import clsx from "clsx";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
	iconSize?: number;
	showLabel?: boolean;
	buttonClass?: string;
	disabled?: boolean;
	onButtonClick?: () => void;
};

export default function DeleteButton({
	iconSize = 16,
	showLabel = false,
	buttonClass = "",
	disabled = false,
	onButtonClick = () => {},
}: DeleteButtonProps) {
	return (
		<button
			type="button"
			className={clsx(
				"rounded-sm",
				"text-white bg-red-500 hover:bg-red-600",
				"transition-colors duration-200",
				showLabel ? "flex items-center justify-center gap-1 text-sm font-medium px-4 py-2" : "p-2",
				buttonClass,
				disabled ? "disabled:opacity-60 hover:cursor-not-allowed" : "hover:cursor-pointer"
			)}
			title="Delete"
			disabled={disabled}
			onClick={onButtonClick}>
			<Trash2 size={iconSize} />
			{showLabel && <span>Delete</span>}
		</button>
	);
}
