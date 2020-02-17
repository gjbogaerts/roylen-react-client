import { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';

const useAuthInfo = () => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const getUserInfo = async () => {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			setUser(u);
		};
		getUserInfo();
	}, []);
	return user;
};

export default useAuthInfo;
