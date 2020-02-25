import React, { useContext, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { Text } from 'react-native-elements';
import { styles } from '../styles/styles';
import AuthForm from '../components/AuthForm';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as MessageContext } from '../context/MessageContext';
import { useFocusEffect } from '@react-navigation/native';

const UserLoginScreen = props => {
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  const { readMessage, cleanUpMessage } = useContext(MessageContext);

  useFocusEffect(
    useCallback(() => {
      // console.log('in focus');
      return () => {
        cleanUpMessage();
      };
    }, [cleanUpMessage])
  );

  const showAlert = () => {
    Alert.alert(
      'Error signing in',
      "Something went wrong when you tried to sign in. Perhaps you've misspelled your email or password?",
      [{ text: 'OK', onPress: () => clearErrorMessage() }],
      { cancelable: false }
    );
  };

  const sendForgottenPasswordLink = () => {
    props.navigation.navigate('ResetPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {state.flashMessage ? (
          <View>
            <Text>{state.flashMessage}</Text>
          </View>
        ) : null}
        <AuthForm
          showSignUp={false}
          title="Log in"
          buttonTitle="Sign in to Roylen"
          onSubmitClicked={signin}
          getMessageCount={readMessage}
          navigation={props.navigation}
          navigationLabel="No account yet? You can sign up here"
          navigationLink="Signup"
          showForgotPassword
          showForgotPasswordPressed={sendForgottenPasswordLink}
        />
        {state.errorMessage && props.navigation.isFocused()
          ? showAlert()
          : null}
      </View>
    </View>
  );
};
UserLoginScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

export default UserLoginScreen;
