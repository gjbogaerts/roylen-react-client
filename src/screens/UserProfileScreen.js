import React, { useContext, useState, Fragment, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Button, Text, Card, ButtonGroup, Avatar } from 'react-native-elements';
import { useForm } from 'react-hook-form';
import { styles, colors } from '../styles/styles';
import { getBaseUrl } from '../api/axios';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as AdContext } from '../context/AdContext';
import Spacer from '../components/UI/Spacer';
import MyOverlay from '../components/UI/MyOverlay';
import Ads from '../components/Ads';
import useAuthInfo from '../hooks/useAuthInfo';
import MyInput from '../components/UI/MyInput';

const UserProfileScreen = () => {
  const { signout, updateProfileInfo, checkUniqueEmail } = useContext(
    AuthContext
  );
  const { state, getUserAds, getSavedAds, deleteAd, getAd } = useContext(
    AdContext
  );
  const [profilePic, setProfilePic] = useState('');
  const [adsVisible, setAdsVisible] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const [useSaved, setUseSaved] = useState(false);
  const user = useAuthInfo();

  const {
    handleSubmit,
    errors,
    setError,
    register,
    unregister,
    setValue
  } = useForm();

  useEffect(() => {
    register(
      {
        name: 'email'
      },
      {
        required: 'You need to fill out an email address',
        pattern: {
          // eslint-disable-next-line no-useless-escape
          value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
          message: 'This is not a valid email address'
        }
      }
    );
    return () => unregister('email');
  }, [register, unregister, setValue, user]);

  const showUserAds = async () => {
    const userAds = await getUserAds(user._id);
    setMyAds(userAds);
    setUseSaved(false);
    setAdsVisible(true);
  };

  const showSavedAds = async () => {
    const savedAds = await getSavedAds(user._id);
    setMyAds(savedAds);
    setUseSaved(true);
    setAdsVisible(true);
  };

  const handleProfileChange = async data => {
    let { email } = data;
    if (email !== user.email) {
      const isUnique = await checkUniqueEmail(email);
      if (!isUnique) {
        setError(
          'email',
          'notUnique',
          'This email address is already in use; please use another email address.'
        );
        return;
      }
    }
    if (!email) {
      email = user.email;
    }
    updateProfileInfo(email, profilePic);
  };

  const printUserData = () => {
    const selectCamera = <Text>Camera</Text>;
    const selectCameraRoll = <Text>Photo Library</Text>;

    const startCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Need permission',
          'If you want to change your profile picture, this app needs access to your camera',
          [{ text: 'OK' }],
          { cancelable: true }
        );
        return;
      } else {
        const pickedImage = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1]
        });
        setProfilePic(pickedImage);
      }
    };

    const startPhotoLib = async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Need permission',
          'If you want to change your profile picture, this app needs access to your photo library',
          [{ text: 'OK' }],
          { cancelable: false }
        );
        return;
      } else {
        const pickedImage = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          allowsMultipleSelection: false,
          aspect: [1, 1]
        });
        setProfilePic(pickedImage);
      }
    };

    const updateIndex = index => {
      switch (index) {
        case 0:
          startCamera();
          break;
        case 1:
          startPhotoLib();
          break;
      }
    };

    return (
      <Fragment>
        <View style={styles.cardContainer}>
          <Card>
            <View style={styles.containerRow}>
              <View style={localStyles.avatar}>
                <Avatar
                  source={{ uri: getBaseUrl() + user.avatar }}
                  size="medium"
                  rounded
                  PlaceholderContent={<ActivityIndicator />}
                />
              </View>
              <View style={localStyles.profileInfo}>
                <Text>Screen name: {user.screenName}.</Text>
                <Text>Current credit: {user.nix} nix.</Text>
              </View>
            </View>

            <Spacer />
            <MyInput
              label="Your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              name="email"
              onChangeText={value => setValue('email', value)}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
            <Text style={{ marginLeft: 10 }}>
              Choose a profile picture from:
            </Text>
            <ButtonGroup
              buttons={[selectCamera, selectCameraRoll]}
              onPress={updateIndex}
            />
            <Button
              title="Submit"
              onPress={handleSubmit(handleProfileChange)}
            />
          </Card>
        </View>
      </Fragment>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <MyOverlay
        isVisible={adsVisible}
        onBackdropPress={() => setAdsVisible(false)}
      >
        <Ads
          showDelete={useSaved ? false : true}
          getAd={getAd}
          removeOverlay={() => setAdsVisible(false)}
          ads={myAds}
          message={state.message}
          onDeletePressed={item => {
            deleteAd(item._id, user._id);
          }}
        />
      </MyOverlay>
      <View style={styles.contentContainer}>
        <View style={styles.containerRow}>
          <Button title="Your ads" onPress={showUserAds} />
          <Button title="Your favorites" onPress={showSavedAds} />
          <Button
            title="Log out"
            onPress={signout}
            buttonStyle={{
              ...styles.Button.buttonStyle,
              backgroundColor: colors.accentedColor
            }}
            titleStyle={{
              ...styles.Button.titleStyle,
              color: colors.color
            }}
            containerStyle={{
              ...styles.Button.containerStyle
            }}
          />
        </View>
        <Text h4>Your Profile</Text>
        {user ? printUserData() : null}
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  avatar: {
    justifyContent: 'center'
  },
  profileInfo: {
    marginLeft: 15
  }
});

export default UserProfileScreen;
