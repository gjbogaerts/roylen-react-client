import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Context as MessageContext } from '../context/MessageContext';
import { styles, colors } from '../styles/styles';

const UserMessageScreen = props => {
	const { countMessage } = useContext(MessageContext);
	// props.navigation.setParams({ countMsg: countMessage });
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<Text>UserMessageScreen with {countMessage} messages</Text>
			</View>
		</View>
	);
};

UserMessageScreen.navigationOptions = nav => {
	// const count = nav.navigation.getParam('countMsg');
	// console.log(nav.navigation);
	return {
		tabBarLabel: 'Messages',
		tabBarIcon: ({ tintColor }) => {
			return (
				<View>
					<View
						style={{
							// On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
							position: 'absolute',
							right: -6,
							top: -3,
							backgroundColor: 'red',
							borderRadius: 6,
							width: 12,
							height: 12,
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 1000
						}}
					>
						<Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
							5
						</Text>
					</View>
					<Ionicons name="ios-mail" size={25} color={tintColor} />
				</View>
			);
		}
	};
};

export default UserMessageScreen;
