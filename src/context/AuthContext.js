import { AsyncStorage, Platform } from 'react-native';
import createDataContext from './createDataContext';
import { navigate } from '../routes/RootNavigation';
import axios from '../api/axios';
import FormData from 'form-data';
import User from '../models/User';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'error':
			return {
				...state,
				errorMessage: action.payload,
				error: true
			};
		case 'auth':
			return {
				...state,
				flashMessage: 'You are successfully signed in',
				token: action.payload,
				errorMessage: '',
				error: false
			};
		case 'sign_out':
			return {
				...state,
				flashMessage: 'You have signed out',
				token: null,
				errorMessage: '',
				error: false
			};
		case 'update':
			return {
				...state,
				flashMessage: 'Your profile has been updated',
				errorMessage: '',
				token: action.payload,
				error: false
			};
		case 'clear_error_message':
			return {
				...state,
				errorMessage: '',
				error: false
			};
		default:
			return state;
	}
};

const clearErrorMessage = dispatch => () => {
	dispatch({ type: 'clear_error_message' });
};

const signin = dispatch => async ({ email, password }, msgCallback) => {
	msgCallback();
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
			response.data.nix,
			response.data.avatar
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
			navigate('Tabs', { flashMessage: 'Your profile has been updated' });
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
			type: 'auth',
			payload: userJson.token
		});
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
	{ token: null, error: false, errorMessage: '' }
);
