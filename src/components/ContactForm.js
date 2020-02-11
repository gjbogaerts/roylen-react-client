import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { styles, colors } from '../styles/styles';

const MessageModal = ({ receiverName, closeForm, sendMsg }) => {
	// console.log(from, to, re, closeForm);
	const [msg, setMsg] = useState('');
	return (
		<View style={{ marginTop: 22 }}>
			<View style={{ marginTop: 22 }}>
				<Text style={styles.formText}>Message for {receiverName}</Text>
				<Input
					multiline
					value={msg}
					onChangeText={setMsg}
					label="Type your message"
				/>
				<View style={styles.buttonRow}>
					<Button
						title="Cancel"
						onPress={closeForm}
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
					/>
					<Button
						title="Send"
						onPress={() => sendMsg(msg)}
						buttonStyle={{ ...styles.Button.buttonStyle }}
						containerStyle={{
							...styles.Button.containerStyle,
							flex: 2,
							marginLeft: 10
						}}
					/>
				</View>
			</View>
		</View>
	);
};

// const styles = StyleSheet.create({});

export default MessageModal;
