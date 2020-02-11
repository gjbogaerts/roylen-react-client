/*

React navigation 4...
*/
import React, { useState } from 'react';
import { View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { setNavigator, navigate } from './src/utils/navigationRef';
import { ThemeProvider, colors } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import UserLoginScreen from './src/screens/UserLoginScreen';
import UserSignupScreen from './src/screens/UserSignupScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import AdsListScreen from './src/screens/AdsListScreen';
import AdsDetailScreen from './src/screens/AdsDetailScreen';
import AdCreateScreen from './src/screens/AdCreateScreen';
import AdContactScreen from './src/screens/AdContactScreen';
import InfoScreen from './src/screens/InfoScreen';
import UserAuthControlScreen from './src/screens/UserAuthControlScreen';
import UserMessageScreen from './src/screens/UserMessageScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as AdProvider } from './src/context/AdContext';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { styles, colors as MyColor } from './src/styles/styles';

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

const AdDetailNavigator = createStackNavigator(
	{
		Ad: AdsDetailScreen,
		AdContact: AdContactScreen
	},
	{
		mode: 'modal',
		headerMode: 'none',
		navigationOptions: {
			headerStyle: {
				backgroundColor: MyColor.backgroundColor
			},
			headerTintColor: MyColor.color,
			headerTitleStyle: {
				fontFamily: 'dosis-bold',
				fontSize: 28,
				color: MyColor.color
			},
			headerBackTitle: 'Back to ads list',
			headerBackTitleStyle: {
				fontFamily: 'dosis',
				fontSize: 18,
				color: MyColor.color
			},
			headerTitle: 'Details'
		}
	}
);

const AdsNavigator = createStackNavigator(
	{
		AdsList: AdsListScreen,
		AdsDetail: AdDetailNavigator
	},
	{
		navigationOptions: {
			tabBarLabel: 'Ads List',
			tabBarIcon: ({ tintColor }) => {
				return <Ionicons name="ios-list" size={25} color={tintColor} />;
			}
		}
	}
);

const TabsNavigator = createBottomTabNavigator(
	{
		AdCreate: {
			screen: AdCreateScreen,
			navigationOptions: {
				tabBarLabel: 'Create new Ad',
				tabBarIcon: ({ tintColor }) => {
					return <Ionicons name="ios-add" size={25} color={tintColor} />;
				}
			}
		},
		AdsFlow: AdsNavigator,
		Profile: {
			screen: UserProfileScreen,
			navigationOptions: {
				tabBarLabel: 'Your Profile',
				tabBarIcon: ({ tintColor }) => {
					return <Ionicons name="ios-person" size={25} color={tintColor} />;
				}
			}
		},
		Messages: {
			screen: UserMessageScreen
		},

		Info: {
			screen: InfoScreen,
			navigationOptions: {
				tabBarLabel: 'About',
				tabBarIcon: ({ tintColor }) => {
					return (
						<Ionicons name="ios-information" size={35} color={tintColor} />
					);
				}
			}
		}
	},
	{
		initialRouteName: 'AdsFlow',
		defaultNavigationOptions: {
			tabBarOptions: {
				inactiveTintColor: MyColor.backgroundColor,
				inactiveBackgroundColor: MyColor.color,
				activeTintColor: MyColor.color,
				activeBackgroundColor: MyColor.backgroundColor
			}
		}
	}
);

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
					<AdProvider>
						<MessageProvider>
							<AppContainer ref={navigator => setNavigator(navigator)} />
						</MessageProvider>
					</AdProvider>
				</AuthProvider>
			</View>
		</ThemeProvider>
	);
};
export default App;
