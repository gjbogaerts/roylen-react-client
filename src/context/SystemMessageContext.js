import createDataContext from './createDataContext';

// const adReducer = (state, action) => {
// 	switch (action.type) {
// 		case 'getAllAds':

const systemMessageReducer = (state, action) => {
	console.log(state);
	console.log(action);
	switch (action.type) {
		case 'messageSet':
			return {
				...state,
				systemMessage: action.payload
			};
		case 'messageClear':
			return {
				...state,
				systemMessage: ''
			};
		default:
			return state;
	}
};

const setSystemMessage = dispatch => msg => {
	dispatch({ type: 'messageSet', payload: msg });
	// console.log(msg);
};

const clearSystemMessage = dispatch => () => {
	dispatch({
		type: 'messageClear',
		message: ''
	});
};

export const { Provider, Context } = createDataContext(
	systemMessageReducer,
	{
		setSystemMessage,
		clearSystemMessage
	},
	{ systemMessage: '' }
);
