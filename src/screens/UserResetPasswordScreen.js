import React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../styles/styles';
import { Context as AuthContext } from '../context/AuthContext';

const ResetPasswordScreen = props => {
	const [email, setEmail] = useState('');
	const [secretKey, setSecretKey] = useState('');
	const [pw1, setPw1] = useState('');
	const [pw2, setPw2] = useState('');
	const { state, sendResetPasswordEmail, resetPassword } = useContext(
		AuthContext
	);

	const dispatchResetPassword = () => {
		if (pw1 !== pw2) {
			alert('Your passwords are not the same. Please try again!');
			return;
		} else {
			resetPassword(secretKey, pw1);
		}
	};

	const renderFirstMessage = () => {
		if (state.errorMessage) {
			return <Text style={styles.error}>{state.errorMessage}</Text>;
		} else if (state.flashMessage) {
			return <Text>{state.flashMessage}</Text>;
		} else {
			return null;
		}
	};

	return (
		<KeyboardAwareScrollView style={styles.container}>
			<View style={styles.contentContainer}>
				<Text h4>Reset password</Text>
				<View style={styles.cardContainer}>
					<Card title="Send reset email">
						<>
							<Input
								label="Email"
								placeholder="Please enter your email address"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								returnKeyType="send"
								autoCapitalize="none"
								autoCorrect={false}
							/>
							<Button
								title="Send"
								// onPress={() => console.log('pressed')}
								onPress={() => sendResetPasswordEmail(email)}
							/>
						</>
						{renderFirstMessage()}
					</Card>
					<Card title="Reset password">
						<Input
							label="Secret key"
							placeholder="You received it in your mail"
							value={secretKey}
							onChangeText={setSecretKey}
						/>
						<Input
							label="Your new password"
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={val => setPw1(val)}
							value={pw1}
						/>
						<Input
							label="Repeat your new password"
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={val => setPw2(val)}
							value={pw2}
						/>
						<Button title="Reset password" onPress={dispatchResetPassword} />
					</Card>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

// const styles = StyleSheet.create({});

export default ResetPasswordScreen;
