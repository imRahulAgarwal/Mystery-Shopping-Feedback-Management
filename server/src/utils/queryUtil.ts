import type { QueryFilter } from "mongoose";

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

		return { ...parsedFilter, isDeleted: false };
	} catch {
		return { isDeleted: false };
	}
}
