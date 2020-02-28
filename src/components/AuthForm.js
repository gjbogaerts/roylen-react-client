import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, Card, Input, Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Spacer from './UI/Spacer';
import { colors, styles } from '../styles/styles';
import { Context as AuthContext } from '../context/AuthContext';

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
  const { control, handleSubmit, errors, setError } = useForm();
  const { checkUniqueScreenName, checkUniqueEmail } = useContext(AuthContext);

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
  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };

  return (
    <View style={styles.cardContainer}>
      <Card title={title}>
        {showSignUp ? (
          <>
            <Controller
              as={<Input />}
              label="Choose a screen name"
              placeholder="Minimum of 3 characters"
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              name="screenName"
              onChange={onChange}
              rules={{ required: true, minLength: 3 }}
              defaultValue=""
            />
            {errors.screenName && (
              <Text style={styles.error}>
                {errors.screenName.message || 'Minimum of 3 characters'}
              </Text>
            )}
          </>
        ) : null}
        <Controller
          as={<Input />}
          label="Your email address"
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          control={control}
          name="email"
          onChange={onChange}
          rules={{
            required: true,
            // eslint-disable-next-line no-useless-escape
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
          }}
          defaultValue=""
        />
        {errors.email && (
          <Text style={styles.error}>
            {errors.email.message ||
              'You need to fill out a valid email address'}
          </Text>
        )}
        <Controller
          as={<Input />}
          label="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          control={control}
          name="password"
          onChange={onChange}
          rules={{ required: true }}
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
