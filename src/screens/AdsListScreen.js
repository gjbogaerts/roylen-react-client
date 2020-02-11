import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import { Text, Overlay, ListItem, Button, Input } from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import PickerModal from 'react-native-picker-modal-view';
import { getBaseUrl } from '../api/axios';
import categories from '../models/Categories';
import { Ionicons } from '@expo/vector-icons';

const AdsListScreen = ({ navigation }) => {
	const { state, getAllAds, getAd, getSpecAds } = useContext(AdContext);
	const [search, setSearch] = useState('');
	const [searchVisible, setSearchVisible] = useState(false);
	const [showSearchResult, setShowSearchResult] = useState(false);

	useEffect(() => {
		const getAds = async () => {
			await getAllAds();
		};
		getAds();
	}, []);

	const startSearch = (itemToSearch, inCategory) => {
		setSearchVisible(false);
		getSpecAds(itemToSearch, inCategory);
		setShowSearchResult(true);
	};

	const renderList = () => {
		if (state.adList.length === 0) {
			return <Text>No ads placed yet.</Text>;
		} else {
			return (
				<View>
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
					{showSearchResult ? (
						<Button
							title="Show all ads"
							onPress={() => {
								setShowSearchResult(false);
								getAllAds();
							}}
						/>
					) : null}
					<FlatList
						data={state.adList}
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
										rightSubtitle={description}
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
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View
					style={{ ...styles.containerRow, justifyContent: 'space-between' }}
				>
					<Text h4>All ads</Text>
					<TouchableOpacity onPress={() => setSearchVisible(true)}>
						<Ionicons name="ios-search" size={30} color={colors.color} />
					</TouchableOpacity>
				</View>

				<PickerModal
					items={categories}
					showAlphabeticalIndex
					autoSort
					onSelected={item => {
						startSearch(item, true);
					}}
					selectPlaceholderText="Pick a category"
					searchPlaceholderText="Search a category"
				/>

				{state.adList == null ? <ActivityIndicator /> : renderList()}
			</View>
		</View>
	);
};

export default AdsListScreen;
