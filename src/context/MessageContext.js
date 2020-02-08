import createDataContext from './createDataContext';
import { navigate } from '../utils/navigationRef';
import axios from '../api/axios';

const messageReducer = (state, action) => {
	switch (action.type) {
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
		default:
			return state;
	}
};

const readMessage = dispatch => async () => {};

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

	console.log(msg);
};

const handleError = (dispatch, errMsg) => {
	dispatch({
		type: 'error',
		payload: errMsg
	});
};
export const { Provider, Context } = createDataContext(
	messageReducer,
	{ sendMessage, readMessage },
	{ message: null, errorMessage: '' }
);
