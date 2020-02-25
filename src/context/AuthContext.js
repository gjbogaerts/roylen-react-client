import { AsyncStorage, Platform } from 'react-native';
import createDataContext from './createDataContext';
import { navigate } from '../routes/RootNavigation';
import axios from '../api/axios';
import FormData from 'form-data';
import User from '../models/User';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'isUnique': {
      return {
        ...state,
        isUnique: { ...state.isUnique, ...action.payload }
      };
    }
    case 'error':
      return {
        ...state,
        errorMessage: action.payload,
        flashMessage: '',
        error: true
      };
    case 'auth':
      return {
        ...state,
        flashMessage: 'You are successfully signed in',
        token: action.payload.token,
        user: action.payload.user,
        errorMessage: '',
        error: false
      };
    case 'passwordReset': {
      return {
        ...state,
        flashMessage: action.payload,
        token: null,
        errorMessage: '',
        error: false
      };
    }
    case 'resetSend':
      return {
        ...state,
        error: false,
        flashMessage: action.payload,
        token: null,
        errorMessage: ''
      };
    case 'sign_out':
      return {
        ...state,
        flashMessage: 'You have signed out',
        token: null,
        errorMessage: '',
        error: false,
        user: null
      };
    case 'update':
      return {
        ...state,
        flashMessage: 'Your profile has been updated',
        errorMessage: '',
        token: action.payload.token,
        user: action.payload.user,
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

const resetPassword = dispatch => async (key, pw) => {
  let response = null;
  try {
    response = await axios.post('/api/conformResetPassword', { key, pw });
    if (response.data.success) {
      // console.log(response.data.doc);
      dispatch({
        type: 'passwordReset',
        payload: response.data.msg
      });
      navigate('Login');
    } else {
      dispatch({
        type: 'error',
        payload: response.data.error
      });
    }
  } catch (err) {
    dispatch({ type: 'error', payload: response.data.error });
  }
};

const sendResetPasswordEmail = dispatch => async email => {
  try {
    const response = await axios.post('/api/resetPassword', { email });
    if (response.data.success) {
      // console.log('yes!');
      dispatch({
        type: 'resetSend',
        payload: response.data.msg
      });
    } else {
      dispatch({
        type: 'error',
        payload: response.data.error
      });
    }
    // console.log(response.data);
  } catch (e) {
    dispatch({
      type: 'error',
      payload: e.errorMessage
    });
  }
  // console.log(email);
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
      payload: { token: response.data.token, user: user }
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
        payload: { token: u.token, user: u }
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
        payload: { token: response.data.token, user: user }
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
      payload: { token: userJson.token, user: userJson }
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

const checkUniqueScreenName = dispatch => async name => {
  try {
    const response = await axios.get(`/api/checkScreenName/${name}`);
    // console.log(response.data.numUsers == 0);
    dispatch({
      type: 'isUnique',
      payload: { screenName: response.data.numUsers === 0 }
    });
  } catch (err) {
    dispatch({
      type: 'isUnique',
      payload: false
    });
  }
};

const checkUniqueEmail = dispatch => async email => {
  try {
    const response = await axios.get(`api/checkEmail/${email}`);
    dispatch({
      type: 'isUnique',
      payload: { email: response.data.numUsers === 0 }
    });
  } catch (err) {
    dispatch({
      type: 'isUnique',
      payload: false
    });
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup,
    clearErrorMessage,
    signout,
    signin,
    tryLocalSignin,
    updateProfileInfo,
    sendResetPasswordEmail,
    resetPassword,
    checkUniqueEmail,
    checkUniqueScreenName
  },
  {
    token: null,
    error: false,
    errorMessage: '',
    flashMessage: '',
    user: null,
    isUnique: { email: null, screenName: null }
  }
);
