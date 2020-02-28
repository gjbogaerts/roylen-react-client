import React, { useContext, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { styles, colors } from '../styles/styles';
import { Context as AdContext } from '../context/AdContext';
import { getBaseUrl } from '../api/axios';
import { Ionicons } from '@expo/vector-icons';
import useAuthInfo from '../hooks/useAuthInfo';
// import GallerySwiper from 'react-native-gallery-swiper';

const AdsDetailScreen = ({ navigation }) => {
  const { state, sendWarning } = useContext(AdContext);
  const [alert, setAlert] = useState('');

  navigation.setOptions({ title: state.currentAd.title });
  const user = useAuthInfo();
  const imageUri = state.currentAd.pics.map(img => {
    return getBaseUrl() + img;
  });
  const currentAd = state.currentAd;
  const date = new Date(currentAd.dateAdded);
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  const showDate = date.toLocaleDateString('nl-NL', dateOptions);

  const warnAdmin = async () => {
    await sendWarning(currentAd._id);
    setAlert(state.message);
  };

  if (alert) {
    Alert.alert('Thank you', alert, ['OK']);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {/* <GallerySwiper
					images={images}
					resizeMode="contain"
					style={{
						backgroundColor: colors.backgroundColor,
						width: '100%',
						height: 300
					}}
				/> */}
        <Text h4>{currentAd.title}</Text>
        <TouchableOpacity style={styles.alertButton} onPress={warnAdmin}>
          <Ionicons name="ios-alert" color={colors.errorColor} size={24} />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUri[0] }}
          style={{ width: 400, height: 400 }}
        />

        <View style={styles.cardContainer}>
          <Card title={currentAd.title}>
            <Text>Virtual Price: {currentAd.virtualPrice} nix</Text>
            <Text style={styles.caption}>
              Placed on {showDate} by {currentAd.creator.screenName} in category{' '}
              {currentAd.category}
            </Text>
            {user ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AdContact', { concerning: currentAd })
                }
                style={styles.alertButton}
              >
                <Ionicons
                  name="ios-mail"
                  size={24}
                  color={colors.color}
                  style={{ marginTop: 5, marginRight: 10 }}
                />
                <Text style={styles.link}>
                  Contact {currentAd.creator.screenName}!
                </Text>
              </TouchableOpacity>
            ) : (
              <Text>
                You need to be logged in to contact{' '}
                {currentAd.creator.screenName}
              </Text>
            )}
          </Card>
        </View>
        <Text>{currentAd.description}</Text>
      </ScrollView>
    </View>
  );
};

AdsDetailScreen.navigationOptions = () => {
  return {
    headerShown: true
  };
};

export default AdsDetailScreen;
