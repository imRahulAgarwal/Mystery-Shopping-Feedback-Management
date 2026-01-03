"use client";

import { useForm } from "react-hook-form";
import { IndustryData, industrySchema } from "./industrySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createIndustry, readIndustry, updateIndustry } from "@/lib/api/industry";
import clsx from "clsx";
import { toast } from "react-toastify";
import { checkIsAxiosError } from "@/lib/util/checkIsAxiosError";
import InputError from "@/lib/ui/InputError/InputError";

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

	console.log(errors.name);

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
						<div className="mt-4 flex justify-end gap-2">
							<button
								onClick={closeModal}
								type="button"
								className={clsx(
									"btn w-fit px-4",
									"border border-gray-300",
									"text-gray-700 hover:bg-gray-100",
									"focus:outline-none focus-visible:ring-gray-300 focus-visible:ring-2"
								)}>
								Close
							</button>

							<button
								type="submit"
								className={clsx(
									"btn w-fit px-4",
									"border border-blue-500",
									"text-white bg-blue-600 hover:bg-blue-700",
									"focus:outline-none focus-visible:ring-blue-500 focus-visible:ring-2"
								)}>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
