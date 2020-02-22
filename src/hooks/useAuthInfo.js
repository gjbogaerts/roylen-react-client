import { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';

const useAuthInfo = () => {
	const { state, tryLocalSignin } = useContext(AuthContext);
	useEffect(() => {
		tryLocalSignin();
	}, [tryLocalSignin]);
	return state.user;
};

export default useAuthInfo;
