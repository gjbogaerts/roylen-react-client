import React, { useState, useEffect } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button, Text, Card, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, styles } from '../styles/styles';
import Spacer from '../components/UI/Spacer';

const AdContactScreen = ({ navigation }) => {
	const currentAd = navigation.getParam('concerning');
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			setUser(u);
		};
		fetchUserData();
	}, []);

	const sendMessage = () => {
		console.log(name, message, user._id, currentAd._id, currentAd.title);
	};

	return (
		<KeyboardAwareScrollView behavior="padding">
			<View style={styles.contentContainer}>
				<View style={styles.cardContainer}>
					<Card title={`Contact ${currentAd.creator.screenName}`}>
						<Text style={{ marginLeft: 10 }}>Regards: {currentAd.title}</Text>
						<Spacer />
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
								onPress={sendMessage}
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

AdContactScreen.navigationOptions = nav => {
	return {
		headerShown: false,
		headerMode: 'none'
	};
};

export default AdContactScreen;
