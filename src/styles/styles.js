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
    marginHorizontal: 5,
    marginBottom: 20
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  containerCol: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
  error: {
    color: colors.errorColor
  },
  formText: {
    marginLeft: 10
  },
  tooltipTextStyle: {
    fontFamily: 'dosis',
    fontSize: 14,
    color: colors.backgroundColor
  }
});

export const styles = {
  ...officalStyles,
  Text: {
    h4Style: {
      fontFamily: 'quicksand-bold',
      fontSize: 28,
      color: colors.color,
      marginBottom: 0,
      textAlign: 'center'
    },
    style: {
      fontFamily: 'dosis',
      fontSize: 18,
      color: colors.color,
      marginVertical: 5
    }
  },
  Tooltip: {
    backgroundColor: colors.color
  },
  Input: {
    labelStyle: {
      color: colors.color,
      fontSize: 18,
      fontFamily: 'dosis'
    },
    inputContainerStyle: {
      paddingTop: 0
    }
  },
  Button: {
    buttonStyle: {
      borderRadius: 15,
      backgroundColor: colors.color,
      borderWidth: 1,
      borderColor: colors.backgroundColor
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
      color: colors.color,
      fontFamily: 'quicksand'
    },
    containerStyle: {
      borderRadius: 15,
      width: '100%',
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
