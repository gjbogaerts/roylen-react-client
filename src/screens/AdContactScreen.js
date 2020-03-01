import React, { useContext, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text, Card } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { colors, styles } from '../styles/styles';
import { Context as MessageContext } from '../context/MessageContext';
import MyInput from '../components/UI/MyInput';
import Message from '../models/Message';
import Spacer from '../components/UI/Spacer';
import useAuthInfo from '../hooks/useAuthInfo';

const AdContactScreen = ({ route, navigation }) => {
  const currentAd = route.params.concerning;
  const { state, sendMessage, cleanUpMessage } = useContext(MessageContext);
  const { register, setValue, handleSubmit, errors, unregister } = useForm();

  const user = useAuthInfo();

  useEffect(() => {
    register(
      {
        name: 'name'
      },
      { required: 'You have to provide your name' }
    );
    register(
      { name: 'message' },
      {
        minLength: {
          value: 2,
          message: 'You have to provide a message of at least two characters'
        }
      }
    );
    return unregister(['name', 'message']);
  }, [register, unregister]);

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
            <MyInput
              label="Your name"
              name="name"
              defaultValue=""
              onChangeText={text => setValue('name', text)}
              autoCorrect={false}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}
            <MyInput
              label="Your message"
              scrollEnabled={false}
              multiline
              name="message"
              defaultValue=""
              onChangeText={text => setValue('message', text)}
            />
            {errors.message && (
              <Text style={styles.error}>{errors.message.message}</Text>
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
