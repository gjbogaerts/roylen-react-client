import React, { useState, useContext, useCallback } from 'react';
import { View } from 'react-native';
import { Text, Card, Input, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { styles, colors } from '../styles/styles';
import { Context as MessageContext } from '../context/MessageContext';
import useAuthInfo from '../hooks/useAuthInfo';

const InfoScreen = props => {
	const [msg, setMsg] = useState('');
	const [email, setEmail] = useState('');
	const { state, sendToRoylen, cleanUpMessage } = useContext(MessageContext);

	useFocusEffect(
		useCallback(() => {
			//do something when screen is focused...
			return () => {
				//when unfocusing
				cleanUpMessage();
			};
		}, [])
	);

	const user = useAuthInfo();

	const closeForm = () => {
		setMsg('');
		setEmail('');
	};
	const sendMsg = () => {
		const ident = email ? email : user.email ? user.email : '';
		sendToRoylen(msg, ident);
		closeForm();
	};
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<Text h4>Welcome to Roylen</Text>
				<View style={styles.cardContainer}>
					<Card title="Contact us">
						{state.message ? <Text>{state.message}</Text> : null}
						{state.errorMessage ? (
							<Text style={styles.errorMessage}>{state.errorMessage}</Text>
						) : null}
						{!user ? (
							<Input
								title="Your email address"
								placeholder="Not required"
								value={email}
								onChangeText={setEmail}
							/>
						) : null}
						<Input
							title="Your message"
							placeholder="Type your message to us"
							multiline
							value={msg}
							onChangeText={setMsg}
						/>
						<View style={styles.buttonRow}>
							<Button
								title="Cancel"
								onPress={closeForm}
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
							/>
							<Button
								title="Send"
								onPress={() => sendMsg(msg)}
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
		</View>
	);
};

export default InfoScreen;
