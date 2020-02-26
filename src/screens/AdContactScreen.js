import React, { useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text, Card, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import { colors, styles } from '../styles/styles';
import { Context as MessageContext } from '../context/MessageContext';
import Message from '../models/Message';
import Spacer from '../components/UI/Spacer';
import useAuthInfo from '../hooks/useAuthInfo';

const AdContactScreen = ({ route, navigation }) => {
  const currentAd = route.params.concerning;
  const { state, sendMessage, cleanUpMessage } = useContext(MessageContext);
  const { control, handleSubmit, errors } = useForm();

  const user = useAuthInfo();

  useFocusEffect(
    useCallback(() => {
      // do something when the screen is focused
      return () => {
        //do something when the screen is unfocused.
        cleanUpMessage();
      };
    }, [cleanUpMessage])
  );

  if (state.message) {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <Card title={`Contact ${currentAd.creator.screenName}`}>
            <Text>{state.message} </Text>
          </Card>
        </View>
      </View>
    );
  }

  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };

  const startSendSequence = data => {
    const msg = new Message(
      data.name,
      data.message,
      user._id,
      currentAd.creator._id,
      currentAd._id,
      currentAd.title
    );
    sendMessage(msg);
  };

  return (
    <KeyboardAwareScrollView behavior="padding">
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <Card title={`Contact ${currentAd.creator.screenName}`}>
            <Text style={styles.formText}>Regards: {currentAd.title}</Text>
            <Spacer />
            {state.errorMessage ? (
              <Text style={{ ...styles.error, ...styles.formText }}>
                {state.errorMessage}
              </Text>
            ) : null}
            <Controller
              as={<Input />}
              label="Your name"
              name="name"
              defaultValue=""
              control={control}
              onChange={onChange}
              autoCorrect={false}
              rules={{ required: true }}
            />
            {errors.name && (
              <Text style={styles.error}>This field is required</Text>
            )}
            <Controller
              as={<Input />}
              label="Your message"
              scrollEnabled={false}
              multiline
              name="message"
              defaultValue=""
              control={control}
              onChange={onChange}
              rules={{ required: true, minLength: 3 }}
            />
            {errors.message && (
              <Text style={styles.error}>
                You need to provide a message of at least 3 characters
              </Text>
            )}
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
                onPress={() => navigation.goBack()}
              />
              <Button
                title="Send"
                onPress={handleSubmit(startSendSequence)}
                buttonStyle={{ ...styles.Button.buttonStyle }}
                containerStyle={{
                  ...styles.Button.containerStyle,
                  flex: 2,
                  marginLeft: 10
                }}
              />
            </View>
          </Card>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AdContactScreen;
