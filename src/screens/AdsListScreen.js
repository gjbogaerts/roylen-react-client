import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import { Text, SearchBar, ListItem } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { styles } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import { getBaseUrl } from '../api/axios';
import categories from '../models/Categories';

const AdsListScreen = ({ navigation }) => {
	const { state, getAllAds } = useContext(AdContext);

	useEffect(() => {
		const getAds = async () => {
			await getAllAds();
		};
		getAds();
	}, []);

	const renderList = () => {
		if (state.adList.length === 0) {
			return <Text>No ads placed yet.</Text>;
		} else {
			return (
				<FlatList
					data={state.adList}
					keyExtractor={item => item._id}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('AdsDetail', { id: item._id });
								}}
							>
								<ListItem
									title={item.title}
									leftAvatar={{
										source: { uri: getBaseUrl() + item.pics[0] }
									}}
									bottomDivider
									chevron
									subtitle={item.description}
								/>
							</TouchableOpacity>
						);
					}}
				/>
			);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<Text h4>All ads</Text>
				<RNPickerSelect
					onValueChange={val => console.log(val)}
					items={categories}
					placeholder={{ label: 'Select a category', value: null }}
				/>
				<SearchBar placeholder="Search for items" />

				{state.adList == null ? <ActivityIndicator /> : renderList()}
			</View>
		</View>
	);
};

// const styles = StyleSheet.create({});
AdsListScreen.navigationOptions = nav => {
	return {
		headerShown: false
	};
};
export default AdsListScreen;
