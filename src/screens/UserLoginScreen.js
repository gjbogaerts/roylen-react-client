import React, { useContext } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../styles/styles';
import AuthForm from '../components/AuthForm';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as MessageContext } from '../context/MessageContext';

const UserLoginScreen = props => {
	const { state, signin, clearErrorMessage } = useContext(AuthContext);
	const { readMessage } = useContext(MessageContext);

	const showAlert = () => {
		Alert.alert(
			'Error signing in',
			"Something went wrong when you tried to sign in. Perhaps you've misspelled your email or password?",
			[{ text: 'OK', onPress: () => clearErrorMessage() }],
			{ cancelable: false }
		);
	};

	return (
		<View style={styles.contentContainer}>
			<AuthForm
				showSignUp={false}
				title="Log in"
				buttonTitle="Sign in to Roylen"
				onSubmit={signin}
				getMessageCount={readMessage}
				navigation={props.navigation}
				navigationLabel="No account yet? You can sign up here"
				navigationLink="Signup"
			/>
			{state.errorMessage ? showAlert() : null}
		</View>
	);
};
UserLoginScreen.navigationOptions = nav => {
	return {
		headerShown: false
	};
};

export default UserLoginScreen;
