import Button from "@/lib/ui/Button/Button";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

type NextButtonProps = {
	isButtonDisabled: boolean;
	onButtonClick: () => void;
};

export default function NextButton({ isButtonDisabled, onButtonClick }: NextButtonProps) {
	return (
		<Button
			className={clsx("border border-slate-300", "bg-slate-300 hover:bg-slate-400", "p-2")}
			disabled={isButtonDisabled}
			onClick={onButtonClick}>
			<ChevronRight size={14} />
		</Button>
	);
}
