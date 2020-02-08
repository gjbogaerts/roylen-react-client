import { StyleSheet } from 'react-native';

export const colors = {
	backgroundColor: '#faf5e4',
	color: '#004445',
	accentedColor: '#f8b400',
	errorColor: '#dd3322'
};

export const officalStyles = StyleSheet.create({
	container: {
		flex: 1,
		fontFamily: 'dosis',
		backgroundColor: colors.backgroundColor,
		color: colors.color
	},
	contentContainer: {
		flex: 1,
		marginTop: 40,
		marginHorizontal: 15,
		marginBottom: 40
	},
	cardContainer: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 20
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 15
	},
	containerRow: {
		flexDirection: 'row'
	},
	containerCol: {
		flexDirection: 'column'
	},
	caption: {
		fontSize: 14
	},
	link: {
		textDecorationLine: 'underline'
	},
	alertButton: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	}
});

export const styles = {
	...officalStyles,
	Text: {
		h4Style: {
			fontFamily: 'dosis-bold',
			fontSize: 28,
			color: colors.color,
			marginBottom: 25,
			textAlign: 'center'
		},
		style: {
			fontFamily: 'dosis',
			fontSize: 18,
			color: colors.color,
			marginVertical: 5
		}
	},
	Input: {
		labelStyle: {
			color: colors.color,
			fontSize: 18,
			fontFamily: 'dosis'
		}
	},
	Button: {
		buttonStyle: {
			borderRadius: 15,
			backgroundColor: colors.color,
			marginTop: 35
		},
		titleStyle: {
			color: colors.backgroundColor
		},
		containerStyle: {
			justifyContent: 'center'
		}
	},
	Card: {
		titleStyle: {
			color: colors.color
		},
		containerStyle: {
			borderRadius: 15,
			width: '80%',
			shadowColor: 'black',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.26,
			shadowRadius: 8
		}
	},
	ButtonGroup: {
		buttonStyle: {
			backgroundColor: colors.backgroundColor
		}
	}
};
