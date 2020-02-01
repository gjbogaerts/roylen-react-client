import axios from 'axios';
import { AsyncStorage } from 'react-native';

//while developing, changes every 8 hours:
const baseUrl = 'https://api.roylen.ga';

const instance = axios.create({
	baseURL: baseUrl
});

//TODO: update profile screen, set actions to change screenname, email

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
