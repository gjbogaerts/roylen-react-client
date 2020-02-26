import React, { useContext, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  ListItem,
  Text,
  ButtonGroup,
  Avatar,
  Overlay
} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Context as MessageContext } from '../context/MessageContext';
import { styles, colors } from '../styles/styles';
import { getBaseUrl } from '../api/axios';
import ContactForm from '../components/ContactForm';
import Message from '../models/Message';
import useAuthInfo from '../hooks/useAuthInfo';

const UserMessageScreen = () => {
  const { state, markRead, sendMessage, cleanUpMessage } = useContext(
    MessageContext
  );
  const [modalShow, setModalShow] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [currentAd, setCurrentAd] = useState(null);
  const [addressee, setAddressee] = useState(null);
  const [currentAdTitle, setCurrentAdTitle] = useState('');

  useFocusEffect(
    useCallback(() => {
      // do something when the screen is focused
      return () => {
        //do something when the screen is unfocused.
        setModalShow(false);
        setReplyTo(null);
        setCurrentAd(null);
        setAddressee(null);
        setCurrentAdTitle('');
        cleanUpMessage();
      };
    }, [cleanUpMessage])
  );

  const user = useAuthInfo();

  const passMessage = (userScreenName, msge, from, to, re, currentAdTitle) => {
    const msg = new Message(userScreenName, msge, from, to, re, currentAdTitle);
    sendMessage(msg);
  };

  const renderList = item => {
    // console.log(item);
    const markAsRead = () => (
      <View
        style={{
          ...styles.containerRow,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        <Ionicons
          name="ios-checkmark-circle-outline"
          size={24}
          color={colors.color}
          style={{ flex: 2, marginLeft: 10 }}
        />
        <Text style={{ flex: 5 }}>Mark as read</Text>
      </View>
    );
    const reply = () => (
      <View
        style={{
          ...styles.containerRow,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        <Text style={{ flex: 5, marginLeft: 40 }}>Reply</Text>
        <Ionicons
          name="ios-mail-open"
          size={24}
          color={colors.color}
          style={{ flex: 2, marginRight: 20 }}
        />
      </View>
    );
    const buttons = [{ element: markAsRead }, { element: reply }];
    const updateIndex = idx => {
      // console.log(item);
      switch (idx) {
        case 0:
          markRead(item._id);
          break;
        case 1:
          replyToSender(
            item.fromId._id,
            item._id,
            item.fromId.screenName,
            item.adTitle
          );
          break;
      }
    };

    const replyToSender = (creatorId, itemId, screenName, title) => {
      setReplyTo(creatorId);
      setCurrentAd(itemId);
      setAddressee(screenName);
      setCurrentAdTitle(title);
      setModalShow(true);
    };

    return (
      <ListItem
        style={{ backgroundColor: colors.backgroundColor }}
        title={`Re: ${item.adTitle}`}
        bottomDivider
        subtitle={
          <View>
            <View style={localStyles.subtitleView}>
              <Avatar
                rounded
                source={{ uri: getBaseUrl() + item.fromId.avatar }}
              />
              <Text style={localStyles.ratingText}>
                {item.fromId.screenName}
              </Text>
            </View>
            <Text style={localStyles.ratingText}>{item.message}</Text>

            <ButtonGroup
              style={localStyles.buttons}
              buttons={buttons}
              onPress={updateIndex}
            />
          </View>
        }
      />
    );
  };
  // console.log(user);
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {state.received.length === 0 ? <Text>No messages yet</Text> : null}
        <Text>You have {state.countMessage} messages</Text>
        {user && user._id ? (
          <Overlay
            isVisible={modalShow}
            onBackdropPress={() => setModalShow(false)}
            borderRadius={15}
          >
            <View>
              {!state.message && !state.errorMessage ? (
                <ContactForm
                  receiverName={addressee}
                  closeForm={() => setModalShow(false)}
                  sendMsg={msg =>
                    passMessage(
                      user.screenName,
                      msg,
                      user._id,
                      replyTo,
                      currentAd,
                      currentAdTitle
                    )
                  }
                />
              ) : (
                <Text>{state.message || state.errorMessage}</Text>
              )}
            </View>
          </Overlay>
        ) : null}
        <FlatList
          style={{ backgroundColor: colors.backgroundColor }}
          data={state.received}
          keyExtractor={item => item._id}
          renderItem={({ item }) => renderList(item)}
        />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  buttons: {
    flex: 1
  },
  ratingText: {
    flex: 1,
    paddingLeft: 10
  }
});
export default UserMessageScreen;
