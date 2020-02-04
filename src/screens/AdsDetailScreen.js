import React, { useContext } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import { getBaseUrl } from '../api/axios';
import GallerySwiper from 'react-native-gallery-swiper';

const AdsDetailScreen = ({ navigation }) => {
	const { state } = useContext(AdContext);

	// console.log(state);

	const images = state.currentAd.pics.map(img => {
		return { uri: getBaseUrl() + img, dimensions: { width: 640, height: 480 } };
	});
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

	return (
		<View style={styles.container}>
			<ScrollView style={styles.contentContainer}>
				<GallerySwiper
					images={images}
					resizeMode="contain"
					style={{
						backgroundColor: colors.backgroundColor,
						width: '100%',
						height: 300
					}}
				/>

				<View style={styles.cardContainer}>
					<Card title={currentAd.title}>
						<Text>Virtual Price: {currentAd.virtualPrice} nix</Text>
						<Text style={styles.caption}>
							Placed on {showDate} by {currentAd.creator.screenName} in category{' '}
							{currentAd.category}
						</Text>
						<TouchableOpacity onPress={() => console.log('pressed')}>
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

// const styles = StyleSheet.create({});

AdsDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		headerStyle: {
			backgroundColor: colors.backgroundColor
		},
		headerTintColor: colors.color,
		title: navigation.getParam('title'),
		headerTitleStyle: {
			fontFamily: 'dosis-bold',
			fontSize: 28,
			color: colors.color
		},
		headerBackTitle: 'Back to ads list',
		headerBackTitleStyle: {
			fontFamily: 'dosis',
			fontSize: 18,
			color: colors.color
		}
	};
};

export default AdsDetailScreen;
