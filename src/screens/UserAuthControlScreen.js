import { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as MessageContext } from '../context/MessageContext';

const UserAuthControlScreen = props => {
	const { tryLocalSignin } = useContext(AuthContext);
	const msgState = useContext(MessageContext);
	// console.log(msgState);
	useEffect(() => {
		tryLocalSignin(msgState);
	}, []);
	return null;
};

export default UserAuthControlScreen;
