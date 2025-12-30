import type { QueryFilter } from "mongoose";

type TSortQueryFunction = (sort: string | undefined, order: 1 | -1, sortableFields: string[]) => Record<string, 1 | -1>;

type TSearchQueryFunction = (
	search: string,
	searchableFields: string[],
	filter: QueryFilter<string>
) => QueryFilter<string>;

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
