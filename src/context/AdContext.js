import createDataContext from './createDataContext';
import { navigate } from '../utils/navigationRef';
import axios from '../api/axios';

const adReducer = (state, action) => {
	switch (action.type) {
		case 'getAllAds':
			return {
				...state,
				adList: action.payload,
				currentAd: null,
				errorMessage: ''
			};
		case 'getAd':
			return {
				...state,
				currentAd: action.payload,
				errorMessage: ''
			};

		case 'error':
			return {
				...state,
				errorMessage: action.payload
			};
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
	} catch (err) {
		dispatch({
			type: 'error',
			payload: 'Could not retrieve ads'
		});
	}
};

const getAd = dispatch => async (adId, adTitle) => {
	try {
		const response = await axios.get(`/api/ads/${adId}`);
		dispatch({
			type: 'getAd',
			payload: response.data
		});
		navigate('AdsDetail', { id: adId, title: adTitle });
	} catch (err) {
		dispatch({
			type: 'error',
			payload: 'Could not retrieve ad'
		});
	}
};

export const { Provider, Context } = createDataContext(
	adReducer,
	{ getAllAds, getAd },
	{ adList: null, currentAd: null, errorMessage: '' }
);
