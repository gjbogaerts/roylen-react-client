import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '../../styles/styles';

const MyInput = props => {
  return (
    <View style={localStyles.formFieldContainer}>
      <Text style={{ ...localStyles.label }}>{props.label}</Text>
      <TextInput {...props} style={localStyles.input} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  label: {
    color: colors.color,
    marginBottom: 5
  },
  input: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.color,
    borderBottomLeftRadius: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    width: '100%',
    color: colors.color
  },
  formFieldContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 10
  }
});

export default MyInput;
