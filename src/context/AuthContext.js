import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import { navigate } from '../utils/navigationRef';
import axios from '../api/axios';
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

const updateProfileInfo = dispatch => async (email, profilePic) => {
	console.log(`Email: ${email}`);
	console.log(`ProfilePic: ${JSON.stringify(profilePic)}`);
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
