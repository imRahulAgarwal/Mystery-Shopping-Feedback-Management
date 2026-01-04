import clsx from "clsx";
import { Edit, RotateCcw } from "lucide-react";
import Button from "@/lib/ui/Button/Button";

type RestoreButtonProps = {
	onButtonClick: () => void;
	disabled?: boolean;
	buttonLabel?: string;
};

export default function RestoreButton({ buttonLabel, disabled = false, onButtonClick }: RestoreButtonProps) {
	return (
		<Button
			onClick={onButtonClick}
			className={clsx(
				"flex items-center justify-center gap-1",
				"text-sm font-medium text-white",
				"bg-gray-500 hover:bg-gray-600",
				"px-4 py-2"
			)}
			disabled={disabled}
			title="Restore">
			<RotateCcw size={16} />
			{buttonLabel && <span>{buttonLabel}</span>}
		</Button>
	);
}
