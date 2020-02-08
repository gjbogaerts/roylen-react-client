import React, { useContext, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { Text, Card } from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import { getBaseUrl } from '../api/axios';
import { Ionicons } from '@expo/vector-icons';
// import GallerySwiper from 'react-native-gallery-swiper';

const AdsDetailScreen = ({ navigation }) => {
	const { state } = useContext(AdContext);
	const [alert, setAlert] = useState('');

	// console.log(state);

	const imageUri = state.currentAd.pics.map(img => {
		return getBaseUrl() + img;
	});
	// console.log(imageUri);
	const currentAd = state.currentAd;
	const date = new Date(currentAd.dateAdded);
	const dateOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	};
	const showDate = date.toLocaleDateString('nl-NL', dateOptions);

	const warnAdmin = async () => {
		try {
			const { status } = await MailComposer.composeAsync({
				recipients: ['gj@raker.nl'],
				subject: 'Warning regarding ad on Roylen',
				body: `<p>Please tell us the nature of your complaint: </p><br /><br /><p>Do not change anything below this line:<br />---------------------------<br /><br />Ad ID: ${currentAd._id}</p><br /><p>Thank you very much for your interest in keeping Roylen safe and clean.`,
				isHtml: true
			});
			if (status === 'sent') {
				setAlert(
					'Thank you for your interest in keeping Roylen safe and clean. We will look into your complaint and take any necessary action.'
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	if (alert) {
		Alert.alert('Thank you', alert, ['OK']);
	}

	return (
		<View style={styles.container}>
			<ScrollView style={styles.contentContainer}>
				{/* <GallerySwiper
					images={images}
					resizeMode="contain"
					style={{
						backgroundColor: colors.backgroundColor,
						width: '100%',
						height: 300
					}}
				/> */}
				<Text h4>{navigation.getParam('title')}</Text>
				<TouchableOpacity style={styles.alertButton} onPress={warnAdmin}>
					<Ionicons name="ios-alert" color={colors.errorColor} size={24} />
				</TouchableOpacity>
				<Image
					source={{ uri: imageUri[0] }}
					style={{ width: 400, height: 400 }}
				/>

				<View style={styles.cardContainer}>
					<Card title={currentAd.title}>
						<Text>Virtual Price: {currentAd.virtualPrice} nix</Text>
						<Text style={styles.caption}>
							Placed on {showDate} by {currentAd.creator.screenName} in category{' '}
							{currentAd.category}
						</Text>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate('AdContact', { concerning: currentAd })
							}
							style={styles.alertButton}
						>
							<Ionicons
								name="ios-mail"
								size={24}
								color={colors.color}
								style={{ marginTop: 5, marginRight: 10 }}
							/>
							<Text style={styles.link}>
								Contact {currentAd.creator.screenName}!
							</Text>
						</TouchableOpacity>
					</Card>
				</View>
				<Text>{currentAd.description}</Text>
			</ScrollView>
		</View>
	);
};

AdsDetailScreen.navigationOptions = nav => {
	return {
		headerShown: true
	};
};

export default AdsDetailScreen;
