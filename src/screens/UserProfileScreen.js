import React, { useContext, useState, Fragment } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Button,
  Text,
  Card,
  Input,
  ButtonGroup,
  Avatar
} from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import { styles } from '../styles/styles';
import { getBaseUrl } from '../api/axios';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as AdContext } from '../context/AdContext';
import Spacer from '../components/UI/Spacer';
import MyOverlay from '../components/UI/MyOverlay';
import Ads from '../components/Ads';
import useAuthInfo from '../hooks/useAuthInfo';

const UserProfileScreen = () => {
  const { signout, updateProfileInfo } = useContext(AuthContext);
  const { state, getUserAds, deleteAd } = useContext(AdContext);
  const [profilePic, setProfilePic] = useState('');
  const [adsVisible, setAdsVisible] = useState(false);
  const [myAds, setMyAds] = useState([]);
  const { handleSubmit, control, errors } = useForm();
  const user = useAuthInfo();

  const showUserAds = async () => {
    const userAds = await getUserAds(user._id);
    setMyAds(userAds);
    setAdsVisible(true);
  };
  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };

  const handleProfileChange = data => {
    const { email } = data;
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
            <Spacer />
            <Controller
              as={<Input />}
              label="Your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              name="email"
              defaultValue=""
              onChange={onChange}
              control={control}
              rules={{
                required: true,
                // eslint-disable-next-line no-useless-escape
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
              }}
            />
            {errors.email && (
              <Text style={styles.error}>
                This is not a well-formed email address; please try again.
              </Text>
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
          ads={myAds}
          message={state.message}
          onDeletePressed={item => {
            deleteAd(item._id, user._id);
          }}
        />
      </MyOverlay>
      <View style={styles.contentContainer}>
        <Text h4>Your Profile</Text>
        {user ? printUserData() : null}

        <Button title="See your current ads" onPress={showUserAds} />
        <Button title="Log out" onPress={signout} />
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
