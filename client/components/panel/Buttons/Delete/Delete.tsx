import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
	onButtonClick: () => void;
	disabled?: boolean;
	buttonLabel?: string;
};

export default function DeleteButton({ buttonLabel, disabled = false, onButtonClick = () => {} }: DeleteButtonProps) {
	return (
		<Button
			onClick={onButtonClick}
			className={clsx(
				"flex items-center justify-center gap-1",
				"text-sm font-medium text-white",
				"bg-red-500 hover:bg-red-600",
				"px-4"
			)}
			disabled={disabled}
			title="Delete">
			<Trash2 size={16} />
			{buttonLabel && <span>{buttonLabel}</span>}
		</Button>
	);
}
