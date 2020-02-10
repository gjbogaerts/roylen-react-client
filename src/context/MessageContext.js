import createDataContext from './createDataContext';
import { navigate } from '../routes/RootNavigation';
import axios from '../api/axios';
import { AsyncStorage } from 'react-native';

const messageReducer = (state, action) => {
	// console.log(action.payload);
	switch (action.type) {
		case 'readMessage':
			return {
				...state,
				received: action.payload,
				countMessage: action.payload.length
			};

		case 'messageSent':
			return {
				...state,
				errorMessage: '',
				message: 'Your message was succesfully sent'
			};
		case 'error':
			return {
				...state,
				message: null,
				errorMessage: action.payload
			};
		case 'cleanup':
			return {
				...state,
				message: null,
				errorMessage: ''
			};
		default:
			return state;
	}
};

const readMessage = dispatch => async () => {
	// console.log('called readMessage');
	const userData = await AsyncStorage.getItem('userData');
	if (!userData) {
		// console.log('no userdata');
		return;
	}
	const user = JSON.parse(userData);
	// console.log(user);
	try {
		const response = await axios.get(`/api/message/${user._id}`);
		// console.log(response.data);
		dispatch({
			type: 'readMessage',
			payload: response.data
		});
		// console.log(response.data);
	} catch (err) {
		handleError(dispatch, 'Could not retrieve your messages');
	}
	// console.log('start message count');
};

const sendMessage = dispatch => async msg => {
	try {
		const response = await axios.post('/api/message', msg);
		if (response.status === 200) {
			dispatch({
				type: 'messageSent',
				payload: 1
			});
		} else {
			handleError(dispatch, response.data.error);
		}
	} catch (err) {
		handleError(dispatch, err.message);
	}
};

const cleanUpMessage = dispatch => () => {
	dispatch({
		type: 'cleanup'
	});
};

const handleError = (dispatch, errMsg) => {
	dispatch({
		type: 'error',
		payload: errMsg
	});
};
export const { Provider, Context } = createDataContext(
	messageReducer,
	{ sendMessage, readMessage, cleanUpMessage },
	{ message: null, errorMessage: '', countMessage: 0, received: [] }
);
