"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/panel/TanstackTable/Table";
import { deleteIndustry, readIndustries, restoreIndustry } from "@/lib/api/industry";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import IndustryModal from "@/components/panel/Modal/IndustryModal/IndustryModal";
import { CreateButton, DeleteButton, UpdateButton } from "@/components/panel/Buttons/Buttons";
import PageLimitSelect from "@/components/panel/Select/PageLimit/PageLimit";
import ConfirmationModal from "@/components/panel/Modal/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { checkIsAxiosError } from "@/lib/util/checkIsAxiosError";
import FilterDropdown from "@/components/panel/FilterDropdown/FilterDropdown";
import RestoreButton from "@/components/panel/Buttons/Restore/Restore";

type Industry = {
	_id: string;
	name: string;
	slug: string;
	createdAt: Date;
};

type DeletedFilter = "active" | "deleted";
type FilterState = {
	isDeleted?: boolean;
};

export default function IndustriesPage() {
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState<Industry[]>([]);
	const [totalDocuments, setTotalDocuments] = useState(0);
	const [filteredDocuments, setFilteredDocuments] = useState(0);

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [sorting, setSorting] = useState<SortingState>([]);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 400);

	const [showCreateUpdateModal, setShowCreateUpdateModal] = useState(false);

	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
	const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);

	const [filter, setFilter] = useState<FilterState>({});
	const deletedValue: DeletedFilter = filter.isDeleted === true ? "deleted" : "active";

	const fetchData = useCallback(async () => {
		setIsLoading(true);

		try {
			const response = await readIndustries({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				search: debouncedSearch,
				sort: sorting[0]?.id,
				order: sorting[0]?.desc === true ? "desc" : "asc",
				filter: JSON.stringify(filter),
			});

			if (response.success) {
				setData(response.industries);
				setTotalDocuments(response.totalDocuments);
				setFilteredDocuments(response.filteredDocuments);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [pagination, sorting, debouncedSearch, filter]);

	const handleUpdateButtonClick = useCallback((id: string) => {
		setSelectedIndustryId(id);
		setShowCreateUpdateModal(true);
	}, []);

	const handleDeleteButtonClick = useCallback((id: string) => {
		setSelectedIndustryId(id);
		setShowDeleteConfirmationModal(true);
	}, []);

	const handleRestoreButtonClick = useCallback(
		(id: string) => {
			restoreIndustry(id)
				.then((data) => {
					toast.success(data.message);
					fetchData();
				})
				.catch((error) => {
					if (checkIsAxiosError(error)) {
						toast.error(error.response?.data?.error || "Failed to restore industry details.");
					} else {
						toast.error("Failed to restore industry details.");
					}
				});
		},
		[fetchData]
	);

	const tableColumns: ColumnDef<Industry>[] = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "slug", header: "Slug" },
		{ accessorKey: "createdAt", header: "Created At", cell: ({ getValue }) => getValue() || "NA" },
		{
			accessorKey: "_id",
			id: "actions",
			header: "Actions",
			enableSorting: false,
			cell: ({ row }) => {
				return (
					<div className="flex gap-2">
						{filter.isDeleted === true ? (
							<RestoreButton onButtonClick={() => handleRestoreButtonClick(row.original._id)} />
						) : (
							<>
								<UpdateButton onButtonClick={() => handleUpdateButtonClick(row.original._id)} />
								<DeleteButton onButtonClick={() => handleDeleteButtonClick(row.original._id)} />
							</>
						)}
					</div>
				);
			},
		},
	];

	const handleNoConfirmationButton = useCallback(() => {
		setSelectedIndustryId(null);
		setShowDeleteConfirmationModal(false);
	}, []);

	const handleYesConfirmationButton = useCallback(() => {
		setIsLoading(true);
		if (selectedIndustryId) {
			deleteIndustry(selectedIndustryId)
				.then((data) => {
					toast.success(data.message);
					fetchData();
				})
				.catch((error) => {
					if (checkIsAxiosError(error)) {
						toast.error(error.response?.data?.error || "Failed to remove industry details.");
					} else {
						toast.error(error.message);
					}
				})
				.finally(() => {
					setSelectedIndustryId(null);
					setShowDeleteConfirmationModal(false);
					setIsLoading(false);
				});
		}
	}, [selectedIndustryId, fetchData]);

	const onCreateUpdateSuccess = useCallback(() => {
		fetchData();
		setShowCreateUpdateModal(false);
	}, [fetchData]);

	const onModalClose = useCallback(() => {
		setShowCreateUpdateModal(false);
		setSelectedIndustryId(null);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [debouncedSearch]);

	return (
		<div className="rounded-xs border border-slate-200 bg-white p-4">
			{/* Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
				<h2 className="text-lg font-semibold text-slate-800">Industry Management</h2>
				<CreateButton buttonLabel="Add Industry" onButtonClick={() => setShowCreateUpdateModal(true)} />
			</div>

			{/* Controls */}
			<div className="my-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				{/* Left actions */}
				<div className="flex flex-wrap items-center gap-2">
					<PageLimitSelect
						selectedValue={pagination.pageSize}
						options={[
							{ label: "10 / page", value: "10" },
							{ label: "25 / page", value: "25" },
							{ label: "50 / page", value: "50" },
							{ label: "100 / page", value: "100" },
						]}
						onOptionChange={(pageSize) =>
							setPagination((prev) => ({ ...prev, pageSize: Number(pageSize) }))
						}
					/>
					<FilterDropdown>
						<div className="flex flex-col gap-2">
							<label htmlFor="deletedFilter" className="text-sm font-medium text-gray-700">
								Status
							</label>

							<select
								id="deletedFilter"
								value={deletedValue}
								onChange={(e) => {
									const value = e.target.value as DeletedFilter;

									setFilter((prev) => {
										const next = { ...prev };

										if (value === "active") {
											delete next.isDeleted;
										} else {
											next.isDeleted = true;
										}

										return next;
									});
								}}
								className="rounded-xs border border-slate-300 px-2 py-1 text-sm focus:outline-none focus-visible:ring-slate-300 focus-visible:ring-1">
								<option value="active">Active</option>
								<option value="deleted">Deleted</option>
							</select>
						</div>
					</FilterDropdown>
				</div>

				{/* Search */}
				<div className="flex items-center gap-2 w-full lg:w-auto">
					<label htmlFor="search" className="text-sm text-slate-600 whitespace-nowrap">
						Search
					</label>
					<input
						id="search"
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full lg:w-64 rounded-xs border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Table */}
			<DataTable
				columns={tableColumns}
				data={data}
				pagination={pagination}
				sorting={sorting}
				onPaginationChange={setPagination}
				onSortingChange={setSorting}
				isLoading={isLoading}
				totalDocuments={totalDocuments}
				filteredDocuments={filteredDocuments}
			/>

			{showCreateUpdateModal && (
				<IndustryModal
					closeModal={onModalClose}
					onSuccess={onCreateUpdateSuccess}
					selectedIndustryId={selectedIndustryId}
				/>
			)}

			{showDeleteConfirmationModal && (
				<ConfirmationModal
					onCloseButtonClick={handleNoConfirmationButton}
					onSubmitButtonClick={handleYesConfirmationButton}
					isSubmitting={isLoading}
				/>
			)}
		</div>
	);
}
