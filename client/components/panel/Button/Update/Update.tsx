import clsx from "clsx";
import { Edit } from "lucide-react";

type UpdateButtonProps = {
	iconSize?: number;
	showLabel?: boolean;
	buttonClass?: string;
	disabled?: boolean;
	onButtonClick?: () => void;
};

export default function UpdateButton({
	iconSize = 16,
	showLabel = false,
	buttonClass = "",
	disabled = false,
	onButtonClick = () => {},
}: UpdateButtonProps) {
	return (
		<button
			type="button"
			className={clsx(
				"rounded-sm",
				"text-white bg-blue-500 hover:bg-blue-600",
				"transition-colors duration-200",
				showLabel ? "flex items-center justify-center gap-1 text-sm font-medium px-4 py-2" : "p-2",
				buttonClass,
				disabled ? "disabled:opacity-60 hover:cursor-not-allowed" : "hover:cursor-pointer"
			)}
			title="Update"
			disabled={disabled}
			onClick={onButtonClick}>
			<Edit size={iconSize} />
			{showLabel && <span>Update</span>}
		</button>
	);
}
