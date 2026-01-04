import Button from "@/lib/ui/Button/Button";

type ConfirmationModalProps = {
	onCloseButtonClick: () => void;
	onSubmitButtonClick: () => void;
	isSubmitting: boolean;
};

export default function ConfirmationModal({
	onCloseButtonClick,
	onSubmitButtonClick,
	isSubmitting,
}: ConfirmationModalProps) {
	return (
		<>
			<div className="fixed inset-0 z-40 bg-black/50"></div>
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				<div className="max-w-md w-full rounded-xs bg-white shadow-md border border-gray-200" role="dialog">
					<div className="border-b border-slate-200 p-4">
						<h2 className="text-lg font-semibold text-gray-900">Delete Confirmation</h2>
					</div>

					<div className="p-4 flex flex-col justify-center items-center gap-4">
						<p>Are you sure you want to proceed with the process?</p>
						<div className="flex items-center gap-4">
							<Button
								className="px-4 py-1 border border-slate-200 bg-slate-500 hover:bg-slate-600 text-white"
								onClick={onCloseButtonClick}
								disabled={isSubmitting}>
								No
							</Button>

							<Button
								className="px-4 py-1 border border-red-500 bg-red-500 hover:bg-red-600 text-white"
								onClick={onSubmitButtonClick}
								disabled={isSubmitting}>
								Yes
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
