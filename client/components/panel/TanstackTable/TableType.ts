export type TableQuery = {
	pageIndex: number;
	pageSize: number;
	sorting?: {
		id: string;
		desc: boolean;
	}[];
	search?: string;
};

export type TableResponse<T> = {
	data: T[];
	totalDocuments: number;
	filteredDocuments: number;
};
