import clsx from "clsx";
import { Edit } from "lucide-react";
import Button from "@/lib/ui/Button/Button";

type UpdateButtonProps = {
	onButtonClick: () => void;
	disabled?: boolean;
	buttonLabel?: string;
};

export default function UpdateButton({ buttonLabel, disabled = false, onButtonClick }: UpdateButtonProps) {
	return (
		<Button
			onClick={onButtonClick}
			className={clsx(
				"flex items-center justify-center gap-1",
				"text-sm font-medium text-white",
				"bg-blue-500 hover:bg-blue-600",
				"px-4 py-2"
			)}
			disabled={disabled}
			title="Update">
			<Edit size={16} />
			{buttonLabel && <span>{buttonLabel}</span>}
		</Button>
	);
}
