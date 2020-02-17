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
		case 'markread':
			return {
				...state,
				countMessage: state.countMessage - 1,
				received: state.received.filter(msg => {
					return msg._id !== action.payload;
				})
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
	const userData = await AsyncStorage.getItem('userData');
	if (!userData) {
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
	} catch (err) {
		handleError(dispatch, 'Could not retrieve your messages');
	}
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

const markRead = dispatch => async messageId => {
	const response = await axios.post('/api/message/markRead', { messageId });
	if (response.status === 200) {
		dispatch({
			type: 'markread',
			payload: messageId
		});
	} else {
		handleError(dispatch, response.data);
	}
};

const sendToRoylen = dispatch => async (msg, email) => {
	try {
		const response = await axios.post('/api/message/contact', { msg, email });
		if (response.status === 200) {
			dispatch({
				type: 'messageSent'
			});
		} else {
			dispatch({
				type: 'error',
				payload: response.data
			});
		}
	} catch (err) {
		dispatch({
			type: 'error',
			payload: err
		});
	}
};

const handleError = (dispatch, errMsg) => {
	dispatch({
		type: 'error',
		payload: errMsg
	});
};
export const { Provider, Context } = createDataContext(
	messageReducer,
	{ sendMessage, readMessage, cleanUpMessage, markRead, sendToRoylen },
	{ message: null, errorMessage: '', countMessage: 0, received: [] }
);
