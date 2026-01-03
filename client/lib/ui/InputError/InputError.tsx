type InputErrorProps = {
	errorMessage?: string;
};

export default function InputError({ errorMessage }: InputErrorProps) {
	if (!errorMessage) {
		return "";
	}

	return <small className="text-red-500">{errorMessage}</small>;
}
