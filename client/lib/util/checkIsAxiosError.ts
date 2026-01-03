import axios from "axios";

export function checkIsAxiosError(error: unknown) {
	return axios.isAxiosError(error);
}
