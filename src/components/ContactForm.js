import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { useForm } from 'react-hook-form';
import { styles, colors } from '../styles/styles';
import MyInput from './UI/MyInput';

const MessageModal = ({ receiverName, closeForm, sendMsg }) => {
  const { handleSubmit, errors, setValue, register, unregister } = useForm();

  useEffect(() => {
    register(
      {
        name: 'msg'
      },
      {
        minLength: {
          value: 2,
          message: 'You need to type in a message of at least two characters'
        }
      }
    );
    return () => unregister('msg');
  }, [register, unregister]);

  const onSubmit = data => {
    sendMsg(data.msg);
  };
  return (
    <View style={{ marginTop: 22 }}>
      <View style={{ marginTop: 22 }}>
        <Text style={styles.formText}>Message for {receiverName}</Text>
        <MyInput
          multiline
          label="Type your message"
          defaultValue=""
          onChangeText={text => setValue('msg', text)}
          name="msg"
        />
        {errors.msg && <Text style={styles.error}>{errors.msg.message}</Text>}
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
