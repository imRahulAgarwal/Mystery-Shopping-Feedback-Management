"use client";

import { useForm } from "react-hook-form";
import { IndustryData, industrySchema } from "./industrySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createIndustry, readIndustry, updateIndustry } from "@/lib/api/industry";
import { toast } from "react-toastify";
import { checkIsAxiosError } from "@/lib/util/checkIsAxiosError";
import InputError from "@/lib/ui/InputError/InputError";
import { CloseButton, SubmitButton } from "../../Buttons/Buttons";
import Loader from "@/lib/ui/Loader/Loader";

type IndustryModalProps = {
	industryIdToEdit?: string;
	closeModal: () => void;
	onSuccess: () => void;
};

export default function IndustryModal({ industryIdToEdit, closeModal, onSuccess }: IndustryModalProps) {
	const [modalTitle, setModalTitle] = useState("Add Industry");

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		register,
		setValue,
		reset,
	} = useForm<IndustryData>({ mode: "onSubmit", resolver: zodResolver(industrySchema) });

	const onFormSubmit = async (data: IndustryData) => {
		let response = null;
		try {
			if (industryIdToEdit) {
				response = await updateIndustry(industryIdToEdit, data);
			} else {
				response = await createIndustry(data);
			}

			toast.success(response.message || "Industry details created successfully.");
			reset();
			onSuccess();
		} catch (error) {
			if (checkIsAxiosError(error)) {
				toast.error(error.response?.data?.error);
			} else {
				toast.error("Internal issue, please try again later.");
			}
		}
	};

	useEffect(() => {
		if (industryIdToEdit) {
			readIndustry(industryIdToEdit).then((data) => {
				setValue("name", data.industry.name);
				setModalTitle("Update Industry");
			});
		}
	}, [industryIdToEdit, setValue]);

	return (
		<>
			<div className="fixed inset-0 bg-black/50 z-40"></div>
			<div className="fixed inset-0 z-50 flex items-center justify-center ">
				<div className="w-full max-w-md rounded-md bg-white shadow-md border border-gray-200" role="dialog">
					<div className="border-b border-slate-200 p-4">
						<h2 className="text-lg font-semibold text-gray-900">{modalTitle}</h2>
					</div>

					<form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-3 p-4" noValidate>
						{/* Name */}
						<div className="flex flex-col gap-1">
							<label htmlFor="name" className="text-sm font-medium text-gray-700">
								<span>Name </span>
								<span className="text-red-600">*</span>
							</label>
							<input id="name" type="text" className="input" {...register("name", { required: true })} />
							{errors.name && <InputError errorMessage={errors.name.message} />}
						</div>

						{/* Actions */}
						<div className="mt-4 flex justify-center">
							<div className="ml-auto flex gap-2 items-center relative">
								<CloseButton buttonLabel="Close" onButtonClick={closeModal} disabled={isSubmitting} />
								<SubmitButton
									disabled={isSubmitting}
									buttonLabel={
										isSubmitting ? <Loader size={16} /> : industryIdToEdit ? "Update" : "Create"
									}
									onButtonClick={() => {}}
								/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
