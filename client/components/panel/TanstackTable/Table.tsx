"use client";

import { getTableInfoText } from "@/lib/util/getTableInfo";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	PaginationState,
	SortingState,
	OnChangeFn,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { NextButton, PrevButton } from "../Buttons/Buttons";

type DataTableProps<T> = {
	columns: ColumnDef<T>[];
	data: T[];
	totalDocuments: number;
	filteredDocuments: number;
	pagination: PaginationState;
	sorting: SortingState;
	onPaginationChange: OnChangeFn<PaginationState>;
	onSortingChange: OnChangeFn<SortingState>;
	isLoading?: boolean;
};

export function DataTable<T>({
	columns,
	data,
	totalDocuments,
	filteredDocuments,
	pagination,
	sorting,
	onPaginationChange,
	onSortingChange,
	isLoading,
}: DataTableProps<T>) {
	const table = useReactTable({
		data,
		columns,
		pageCount: Math.ceil(filteredDocuments / pagination.pageSize),
		state: { pagination, sorting },
		manualPagination: true,
		manualSorting: true,
		onPaginationChange,
		onSortingChange,
		getCoreRowModel: getCoreRowModel(),
	});

	const totalPages = Math.ceil(filteredDocuments / pagination.pageSize);
	const currentPage = pagination.pageIndex + 1;

	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full text-sm">
				<thead className="hidden md:table-header-group bg-slate-50">
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id}>
							{hg.headers.map((header) => (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									className="px-4 py-3 text-left font-medium text-slate-700 cursor-pointer">
									<div className="flex items-center gap-1">
										{flexRender(header.column.columnDef.header, header.getContext())}
										<span className="ml-1">
											{header.column.getIsSorted() === "asc" ? (
												<ChevronUp size={16} />
											) : header.column.getIsSorted() === "desc" ? (
												<ChevronDown size={16} />
											) : (
												<ChevronsUpDown size={16} className="text-slate-400" />
											)}
										</span>
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody className="divide-y divide-slate-100">
					{isLoading ? (
						<tr>
							<td colSpan={columns.length} className="py-8 text-center">
								Loading...
							</td>
						</tr>
					) : data.length ? (
						table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="block md:table-row hover:bg-slate-50">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="block md:table-cell px-4 py-2">
										<span className="md:hidden text-xs text-slate-500 block mb-1">
											{cell.column.columnDef.header as string}
										</span>

										<span className="text-slate-800">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</span>
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length} className="py-8 text-center">
								No data found
							</td>
						</tr>
					)}
				</tbody>

				<tfoot>
					<tr>
						<td colSpan={columns.length}>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-slate-600">
										{getTableInfoText({
											totalDocuments,
											filteredDocuments,
											pageLimit: pagination.pageSize,
											pageNumber: pagination.pageIndex,
										})}
									</span>
								</div>

								<div className="flex items-center gap-2">
									{totalPages > 0 && (
										<span className="text-xs text-slate-500">
											Page {currentPage} of {totalPages}
										</span>
									)}

									<PrevButton
										isButtonDisabled={!table.getCanPreviousPage()}
										onButtonClick={() => table.previousPage()}
									/>

									<NextButton
										isButtonDisabled={!table.getCanNextPage()}
										onButtonClick={() => table.nextPage()}
									/>
								</div>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
