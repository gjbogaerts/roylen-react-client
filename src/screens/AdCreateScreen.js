import React, { useState } from 'react';
import { View, Picker } from 'react-native';
import { Text, Input, Card, Button, ButtonGroup } from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import categories from '../models/Categories';

const AdCreateScreen = props => {
	const [category, setCategory] = useState(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [virtualPrice, setVirtualPrice] = useState('');

	const renderCategories = () => {
		return categories.map(cat => (
			<Picker.Item key={cat.label} label={cat.label} value={cat.value} />
		));
	};

	const selectCamera = <Text>Camera</Text>;
	const selectCameraRoll = <Text>Photo Library</Text>;
	const updateIndex = () => {};

	const submitAd = () => {
		console.log(category, title, description, virtualPrice);
	};

	const pickCategory = (val, index) => {
		setCategory(val);
		// console.log(val, index);
	};
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<Text h4>Create a new ad</Text>
				<View style={{ ...styles.cardContainer, paddingVertical: 0 }}>
					<Card title="Ad details">
						<Input label="Title" value={title} onChangeText={setTitle} />
						<Input
							label="Description"
							multiline
							value={description}
							onChangeText={setDescription}
						/>
						<Input
							label="Price"
							placeholder="Set your price in nix"
							value={virtualPrice}
							onChangeText={setVirtualPrice}
						/>
						<Text style={{ marginLeft: 10 }}>Pick a category</Text>
						<Picker
							style={{ marginTop: -65 }}
							onValueChange={pickCategory}
							selectedValue={category}
						>
							{renderCategories()}
						</Picker>

						<Text style={{ marginLeft: 10 }}>
							Select one or more photos from your picture library or take photos
							with your camera
						</Text>
						<ButtonGroup
							buttons={[selectCamera, selectCameraRoll]}
							onPress={updateIndex}
						/>
						<Button title="Place your ad" onPress={submitAd} />
					</Card>
				</View>
			</View>
		</View>
	);
};

export default AdCreateScreen;
