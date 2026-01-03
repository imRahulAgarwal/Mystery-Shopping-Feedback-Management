import clsx from "clsx";

type PageLimitSelectProps = {
	options: { value: string; label: string }[];
	onOptionChange: (pageSize: string) => void;
	selectedValue: number;
};

export default function PageLimitSelect({ onOptionChange, options, selectedValue }: PageLimitSelectProps) {
	return (
		<select
			className={clsx(
				"px-4 py-2",
				"text-sm font-medium",
				"rounded-xs border border-slate-200",
				"focus:outline-none focus-visible:ring-slate-300 focus-visible:ring-1"
			)}
			onChange={(e) => onOptionChange(e.target.value)}
			value={String(selectedValue)}>
			{options.map((option) => (
				<option value={option.value} key={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}
