import type { QueryFilter } from "mongoose";

type TSortQueryFunction = (sort: string | undefined, order: 1 | -1, sortableFields: string[]) => Record<string, 1 | -1>;

type TSearchQueryFunction = (
	search: string,
	searchableFields: string[],
	filter: QueryFilter<string>
) => QueryFilter<string>;

export function getValidPageNo(page: any): number {
	let pageNo = parseInt(page, 10);
	if (isNaN(pageNo) || pageNo < 1) {
		pageNo = 1;
	}
	return pageNo;
}

export function getValidPageLimit(limit: any): number {
	let pageLimit = parseInt(limit, 10) || 10;
	if (isNaN(pageLimit) || pageLimit < 10) {
		pageLimit = 10;
	}
	return pageLimit;
}

export function getValidSearch(search: any): string {
	let searchValue = search ? String(search).trim() : "";
	return searchValue;
}

export function getValidSortOrder(order: any): number {
	let sortOrder = String(order).trim().toLowerCase() || "asc";
	return sortOrder === "asc" ? 1 : -1;
}

export function getValidFilter(filter: any): QueryFilter<unknown> {
	if (!filter) {
		return { isDeleted: false };
	}

	try {
		const parsedFilter = typeof filter === "string" ? JSON.parse(filter) : filter;

		if (typeof parsedFilter !== "object" || parsedFilter === null || Array.isArray(parsedFilter)) {
			return { isDeleted: false };
		}

		const filters: Record<string, unknown> = { isDeleted: false, ...parsedFilter };
		return filters;
	} catch {
		return { isDeleted: false };
	}
}

export const getSortQuery: TSortQueryFunction = (sort, order = 1, sortableFields) => {
	if (!sort || !sortableFields.includes(sort)) return { createdAt: 1 };
	return { [sort]: order };
};

export const getSearchQuery: TSearchQueryFunction = (search, searchableFields, filter) => {
	const searchQuery = { ...filter };
	if (search) {
		searchQuery.$or = searchableFields.map((field) => ({ [field]: { $regex: search, $options: "i" } }));
	}

	return searchQuery;
};
