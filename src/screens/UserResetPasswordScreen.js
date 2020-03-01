import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../styles/styles';
import { Context as AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import MyInput from '../components/UI/MyInput';

const ResetPasswordScreen = () => {
  const { state, sendResetPasswordEmail, resetPassword } = useContext(
    AuthContext
  );
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    errors,
    getValues
  } = useForm();

  const sendMail = data => {
    sendResetPasswordEmail(data.email);
  };

  useEffect(() => {
    register(
      {
        name: 'email'
      },
      {
        required: 'You have to provide an email address',
        pattern: {
          // eslint-disable-next-line no-useless-escape
          value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
          message: 'This is not a valid email address'
        }
      }
    );
    register(
      {
        name: 'secretKey'
      },
      {
        required:
          'We need the secret key we sent you in order for you to reset your password'
      }
    );
    register(
      {
        name: 'pw1'
      },
      { required: 'You need to choose a password' }
    );
    register(
      {
        name: 'pw2'
      },
      {
        required: 'You need to re-type your password',
        validate: value =>
          value === getValues().pw1 || 'The passwords do not match'
      }
    );
    return () => unregister(['email', 'secretKey', 'pw1', 'pw2']);
  }, [register, unregister, getValues]);

  const dispatchResetPassword = data => {
    resetPassword(data.secretKey, data.pw1);
  };

  const renderFirstMessage = () => {
    if (state.errorMessage) {
      return <Text style={styles.error}>{state.errorMessage}</Text>;
    } else if (state.flashMessage) {
      return <Text>{state.flashMessage}</Text>;
    } else {
      return null;
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text h4>Reset password</Text>
        <View style={styles.cardContainer}>
          <Card title="Send reset email">
            <>
              <MyInput
                label="Email"
                placeholder="Please enter your email address"
                name="email"
                onChangeText={value => setValue('email', value)}
                keyboardType="email-address"
                returnKeyType="send"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
              {renderFirstMessage()}
              <Button title="Send" onPress={handleSubmit(sendMail)} />
            </>
          </Card>
          <Card title="Reset password">
            <MyInput
              label="Secret key"
              placeholder="You received it in your mail"
              name="secretKey"
              onChangeText={value => setValue('secretKey', value)}
            />
            {errors.secretKey && (
              <Text style={styles.error}>{errors.secretKey.message}</Text>
            )}
            <MyInput
              label="Your new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={val => setValue('pw1', val)}
              name="pw1"
            />
            {errors.pw1 && (
              <Text style={styles.error}>{errors.pw1.message}</Text>
            )}
            <MyInput
              label="Repeat your new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={val => setValue('pw2', val)}
              name="pw2"
            />
            {errors.pw2 && (
              <Text style={styles.error}>{errors.pw2.message}</Text>
            )}
            <Button
              title="Reset password"
              onPress={handleSubmit(dispatchResetPassword)}
            />
          </Card>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// const styles = StyleSheet.create({});

export default ResetPasswordScreen;
