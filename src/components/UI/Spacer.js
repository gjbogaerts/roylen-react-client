import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Spacer = props => {
	return <View style={styles.marginSetter} />;
};

const styles = StyleSheet.create({
	marginSetter: {
		marginVertical: 15
	}
});

export default Spacer;
