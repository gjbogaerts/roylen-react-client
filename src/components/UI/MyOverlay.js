import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Overlay, Text, Button } from 'react-native-elements';

const MyOverlay = props => {
	const { children } = props;
	return (
		<Overlay {...props} borderRadius={15}>
			{children}
		</Overlay>
	);
};

const styles = StyleSheet.create({});

export default MyOverlay;
