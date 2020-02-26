import React from 'react';
import { View } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import { styles, colors } from '../styles/styles';

const MessageModal = ({ receiverName, closeForm, sendMsg }) => {
  const { handleSubmit, control, errors } = useForm();

  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };
  const onSubmit = data => {
    sendMsg(data.msg);
  };
  return (
    <View style={{ marginTop: 22 }}>
      <View style={{ marginTop: 22 }}>
        <Text style={styles.formText}>Message for {receiverName}</Text>
        <Controller
          as={<Input />}
          multiline
          label="Type your message"
          defaultValue=""
          control={control}
          onChange={onChange}
          rules={{ required: true, minLength: 3 }}
          name="msg"
        />
        {errors.msg && (
          <Text style={styles.error}>Minimum of 3 characters</Text>
        )}
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
            onPress={handleSubmit(onSubmit)}
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

export default MessageModal;
