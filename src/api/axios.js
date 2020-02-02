import axios from 'axios';
import { AsyncStorage } from 'react-native';

let baseUrl = null;
if (__DEV__) {
	baseUrl = 'http://localhost:3000';
} else {
	baseUrl = 'https://api.roylen.ga';
}

const instance = axios.create({
	baseURL: baseUrl
});

export const getBaseUrl = () => {
	return baseUrl;
};

instance.interceptors.request.use(
	async config => {
		const userData = await AsyncStorage.getItem('userData');
		if (userData) {
			const userObj = JSON.parse(userData);
			const token = userObj.token;
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	err => {
		console.log(err);
		return Promise.reject(err);
	}
);

export default instance;
