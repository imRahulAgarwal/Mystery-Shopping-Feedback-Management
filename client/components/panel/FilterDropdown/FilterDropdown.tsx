import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Button from "@/lib/ui/Button/Button";

type FilterDropdownProps = {
	label?: string;
	children: React.ReactNode;
	className?: string;
};

export default function FilterDropdown({ label = "Filters", children, className }: FilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close on click outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Close on Escape
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	return (
		<div ref={dropdownRef} className={clsx("relative inline-block", className)}>
			<Button
				aria-haspopup="menu"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
				className={clsx(
					"px-4 py-2",
					"border border-slate-200",
					"focus-visible:ring-slate-200 focus-visible:ring-1",
					"text-sm"
				)}>
				{label}
			</Button>

			{isOpen && (
				<div
					role="menu"
					className={clsx(
						"absolute left-0 z-50 mt-2 min-w-60 rounded-xs border border-slate-400 bg-white shadow-md",
						"p-3"
					)}>
					{children}
				</div>
			)}
		</div>
	);
}
