import clsx from "clsx";

type LoaderProps = {
	size?: number;
	className?: string;
	label?: string;
};

export default function Loader({ size = 32, className, label = "Loading" }: LoaderProps) {
	return (
		<div role="status" aria-live="polite" className={clsx("inline-flex items-center gap-2", className)}>
			<div
				className="animate-spin rounded-full border-2 border-current border-t-transparent"
				style={{ width: size, height: size }}
			/>
			<span className="sr-only">{label}</span>
		</div>
	);
}
