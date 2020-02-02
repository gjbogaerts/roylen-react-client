import React, { useContext, useEffect, useState, Fragment } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
	View,
	StyleSheet,
	AsyncStorage,
	Alert,
	ActivityIndicator
} from 'react-native';
import {
	Button,
	Text,
	Card,
	Input,
	ButtonGroup,
	Avatar
} from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import { getBaseUrl } from '../api/axios';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from '../components/UI/Spacer';

const UserProfileScreen = props => {
	const { signout, updateProfileInfo } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const [email, setEmail] = useState('');
	const [profilePic, setProfilePic] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			setUser(u);
			setEmail(u.email);
		};
		fetchUserData();
	}, []);

	const handleProfileChange = () => {
		updateProfileInfo(email, profilePic);
	};

	const printUserData = () => {
		const selectCamera = <Text>Camera</Text>;
		const selectCameraRoll = <Text>Photo Library</Text>;

		const startCamera = async () => {
			const { status } = await ImagePicker.requestCameraPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Need permission',
					'If you want to change your profile picture, this app needs access to your camera',
					[{ text: 'OK' }],
					{ cancelable: true }
				);
				return;
			} else {
				const pickedImage = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [1, 1]
				});
				setProfilePic(pickedImage);
			}
		};

		const startPhotoLib = async () => {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Need permission',
					'If you want to change your profile picture, this app needs access to your photo library',
					[{ text: 'OK' }],
					{ cancelable: false }
				);
				return;
			} else {
				const pickedImage = await ImagePicker.launchImageLibraryAsync({
					allowsEditing: true,
					allowsMultipleSelection: false,
					aspect: [1, 1]
				});
				setProfilePic(pickedImage);
			}
		};

		const updateIndex = index => {
			switch (index) {
				case 0:
					startCamera();
					break;
				case 1:
					startPhotoLib();
					break;
			}
		};

		return (
			<Fragment>
				<View style={styles.containerRow}>
					<View style={localStyles.avatar}>
						<Avatar
							source={{ uri: getBaseUrl() + user.avatar }}
							size="medium"
							rounded
							PlaceholderContent={<ActivityIndicator />}
						/>
					</View>
					<View style={{ ...styles.containerCol, ...localStyles.profileInfo }}>
						<Text>Your screen name is {user.screenName}.</Text>
						<Text>Your current credit is {user.nix} nix.</Text>
					</View>
				</View>
				<View style={styles.cardContainer}>
					<Card title="Change email or profile pic">
						<Input
							label="Your email address"
							keyboardType="email-address"
							autoCapitalize="none"
							value={email}
							onChangeText={val => setEmail(val)}
						/>
						<Spacer />
						<Text style={{ marginLeft: 10 }}>
							Choose a profile picture from:
						</Text>
						<ButtonGroup
							buttons={[selectCamera, selectCameraRoll]}
							onPress={updateIndex}
						/>
						<Button title="Submit" onPress={handleProfileChange} />
					</Card>
				</View>
			</Fragment>
		);
	};

	return (
		<View style={styles.contentContainer}>
			<Text h4>Your Profile</Text>
			{user ? printUserData() : null}
			<Button title="Log out" onPress={signout} />
		</View>
	);
};

const localStyles = StyleSheet.create({
	avatar: {
		justifyContent: 'center'
	},
	profileInfo: {
		marginLeft: 15
	}
});

export default UserProfileScreen;
