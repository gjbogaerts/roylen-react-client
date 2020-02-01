import React, { useState } from 'react';

import { View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { setNavigator } from './src/utils/navigationRef';
import { ThemeProvider } from 'react-native-elements';
import UserLoginScreen from './src/screens/UserLoginScreen';
import UserSignupScreen from './src/screens/UserSignupScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import AdsListScreen from './src/screens/AdsListScreen';
import AdsDetailScreen from './src/screens/AdsDetailScreen';
import AdCreateScreen from './src/screens/AdCreateScreen';
import InfoScreen from './src/screens/InfoScreen';
import UserAuthControlScreen from './src/screens/UserAuthControlScreen';

import { Provider as AuthProvider } from './src/context/AuthContext';

import { styles } from './src/styles/styles';

const fetchFonts = () => {
	return Font.loadAsync({
		dosis: require('./assets/fonts/Dosis-Medium.otf'),
		'dosis-bold': require('./assets/fonts/Dosis-Bold.otf'),
		'dosis-regular': require('./assets/fonts/Dosis-Regular.otf')
	});
};

const AuthNavigator = createStackNavigator(
	{
		Login: UserLoginScreen,
		Signup: UserSignupScreen
	},
	{
		initialRouteName: 'Login'
	}
);

const AdsNavigator = createStackNavigator({
	AdsList: AdsListScreen,
	AdsDetail: AdsDetailScreen
});

const TabsNavigator = createBottomTabNavigator({
	AdCreate: AdCreateScreen,
	AdsFlow: AdsNavigator,
	Profile: UserProfileScreen,
	Info: InfoScreen
});

const MainNavigator = createSwitchNavigator(
	{
		AuthControl: UserAuthControlScreen,
		Auth: AuthNavigator,
		Tabs: TabsNavigator
	},
	{
		initialRouteName: 'AuthControl'
	}
);

const AppContainer = createAppContainer(MainNavigator);

const App = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	if (!fontsLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => setFontsLoaded(true)}
			/>
		);
	}
	return (
		<ThemeProvider theme={styles}>
			<View style={styles.container}>
				<AuthProvider>
					<AppContainer ref={navigator => setNavigator(navigator)} />
				</AuthProvider>
			</View>
		</ThemeProvider>
	);
};
export default App;
