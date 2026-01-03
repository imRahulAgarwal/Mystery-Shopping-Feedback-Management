import clsx from "clsx";

type ButtonProps = {
	children: React.ReactNode;
	title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
	children,
	type = "button",
	disabled = false,
	title,
	className,
	...rest
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			aria-label={!children ? title : undefined}
			className={clsx(
				"rounded-xs",
				"transition-colors duration-200 ease-in-out",
				"disabled:opacity-60 disabled:cursor-not-allowed",
				"hover:cursor-pointer",
				"focus:outline-none",
				className
			)}
			{...rest}>
			{children}
		</button>
	);
}
