import { IndustryData } from "@/components/panel/Modal/IndustryModal/industrySchema";
import { apiUrl } from "@/constants";
import axios from "axios";

export async function readIndustries(params: Record<string, string | number | undefined>) {
	const query = new URLSearchParams(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, String(value)])
	).toString();
	const url = `${apiUrl}/panel/api/v1/industries?${query}`;
	const response = await axios.get(url, {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}

export async function readIndustry(industryId: string) {
	const url = `${apiUrl}/panel/api/v1/industries/${industryId}`;
	const response = await axios.get(url, {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}

export async function createIndustry(data: IndustryData) {
	const url = `${apiUrl}/panel/api/v1/industries`;
	const response = await axios.post(url, JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}

export async function updateIndustry(industryId: string, data: IndustryData) {
	const url = `${apiUrl}/panel/api/v1/industries/${industryId}`;
	const response = await axios.put(url, JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}

export async function deleteIndustry(industryId: string) {
	const url = `${apiUrl}/panel/api/v1/industries/${industryId}`;
	const response = await axios.delete(url, {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}

export async function restoreIndustry(industryId: string) {
	const url = `${apiUrl}/panel/api/v1/industries/${industryId}`;
	const response = await axios.patch(url, {
		headers: { "Content-Type": "application/json" },
	});

	const responseData = response.data;
	return responseData;
}
