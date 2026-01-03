import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";
import { Plus } from "lucide-react";

type CreateButtonProps = {
	onButtonClick: () => void;
	buttonLabel?: string;
};

export default function CreateButton({ buttonLabel, onButtonClick }: CreateButtonProps) {
	return (
		<Button
			onClick={onButtonClick}
			className={clsx(
				"flex items-center justify-center gap-1",
				"text-sm font-medium text-white",
				"bg-blue-500 hover:bg-blue-600",
				"px-4 py-2"
			)}>
			<Plus size={16} />
			{buttonLabel && <span>{buttonLabel}</span>}
		</Button>
	);
}
