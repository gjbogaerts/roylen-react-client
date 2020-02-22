/* eslint-disable react/display-name */
import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import UserLoginScreen from '../screens/UserLoginScreen';
import UserSignupScreen from '../screens/UserSignupScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AdsListScreen from '../screens/AdsListScreen';
import AdsDetailScreen from '../screens/AdsDetailScreen';
import AdCreateScreen from '../screens/AdCreateScreen';
import AdContactScreen from '../screens/AdContactScreen';
import InfoScreen from '../screens/InfoScreen';
import UserMessageScreen from '../screens/UserMessageScreen';
import UserResetPasswordScreen from '../screens/UserResetPasswordScreen';
import { Context as MessageContext } from '../context/MessageContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/styles';
import useAuthInfo from '../hooks/useAuthInfo';

const AdDetailStack = createStackNavigator();
const AdListStack = createStackNavigator();
const AuthStack = createStackNavigator();
const TabsStack = createBottomTabNavigator();

const AdDetailComponent = () => {
	return (
		<AdDetailStack.Navigator headerMode="none">
			<AdDetailStack.Screen name="Ad" component={AdsDetailScreen} />
			<AdDetailStack.Screen
				name="AdContact"
				component={AdContactScreen}
				options={{ headerShown: false }}
			/>
		</AdDetailStack.Navigator>
	);
};

const AdListComponent = () => {
	return (
		<AdListStack.Navigator headerMode="screen">
			<AdListStack.Screen
				name="AdsList"
				component={AdsListScreen}
				options={{
					headerShown: false
				}}
			/>
			<AdListStack.Screen
				name="AdsDetail"
				component={AdDetailComponent}
				options={{
					title: 'Details',
					headerStyle: { backgroundColor: colors.color },
					headerTintColor: colors.backgroundColor,
					headerBackTitle: 'Back to all ads',
					headerTitleStyle: {
						fontFamily: 'dosis-bold',
						fontSize: 28
					},
					headerBackTitleStyle: {
						fontFamily: 'dosis-regular',
						fontSize: 14
					}
				}}
			/>
		</AdListStack.Navigator>
	);
};

const TabComponent = ({ navigation }) => {
	const msgContext = useContext(MessageContext);
	useEffect(() => {
		const getMessageCount = async () => {
			await msgContext.readMessage();
		};
		getMessageCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const user = useAuthInfo(navigation, '');

	return (
		<TabsStack.Navigator
			initialRouteName="AdsFlow"
			tabBarOptions={{
				inactiveTintColor: colors.backgroundColor,
				inactiveBackgroundColor: colors.color,
				activeTintColor: colors.color,
				activeBackgroundColor: colors.backgroundColor,
				labelStyle: {
					fontFamily: 'dosis',
					fontSize: 14
				}
			}}
		>
			<TabsStack.Screen
				name="AdCreate"
				component={AdCreateScreen}
				options={{
					title: 'New Ad',
					tabBarIcon: ({ focused }) => {
						let c = focused ? colors.color : colors.backgroundColor;
						return <Ionicons name="ios-add" size={25} color={c} />;
					}
				}}
			/>
			<TabsStack.Screen
				name="AdsFlow"
				component={AdListComponent}
				options={{
					title: 'Ads List',
					tabBarIcon: ({ focused }) => {
						let c = focused ? colors.color : colors.backgroundColor;
						return <Ionicons name="ios-list" size={25} color={c} />;
					}
				}}
			/>
			{user ? (
				<TabsStack.Screen
					name="Profile"
					component={UserProfileScreen}
					options={{
						title: 'Profile',
						tabBarIcon: ({ focused }) => {
							let c = focused ? colors.color : colors.backgroundColor;
							return <Ionicons name="ios-person" size={25} color={c} />;
						}
					}}
				/>
			) : (
				<TabsStack.Screen
					name="Auth"
					component={AuthComponent}
					options={{
						title: 'Log in',
						tabBarIcon: ({ focused }) => {
							let c = focused ? colors.color : colors.backgroundColor;
							return <Ionicons name="ios-person" size={25} color={c} />;
						}
					}}
				/>
			)}
			{user ? (
				<TabsStack.Screen
					name="Messages"
					component={UserMessageScreen}
					options={{
						title: 'Messages',
						tabBarIcon: ({ focused }) => {
							let c = focused ? colors.color : colors.backgroundColor;
							const badgeCount = msgContext.state.countMessage;
							// console.log(badgeCount);
							return (
								<View>
									<Ionicons name="ios-mail" size={25} color={c} />
									{badgeCount > 0 && (
										<View
											style={{
												position: 'absolute',
												right: -6,
												top: -3,
												backgroundColor: 'red',
												borderRadius: 7,
												width: 14,
												height: 14,
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<Text
												style={{
													color: 'white',
													fontSize: 10,
													fontWeight: 'bold'
												}}
											>
												{badgeCount}
											</Text>
										</View>
									)}
								</View>
							);
						}
					}}
				/>
			) : null}
			<TabsStack.Screen
				name="Info"
				component={InfoScreen}
				options={{
					title: 'About',
					tabBarIcon: ({ focused }) => {
						let c = focused ? colors.color : colors.backgroundColor;
						return <Ionicons name="ios-information" size={25} color={c} />;
					}
				}}
			/>
		</TabsStack.Navigator>
	);
};

const AuthComponent = () => {
	return (
		<AuthStack.Navigator headerMode="none">
			<AuthStack.Screen name="Login" component={UserLoginScreen} />
			<AuthStack.Screen name="Signup" component={UserSignupScreen} />
			<AuthStack.Screen
				name="ResetPassword"
				component={UserResetPasswordScreen}
			/>
		</AuthStack.Navigator>
	);
};

const AppNavigator = createStackNavigator();

const AppContainer = () => {
	/* 	const authContext = useContext(AuthContext);

	useEffect(() => {
		const localSignIn = async () => {
			await authContext.tryLocalSignin();
		};
		localSignIn();
	}, [authContext]); */

	return (
		<AppNavigator.Navigator initialRouteName="Tabs" headerMode="none">
			{/* {authContext.state.token ? ( */}
			<AppNavigator.Screen name="Tabs" component={TabComponent} />
			{/* ) : ( */}
			{/* <AppNavigator.Screen name="Auth" component={AuthComponent} /> */}
			{/* )} */}
		</AppNavigator.Navigator>
	);
};
export default AppContainer;
