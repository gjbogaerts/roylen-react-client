import createDataContext from './createDataContext';
import { navigate } from '../routes/RootNavigation';
import axios from '../api/axios';
import { Platform } from 'react-native';

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
    case 'getUserAds':
      return {
        ...state,
        message: '',
        userAds: action.payload
      };
    case 'deleteAd':
      return {
        ...state,
        message: 'Your ad has been deleted',
        userAds: state.userAds.filter(ad => ad._id !== action.payload),
        adList: state.adList.filter(ad => ad._id !== action.payload)
      };
    case 'error':
      return {
        ...state,
        message: '',
        errorMessage: action.payload
      };
    case 'warning':
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
};

const sendWarning = dispatch => async adId => {
  try {
    const response = await axios.post('/api/ads/warning', { adId });
    if (response.data === 'OK') {
      dispatch({
        type: 'warning',
        payload:
          'Thank you for your interest in keeping Roylen safe and clean. We will look into your complaint and take any necessary action.'
      });
    } else {
      dispatch({
        type: 'error',
        payload:
          'Something went wrong sending your message. Could you please try again later?'
      });
    }
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.message
    });
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
      payload: err.errorMessage
    });
  }
};

const getSpecAds = dispatch => async (q, inCat) => {
  try {
    let response;
    if (inCat) {
      const { Value } = q;
      response = await axios.get(`/api/ads/c/${Value}`);
    } else {
      response = await axios.get(`/api/ads/q/${q}`);
    }
    dispatch({
      type: 'getAllAds',
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.errorMessage
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
      payload: err.errorMessage
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
  const {
    title,
    description,
    virtualPrice,
    category,
    creator,
    wanted,
    location
  } = adObj;
  data.append('title', title);
  data.append('description', description);
  data.append('virtualPrice', virtualPrice);
  data.append('category', category);
  data.append('creator', creator);
  data.append('longitude', location.longitude);
  data.append('latitude', location.latitude);
  if (wanted) {
    data.append('adNature', 'wanted');
  } else {
    data.append('adNature', 'offered');
  }
  try {
    await axios.post('/api/adCreate', data, {
      headers: {
        ...axios.headers,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    });
    //TODO: refactor to update state with new ad, instead of having to pick them up from server again.
    const response = await axios.get('/api/ads');
    dispatch({
      type: 'getAllAds',
      payload: response.data
    });
    navigate('AdsList');
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.errorMessage
    });
  }
};

const deleteAd = dispatch => async (itemId, userId) => {
  try {
    const response = await axios.delete('/api/ads', {
      data: {
        id: itemId,
        creator: userId
      }
    });
    if (response.data == 1) {
      dispatch({
        type: 'deleteAd',
        payload: itemId
      });
    } else {
      dispatch({
        type: 'error',
        payload: 'Unable to delete this ad'
      });
    }
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.errorMessage
    });
  }
};

const getUserAds = dispatch => async userId => {
  try {
    const response = await axios.get(`/api/ads/fromUser/${userId}`);
    dispatch({
      type: 'getUserAds',
      payload: response.data
    });
    return response.data;
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.errorMessage
    });
  }
};

const getDistanceAds = dispatch => async (dist, location) => {
  const { longitude, latitude } = location.coords;
  console.log(dist, longitude, latitude);

  try {
    const response = await axios.post(`api/ads/withDistance`, {
      dist,
      longitude,
      latitude
    });
    console.log(response.data);
    dispatch({
      type: 'getAllAds',
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: 'error',
      payload: err.errorMessage
    });
  }
};

export const { Provider, Context } = createDataContext(
  adReducer,
  {
    getAllAds,
    getAd,
    placeAd,
    getSpecAds,
    deleteAd,
    getUserAds,
    getDistanceAds,
    sendWarning
  },
  {
    adList: null,
    currentAd: null,
    errorMessage: '',
    userAds: null,
    message: ''
  }
);
