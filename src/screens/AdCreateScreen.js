import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Button,
  ButtonGroup,
  CheckBox,
  Tooltip,
  Alert
} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useForm, Controller } from 'react-hook-form';
import { styles } from '../styles/styles';
import categories from '../models/Categories';
import PickerModal from 'react-native-picker-modal-view';
import Ad from '../models/Ad';
import MyInput from '../components/UI/MyInput';
import { Context as AdContext } from '../context/AdContext';
import useAuthInfo from '../hooks/useAuthInfo';

const AdCreateScreen = () => {
  const [category, setCategory] = useState(null);
  const [virtualPrice, setVirtualPrice] = useState('');
  const [pics, setPics] = useState(null);
  const [wanted, setWanted] = useState(false);
  const [error, setErrorMessage] = useState('');
  const [location, setLocation] = useState(null);
  const { placeAd } = useContext(AdContext);
  const { handleSubmit, control, errors } = useForm();
  const user = useAuthInfo();
  const selectCamera = <Text>Camera</Text>;
  const selectCameraRoll = <Text>Photo Library</Text>;

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage(
        'It is not permitted to establish your location on this device'
      );
    }
    let l = await Location.getCurrentPositionAsync();
    setLocation(l);
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

  const startCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Need permission',
        'If you want to add pictures, this app needs access to your camera',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return;
    } else {
      const pickedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      setPics(pickedImage);
    }
  };

  const startPhotoLib = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Need permission',
        'If you want to add pictures, this app needs access to your photo library',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    } else {
      const pickedImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      setPics(pickedImage);
    }
  };

  const onChange = args => {
    return {
      value: args[0].nativeEvent.text
    };
  };

  const submitAd = data => {
    const { latitude, longitude } = location.coords;
    const locationToSave = { longitude, latitude };
    const ad = new Ad(
      data.title,
      data.description,
      category,
      virtualPrice,
      pics,
      user._id,
      wanted,
      locationToSave
    );
    // console.log(ad);
    placeAd(ad);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text h4>Create a new ad</Text>
        <View style={{ ...styles.cardContainer, paddingVertical: 0 }}>
          <Card title="Ad details">
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <CheckBox
              containerStyle={{
                backgroundColor: 'transparent',
                borderColor: 'transparent'
              }}
              checked={wanted}
              onPress={() => setWanted(!wanted)}
              right
              size={20}
              title={
                <Tooltip
                  popover={
                    <Text style={styles.tooltipTextStyle}>
                      If you check this box, you will place an ad in the
                      &lsquo;wanted&rsquo; category. Uncheck it to get your item
                      in the &lsquo;offered&rsquo; category.
                    </Text>
                  }
                  height={100}
                  width={300}
                >
                  <Text>Wanted?</Text>
                </Tooltip>
              }
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />

            <Controller
              as={<MyInput />}
              label="Title"
              placeholder="Min 5, max. 50 chars"
              name="title"
              defaultValue=""
              onChange={onChange}
              control={control}
              rules={{ required: true, minLength: 5, maxLength: 50 }}
            />
            {errors.title && (
              <Text style={styles.error}>Minimum 5, maximum 50 characters</Text>
            )}

            <Controller
              as={<MyInput />}
              label="Description"
              placeholder="Describe the object in max 5200 chars"
              multiline
              name="description"
              onChange={onChange}
              control={control}
              rules={{ required: true, maxLength: 5200 }}
            />
            {errors.description && (
              <Text style={styles.error}>
                This field is required, maximum 5200 characters
              </Text>
            )}
            <MyInput
              label="Your price"
              placeholder="Set your price in nix, only whole numbers"
              value={virtualPrice}
              onChangeText={setVirtualPrice}
            />
            <PickerModal
              items={categories}
              showAlphabeticalIndex
              autoSort
              onSelected={item => {
                setCategory(item.Value);
              }}
              selectPlaceholderText="Pick a category"
              searchPlaceholderText="Search a category"
            />

            <Text style={{ marginLeft: 10 }}>
              Select a photo from your picture library or take a picture with
              your camera
            </Text>
            <ButtonGroup
              buttons={[selectCamera, selectCameraRoll]}
              onPress={updateIndex}
            />
            <Button title="Place your ad" onPress={handleSubmit(submitAd)} />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdCreateScreen;
