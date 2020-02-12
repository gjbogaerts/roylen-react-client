import React, { useContext } from 'react';
import { View, Alert } from 'react-native';
import { styles } from '../styles/styles';
import AuthForm from '../components/AuthForm';
import axios from '../api/axios';
import { Context as AuthContext } from '../context/AuthContext';

const UserSignupScreen = props => {
	const { state, signup, clearErrorMessage } = useContext(AuthContext);

	const showAlert = () => {
		Alert.alert(
			'Error signing up',
			state.errorMessage,
			// 'Something went wrong when you tried to sign up. Perhaps you already have an account with Roylen?',
			[{ text: 'OK', onPress: () => clearErrorMessage() }],
			{ cancelable: false }
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<AuthForm
					showSignUp
					title="Sign up"
					buttonTitle="Sign up to Roylen"
					onSubmit={signup}
					navigation={props.navigation}
					navigationLabel="Already have an account? You can log in here"
					navigationLink="Login"
				/>
				{state.errorMessage ? showAlert() : null}
			</View>
		</View>
	);
};

UserSignupScreen.navigationOptions = nav => {
	return {
		headerShown: false
	};
};

export default UserSignupScreen;
