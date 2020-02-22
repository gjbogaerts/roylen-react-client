import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Alert
} from 'react-native';
import {
	Text,
	Overlay,
	ListItem,
	Button,
	Input,
	Slider
} from 'react-native-elements';
import * as Location from 'expo-location';
import { styles, colors } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import PickerModal from 'react-native-picker-modal-view';
import { getBaseUrl } from '../api/axios';
import categories from '../models/Categories';
import { Ionicons } from '@expo/vector-icons';

const AdsListScreen = () => {
	const { state, getAllAds, getAd, getSpecAds, getDistanceAds } = useContext(
		AdContext
	);
	const [search, setSearch] = useState('');
	const [searchVisible, setSearchVisible] = useState(false);
	const [filterVisible, setFilterVisible] = useState(false);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [filter, setFilter] = useState(0);
	const [filteredAds, setFilteredAds] = useState([]);
	const [distanceFilter, setDistanceFilter] = useState(4);
	const [distanceFilteredAds, setDistanceFilteredAds] = useState([]);

	useEffect(() => {
		const getAds = async () => {
			await getAllAds();
		};
		setSearch('');
		setFilter(0);
		setDistanceFilter(4);
		getAds();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startSearch = (itemToSearch, inCategory) => {
		setSearchVisible(false);
		setShowSearchResult(true);
		getSpecAds(itemToSearch, inCategory);
	};

	const implementWantedFilter = val => {
		setFilter(val);
		setFilterVisible(false);
		let ads;
		switch (val) {
			case 0:
				setFilteredAds(state.adList);
				break;

			case 1:
				ads = state.adList.filter(ad => {
					return ad.adNature === 'offered';
				});
				setFilteredAds(ads);
				break;
			case 2:
				ads = state.adList.filter(ad => {
					return ad.adNature === 'wanted';
				});
				setFilteredAds(ads);
				break;
		}
		// console.log(ads.length);
	};

	const implementDistanceFilter = async val => {
		const { status } = await Location.requestPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'We cannot provide you with a filter on distance, because we need to know youw own location'
			);
		}
		const location = await Location.getCurrentPositionAsync();
		setDistanceFilter(val);
		setFilterVisible(false);
		let ads;
		switch (val) {
			case 4:
				setDistanceFilteredAds(state.adList);
				break;
			case 0:
				ads = getDistanceAds(1, location);
				setDistanceFilteredAds(ads);
				break;
			case 1:
				ads = getDistanceAds(5, location);
				setDistanceFilteredAds(ads);
				break;
			case 2:
				ads = getDistanceAds(10, location);
				setDistanceFilteredAds(ads);
				break;
			case 3:
				ads = getDistanceAds(50, location);
				setDistanceFilteredAds(ads);
				break;
			default:
				setDistanceFilteredAds(state.adList);
		}
		// console.log(distanceFilteredAds);
	};

	const renderGetAllAdsButton = () => {
		return (
			<Button
				title="Show all ads"
				onPress={() => {
					setShowSearchResult(false);
					setFilter(0);
					getAllAds();
				}}
			/>
		);
	};

	const renderList = () => {
		if (state.adList.length === 0) {
			return (
				<>
					<Text>No ads to show.</Text>
					{renderGetAllAdsButton()}
				</>
			);
		} else {
			return (
				<View>
					<Overlay
						isVisible={filterVisible}
						onBackdropPress={() => setFilterVisible(false)}
						borderRadius={15}
						height={300}
					>
						<View
							style={{
								flexDirection: 'column',
								alignItems: 'stretch',
								justifyContent: 'space-between',
								height: '100%'
							}}
						>
							<PickerModal
								items={categories}
								showAlphabeticalIndex
								autoSort
								onSelected={item => {
									startSearch(item, true);
									setFilterVisible(false);
									setFilter(0);
									setSearch('');
								}}
								selectPlaceholderText="Pick a category"
								searchPlaceholderText="Search a category"
							/>
							<View
								style={{
									...styles.containerRow,
									justifyContent: 'space-between'
								}}
							>
								<Text style={{ fontSize: 14 }}>Show all</Text>
								<Text style={{ fontSize: 14 }}>Show offered</Text>
								<Text style={{ fontSize: 14 }}>Show wanted</Text>
							</View>
							<Slider
								style={{ position: 'relative', top: -10 }}
								minimumValue={0}
								maximumValue={2}
								step={1}
								thumbTintColor={colors.color}
								minimumTrackTintColor={colors.color}
								value={filter}
								onSlidingComplete={implementWantedFilter}
							/>
							<View>
								<Text>Distance:</Text>
								<View
									style={{
										...styles.containerRow,
										justifyContent: 'space-between'
									}}
								>
									<Text style={{ fontSize: 14 }}>&lt; 1 km</Text>
									<Text style={{ fontSize: 14 }}>&lt; 5 km</Text>
									<Text style={{ fontSize: 14 }}>&lt; 10 km</Text>
									<Text style={{ fontSize: 14 }}>&lt; 50 km</Text>
									<Text style={{ fontSize: 14 }}>Any</Text>
								</View>
								<Slider
									style={{ position: 'relative', top: -10 }}
									minimumValue={0}
									maximumValue={4}
									step={1}
									thumbTintColor={colors.color}
									minimumTrackTintColor={colors.color}
									value={distanceFilter}
									onSlidingComplete={implementDistanceFilter}
								/>
							</View>
						</View>
					</Overlay>
					<Overlay
						isVisible={searchVisible}
						onBackdropPress={() => setSearchVisible(false)}
						borderRadius={15}
						height={200}
					>
						<>
							<Input
								value={search}
								onChangeText={setSearch}
								placeholder="Your search term"
							/>
							<View style={styles.buttonRow}>
								<Button
									title="Cancel"
									buttonStyle={{
										...styles.Button.buttonStyle,
										backgroundColor: colors.accentedColor
									}}
									titleStyle={{
										...styles.Button.titleStyle,
										color: colors.color
									}}
									containerStyle={{
										...styles.Button.containerStyle,
										flex: 1
									}}
									onPress={() => setSearchVisible(false)}
								/>
								<Button
									title="Send"
									onPress={() => startSearch(search, false)}
									buttonStyle={{ ...styles.Button.buttonStyle }}
									containerStyle={{
										...styles.Button.containerStyle,
										flex: 2,
										marginLeft: 10
									}}
								/>
							</View>
						</>
					</Overlay>
					{showSearchResult ? renderGetAllAdsButton() : null}
					<FlatList
						data={
							filteredAds && filteredAds.length
								? filteredAds
								: distanceFilteredAds && distanceFilteredAds.length
								? distanceFilteredAds
								: state.adList
						}
						keyExtractor={item => item._id}
						renderItem={({ item }) => {
							const tmpDescription = item.description.split(' ');
							const description = tmpDescription.slice(0, 5).join(' ') + '...';
							return (
								<TouchableOpacity
									onPress={() => {
										getAd(item._id, item.title);
									}}
								>
									<ListItem
										title={item.title}
										leftAvatar={{
											source: { uri: getBaseUrl() + item.pics[0] }
										}}
										rightSubtitle={item.category + ': ' + description}
										bottomDivider
										chevron
										subtitle={item.creator.screenName}
									/>
								</TouchableOpacity>
							);
						}}
					/>
				</View>
			);
		}
	};

	return (
		<View style={{ ...styles.container, marginBottom: 0 }}>
			<View style={{ ...styles.contentContainer }}>
				<View
					style={{ ...styles.containerRow, justifyContent: 'space-between' }}
				>
					<Text h4>All ads</Text>
					<TouchableOpacity onPress={() => setSearchVisible(true)}>
						<Ionicons name="ios-search" size={30} color={colors.color} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setFilterVisible(true)}>
						<Ionicons name="ios-funnel" size={30} color={colors.color} />
					</TouchableOpacity>
				</View>

				{state.adList == null ? <ActivityIndicator /> : renderList()}
			</View>
		</View>
	);
};

export default AdsListScreen;
