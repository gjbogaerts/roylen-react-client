import { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';

const UserAuthControlScreen = props => {
	const { tryLocalSignin } = useContext(AuthContext);

	useEffect(() => {
		tryLocalSignin();
	}, []);
	return null;
};

export default UserAuthControlScreen;
