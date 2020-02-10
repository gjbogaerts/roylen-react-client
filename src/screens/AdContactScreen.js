import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text, Card, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, styles } from '../styles/styles';
import { Context as MessageContext } from '../context/MessageContext';
import Message from '../models/Message';
import Spacer from '../components/UI/Spacer';

const AdContactScreen = ({ route, navigation }) => {
	// console.log(route.params.concerning);
	// const currentAd = navigation.getParam('concerning');

	const currentAd = route.params.concerning;
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const [user, setUser] = useState(null);
	const { state, sendMessage, cleanUpMessage } = useContext(MessageContext);

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			setUser(u);
		};

		fetchUserData();
	}, []);

	useFocusEffect(
		useCallback(() => {
			// do something when the screen is focused
			return () => {
				//do something when the screen is unfocused.
				cleanUpMessage();
			};
		}, [])
	);
	// console.log(state);

	if (state.message) {
		return (
			<View style={styles.contentContainer}>
				<View style={styles.cardContainer}>
					<Card title={`Contact ${currentAd.creator.screenName}`}>
						<Text>{state.message} </Text>
					</Card>
				</View>
			</View>
		);
	}

	const startSendSequence = () => {
		const msg = new Message(
			name,
			message,
			user._id,
			currentAd.creator._id,
			currentAd._id,
			currentAd.title
		);
		// console.log(msg);
		sendMessage(msg);
	};

	return (
		<KeyboardAwareScrollView behavior="padding">
			<View style={styles.contentContainer}>
				<View style={styles.cardContainer}>
					<Card title={`Contact ${currentAd.creator.screenName}`}>
						<Text style={styles.formText}>Regards: {currentAd.title}</Text>
						<Spacer />
						{state.errorMessage ? (
							<Text style={{ ...styles.error, ...styles.formText }}>
								{state.errorMessage}
							</Text>
						) : null}
						<Input label="Your name" value={name} onChangeText={setName} />
						<Input
							label="Your message"
							scrollEnabled={false}
							multiline
							value={message}
							onChangeText={setMessage}
						/>
						<View style={styles.buttonRow}>
							<Button
								title="Cancel"
								buttonStyle={{
									...styles.Button.buttonStyle,
									backgroundColor: colors.accentedColor
								}}
								titleStyle={{
									...styles.Button.titleStyle,
									color: colors.color
								}}
								containerStyle={{
									...styles.Button.containerStyle,
									flex: 1
								}}
								onPress={() => navigation.goBack()}
							/>
							<Button
								title="Send"
								onPress={startSendSequence}
								buttonStyle={{ ...styles.Button.buttonStyle }}
								containerStyle={{
									...styles.Button.containerStyle,
									flex: 2,
									marginLeft: 10
								}}
							/>
						</View>
					</Card>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default AdContactScreen;
