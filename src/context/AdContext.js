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
		case 'placeAd':
			return {
				...state,
				adList: [],
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

const placeAd = dispatch => async adObj => {
	// console.log(adObj);
	const tmpUri = adObj.picture.uri;
	const uriParts = tmpUri.split('/');
	const fileName = uriParts[uriParts.length - 1];
	const data = new FormData();

	data.append('file', {
		name: fileName,
		uri: Platform.OS === 'android' ? tmpUri : tmpUri.replace('file://', '')
	});
	const { title, description, virtualPrice, category, creator } = adObj;
	data.append('title', title);
	data.append('description', description);
	data.append('virtualPrice', virtualPrice);
	data.append('category', category);
	data.append('creator', creator);

	try {
		await axios.post('/api/adCreate', data, {
			headers: {
				...axios.headers,
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			}
		});
		const response = await axios.get('/api/ads');
		dispatch({
			type: 'getAllAds',
			payload: response.data
		});
		navigate('AdsList');
	} catch (err) {
		console.log(err);
	}
};

export const { Provider, Context } = createDataContext(
	adReducer,
	{ getAllAds, getAd, placeAd },
	{ adList: null, currentAd: null, errorMessage: '' }
);
