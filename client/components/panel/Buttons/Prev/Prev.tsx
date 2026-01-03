import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

type PrevButtonProps = {
	isButtonDisabled: boolean;
	onButtonClick: () => void;
};

export default function PrevButton({ isButtonDisabled, onButtonClick }: PrevButtonProps) {
	return (
		<Button
			className={clsx("border border-slate-300", "bg-slate-300 hover:bg-slate-400", "p-2")}
			disabled={isButtonDisabled}
			onClick={onButtonClick}>
			<ChevronLeft size={14} />
		</Button>
	);
}
