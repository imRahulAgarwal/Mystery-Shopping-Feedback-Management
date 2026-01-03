type TableInfoParams = {
	totalDocuments: number;
	filteredDocuments: number;
	pageNumber: number;
	pageLimit: number;
};

export function getTableInfoText({
	totalDocuments,
	filteredDocuments,
	pageNumber,
	pageLimit,
}: TableInfoParams): string {
	if (totalDocuments === 0) {
		return "Showing 0 to 0 of 0 entries";
	}

	if (filteredDocuments === 0) {
		return `Showing 0 to 0 of 0 entries (filtered from ${totalDocuments} total entries)`;
	}

	const start = pageNumber * pageLimit + 1;
	const end = Math.min(start + pageLimit - 1, filteredDocuments);

	if (start > filteredDocuments) {
		return `Showing 0 to 0 of ${filteredDocuments} entries`;
	}

	const isFiltered = filteredDocuments !== totalDocuments;

	return isFiltered
		? `Showing ${start} to ${end} of ${filteredDocuments} entries (filtered from ${totalDocuments} total entries)`
		: `Showing ${start} to ${end} of ${filteredDocuments} entries`;
}
