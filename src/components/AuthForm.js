import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, Card, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import Spacer from './UI/Spacer';
import { colors, styles } from '../styles/styles';
import { Context as AuthContext } from '../context/AuthContext';
import MyInput from './UI/MyInput';
const AuthForm = ({
  title,
  buttonTitle,
  onSubmitClicked,
  navigation,
  navigationLabel,
  navigationLink,
  showSignUp,
  getMessageCount,
  showForgotPassword,
  showForgotPasswordPressed
}) => {
  const {
    handleSubmit,
    errors,
    setError,
    register,
    setValue,
    unregister
  } = useForm();
  const { checkUniqueScreenName, checkUniqueEmail } = useContext(AuthContext);

  useEffect(() => {
    if (showSignUp) {
      register(
        { name: 'screenName' },
        {
          minLength: {
            value: 3,
            message:
              'You have to provide a screen name of at least three characters'
          }
        }
      );
    }
    register(
      { name: 'email' },
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
      { name: 'password' },
      { required: 'You have to provide a password' }
    );
    return () => unregister(['screenName', 'email', 'password']);
  }, [register, showSignUp, unregister]);

  const onSubmit = async data => {
    const isScreenNameUnique = await checkUniqueScreenName(data.screenName);
    if (showSignUp) {
      const isEmailUnique = await checkUniqueEmail(data.email);
      if (!isEmailUnique) {
        setError(
          'email',
          'notUnique',
          'This email address is already taken, please choose a different one.'
        );
        return;
      }
    }
    if (!isScreenNameUnique) {
      setError(
        'screenName',
        'notUnique',
        'This screen name is already taken, please choose a different one.'
      );
      return;
    }

    onSubmitClicked(data, getMessageCount);
  };

  return (
    <View style={styles.cardContainer}>
      <Card title={title}>
        {showSignUp ? (
          <>
            <MyInput
              label="Choose a screen name"
              placeholder="Minimum of 3 characters"
              autoCapitalize="none"
              autoCorrect={false}
              name="screenName"
              onChangeText={text => setValue('screenName', text)}
              defaultValue=""
            />
            {errors.screenName && (
              <Text style={styles.error}>{errors.screenName.message}</Text>
            )}
          </>
        ) : null}
        <MyInput
          label="Your email address"
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          name="email"
          onChangeText={text => setValue('email', text)}
          defaultValue=""
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        <MyInput
          label="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          name="password"
          onChangeText={text => setValue('password', text)}
        />
        {errors.password && (
          <Text style={styles.error}>Your password is required</Text>
        )}
        <Button
          title={buttonTitle}
          onPress={
            // onSubmit({ email, password, screenName }, getMessageCount)
            handleSubmit(onSubmit)
          }
          icon={
            <Entypo
              name="login"
              style={{ paddingLeft: 30 }}
              size={18}
              color={colors.backgroundColor}
            />
          }
          iconRight
        />
      </Card>
      <Spacer />
      <TouchableOpacity onPress={() => navigation.navigate(navigationLink)}>
        <Text>{navigationLabel}</Text>
      </TouchableOpacity>
      {showForgotPassword ? (
        <View>
          <TouchableOpacity onPress={showForgotPasswordPressed}>
            <Text>I forgot my password</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default AuthForm;
