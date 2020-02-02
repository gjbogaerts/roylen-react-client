import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdsDetailScreen = ({ navigation }) => {
	return (
		<View>
			<Text>AdsDetailScreen for ad with id {navigation.getParam('id')}</Text>
		</View>
	);
};

const styles = StyleSheet.create({});

export default AdsDetailScreen;
