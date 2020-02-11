import React, { useState, useContext, useEffect } from 'react';
import { View, AsyncStorage, ScrollView } from 'react-native';
import {
	Text,
	Input,
	Card,
	Button,
	ButtonGroup,
	CheckBox,
	Tooltip
} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { styles, colors } from '../styles/styles';
import categories from '../models/Categories';
import PickerModal from 'react-native-picker-modal-view';
import Ad from '../models/Ad';
import { Context as AdContext } from '../context/AdContext';

const AdCreateScreen = props => {
	const [category, setCategory] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [virtualPrice, setVirtualPrice] = useState('');
	const [pics, setPics] = useState(null);
	const [user, setUser] = useState(null);
	const [wanted, setWanted] = useState(false);

	const { placeAd } = useContext(AdContext);

	useEffect(() => {
		const fetchUser = async () => {
			const userData = await AsyncStorage.getItem('userData');
			const u = JSON.parse(userData);
			setUser(u);
		};
		fetchUser();
	}, []);

	const selectCamera = <Text>Camera</Text>;
	const selectCameraRoll = <Text>Photo Library</Text>;

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

	const startCamera = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Need permission',
				'If you want to add pictures, this app needs access to your camera',
				[{ text: 'OK' }],
				{ cancelable: true }
			);
			return;
		} else {
			const pickedImage = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [1, 1]
			});
			setPics(pickedImage);
		}
	};

	const startPhotoLib = async () => {
		const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Need permission',
				'If you want to add pictures, this app needs access to your photo library',
				[{ text: 'OK' }],
				{ cancelable: false }
			);
			return;
		} else {
			const pickedImage = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1]
			});
			setPics(pickedImage);
		}
	};

	const submitAd = () => {
		// console.log(category, title, description, virtualPrice, pics);
		const ad = new Ad(
			title,
			description,
			category,
			virtualPrice,
			pics,
			user._id,
			wanted
		);
		placeAd(ad);
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.contentContainer}>
				<Text h4>Create a new ad</Text>
				<View style={{ ...styles.cardContainer, paddingVertical: 0 }}>
					<Card title="Ad details">
						<CheckBox
							containerStyle={{
								backgroundColor: 'transparent',
								borderColor: 'transparent'
							}}
							checked={wanted}
							onPress={() => setWanted(!wanted)}
							right
							size={20}
							title={
								<Tooltip
									popover={
										<Text style={styles.tooltipTextStyle}>
											If you check this box, you will place an ad in the
											'wanted' category. Uncheck it to get your item in the
											'offered' category.
										</Text>
									}
									height={100}
									width={300}
								>
									<Text>Wanted?</Text>
								</Tooltip>
							}
							checkedIcon="dot-circle-o"
							uncheckedIcon="circle-o"
						/>

						<Input
							label={
								<Tooltip
									width={200}
									height={50}
									popover={
										<Text style={styles.tooltipTextStyle}>
											Min. 5, max. 50 chars
										</Text>
									}
								>
									<Text>Title</Text>
								</Tooltip>
							}
							value={title}
							onChangeText={setTitle}
						/>

						<Input
							label={
								<Tooltip
									width={200}
									height={50}
									popover={
										<Text style={styles.tooltipTextStyle}>Max. 5200 chars</Text>
									}
								>
									<Text>Description</Text>
								</Tooltip>
							}
							multiline
							value={description}
							onChangeText={setDescription}
						/>
						<Input
							label={
								<Tooltip
									width={200}
									height={50}
									popover={
										<Text style={styles.tooltipTextStyle}>
											Only whole numbers
										</Text>
									}
								>
									<Text>Your price in nix</Text>
								</Tooltip>
							}
							placeholder="Set your price in nix"
							value={virtualPrice}
							onChangeText={setVirtualPrice}
						/>
						<PickerModal
							items={categories}
							showAlphabeticalIndex
							autoSort
							onSelected={item => {
								setCategory(item.Value);
							}}
							selectPlaceholderText="Pick a category"
							searchPlaceholderText="Search a category"
						/>

						<Text style={{ marginLeft: 10 }}>
							Select a photo from your picture library or take a picture with
							your camera
						</Text>
						<ButtonGroup
							buttons={[selectCamera, selectCameraRoll]}
							onPress={updateIndex}
						/>
						<Button title="Place your ad" onPress={submitAd} />
					</Card>
				</View>
			</ScrollView>
		</View>
	);
};

export default AdCreateScreen;
