import createDataContext from './createDataContext';
import { navigate } from '../utils/navigationRef';
import axios from '../api/axios';

const adReducer = (state, action) => {
	switch (action.type) {
		case 'getAllAds': {
			return {
				...state,
				adList: action.payload,
				currentAdd: null,
				errorMessage: ''
			};
		}
		default:
			return state;
	}
};

const getAllAds = dispatch => async () => {
	try {
		const response = await axios.get('/api/ads');
		dispatch({
			type: 'getAllAds',
			payload: response.data
		});
	} catch (err) {}
};

export const { Provider, Context } = createDataContext(
	adReducer,
	{ getAllAds },
	{ adList: null, currentAdd: null, errorMessage: '' }
);
