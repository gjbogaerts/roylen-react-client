import React, { Fragment, useState } from 'react';
import { TouchableOpacity, View, ShadowPropTypesIOS } from 'react-native';
import { Text, Card, Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';

import Spacer from './UI/Spacer';
import { colors, styles } from '../styles/styles';

const AuthForm = ({
	title,
	buttonTitle,
	onSubmit,
	navigation,
	navigationLabel,
	navigationLink,
	showSignUp,
	getMessageCount
}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [screenName, setScreenName] = useState('');

	return (
		<View style={styles.cardContainer}>
			<Card title={title}>
				{showSignUp ? (
					<Input
						label="Choose a screen name"
						placeholder="Minimum of 8 characters"
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={val => setScreenName(val)}
						value={screenName}
					/>
				) : null}
				<Input
					label="Your email address"
					keyboardType="email-address"
					autoCorrect={false}
					autoCapitalize="none"
					onChangeText={val => setEmail(val)}
					value={email}
				/>
				<Input
					label="Your password"
					secureTextEntry
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={val => setPassword(val)}
					value={password}
				/>
				<Button
					title={buttonTitle}
					onPress={() =>
						onSubmit({ email, password, screenName }, getMessageCount)
					}
					icon={
						<Entypo
							name="login"
							style={{ paddingLeft: 30 }}
							size={18}
							color={colors.backgroundColor}
						/>
					}
					iconRight
				/>
			</Card>
			<Spacer />
			<TouchableOpacity onPress={() => navigation.navigate(navigationLink)}>
				<Text>{navigationLabel}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default AuthForm;
