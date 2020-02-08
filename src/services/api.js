import axios from "axios";
import * as authService from './auth';
import { SERVER_URL } from "../constants";

const api = axios.create({
	baseURL: SERVER_URL,
});

api.interceptors.request.use(async config => {
	const token = authService.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
