import { AsyncStorage, Platform } from 'react-native';
import createDataContext from './createDataContext';
import { navigate } from '../utils/navigationRef';
import axios from '../api/axios';
import FormData from 'form-data';
import User from '../models/User';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'error':
			return {
				...state,
				errorMessage: action.payload
			};
		case 'auth':
			return {
				...state,
				token: action.payload,
				errorMessage: ''
			};
		case 'sign_out':
			return {
				...state,
				token: null,
				errorMessage: ''
			};
		case 'update':
			return {
				...state,
				errorMessage: '',
				token: action.payload
			};
		case 'clear_error_message':
			return {
				...state,
				errorMessage: ''
			};
		default:
			return state;
	}
};

const clearErrorMessage = dispatch => () => {
	dispatch({ type: 'clear_error_message' });
};

const signin = dispatch => async ({ email, password }) => {
	try {
		const response = await axios.post('/api/signin', {
			email,
			password
		});
		const user = new User(
			response.data._id,
			response.data.token,
			response.data.screenName,
			response.data.email,
			response.data.nix
		);
		await AsyncStorage.setItem('userData', JSON.stringify(user));
		dispatch({
			type: 'auth',
			payload: response.data.token
		});
		navigate('Tabs');
	} catch (err) {
		dispatch({
			type: 'error',
			payload: 'Cannot log in, something went wrong'
		});
	}
};

const updateProfileInfo = dispatch => async (email, profilePic) => {
	const tmpUri = profilePic.uri;
	const uriParts = tmpUri.split('/');
	const fileName = uriParts[uriParts.length - 1];
	const data = new FormData();
	data.append('file', {
		name: fileName,
		uri: Platform.OS === 'android' ? tmpUri : tmpUri.replace('file://', '')
	});
	data.append('email', email);
	try {
		const response = await axios.post('/api/profile', data, {
			headers: {
				...axios.headers,
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			}
		});
		if (response.data.success) {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			u.email = email;
			u.avatar = response.data.avatar;
			await AsyncStorage.setItem('userData', JSON.stringify(u));
			dispatch({
				type: 'update',
				payload: u.token
			});
			navigate('Profile');
		}
	} catch (e) {
		dispatch({
			type: 'error',
			payload: 'Cannot update your profile, something went wrong'
		});
	}
};

const signup = dispatch => {
	return async ({ email, password, screenName }) => {
		try {
			const response = await axios.post('/api/signup', {
				email,
				password,
				screenName
			});
			const user = new User(
				response.data._id,
				response.data.token,
				response.data.screenName,
				response.data.email,
				response.data.nix
			);
			await AsyncStorage.setItem('userData', JSON.stringify(user));
			dispatch({
				type: 'auth',
				payload: response.data.token
			});
			navigate('Tabs');
		} catch (err) {
			dispatch({
				type: 'error',
				payload: `${err} Cannot sign up, something went wrong`
			});
		}
	};
};

const tryLocalSignin = dispatch => async () => {
	const userData = await AsyncStorage.getItem('userData');
	if (userData) {
		const userJson = JSON.parse(userData);
		dispatch({
			type: 'signup',
			payload: userJson.token
		});
		navigate('Tabs');
	} else {
		navigate('Auth');
	}
};

const signout = dispatch => async () => {
	await AsyncStorage.removeItem('userData');
	dispatch({
		type: 'sign_out'
	});
	navigate('Auth');
};

export const { Provider, Context } = createDataContext(
	authReducer,
	{
		signup,
		clearErrorMessage,
		signout,
		signin,
		tryLocalSignin,
		updateProfileInfo
	},
	{ token: null, errorMessage: '' }
);
