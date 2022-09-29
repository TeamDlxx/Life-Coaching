import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import play from '../../../Assets/Icons/play.png';

import favIcon from '../../../Assets/TrackPlayer/favIcon.png';
const FavouriteTracks = props => {
  const [trackList, setTrackList] = useState([]);

  //? Navigation Functions

  useEffect(() => {
    setTrackList(tracksList);
  }, []);

  const gotoTrackPlayer = item => {
    props.navigation.navigate(screens.trackPlayer, {
      item: item,
      category: {_id: '1', name: 'Breathe'},
    });
  };

  const unLike = index => {
    let newArray = [...trackList];
    newArray.splice(index, 1);
    setTrackList(newArray);
  };

  //? Views

  const renderTrackList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoTrackPlayer(item);
        }}
        activeOpacity={1}
        style={{
          marginBottom: 20,
          alignItems: 'center',
          borderRadius: 20,
          paddingHorizontal: 10,
          flexDirection: 'row',
          marginHorizontal: 12,
          minHeight: 70,
        }}>
        <View
          style={{
            height: 70,
            width: 70,
            borderRadius: 26,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: Colors.gray02,
          }}>
          <Image source={{uri: item.image}} style={{height: 70, width: 70}} />
        </View>
        <View style={{marginLeft: 15, flex: 1}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 16,
              includeFontPadding: false,
              color: Colors.black,
            }}>
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                fontFamily: font.medium,
                color: Colors.text,
                fontSize: 12,
              }}>
              {item.note}
            </Text>
          </View>
        </View>
        <View style={{}}>
          <TouchableHighlight
            underlayColor={Colors.lightPrimary}
            onPress={() => unLike(index)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: Colors.white,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.gray02,
              borderWidth: 1,
            }}>
            <Image
              style={{
                height: 18,
                width: 18,
                tintColor: Colors.primary,
              }}
              source={favIcon}
            />
          </TouchableHighlight>
        </View>
      </TouchableOpacity>
    );
  };

  const onFavList = () => {
    props.navigation.navigate(screens.favTracks);
  };
  // Modal

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header navigation={props.navigation} title={'Favorite Tracks'} />
      <View style={mainStyles.innerView}>
        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            stickyHeaderHiddenOnScroll={true}
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            data={trackList}
            renderItem={renderTrackList}
            keyExtractor={item => {
              return item._id;
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FavouriteTracks;

const tracksList = [
  {
    _id: '1',
    title: 'Relax',
    note: 'Release the tention',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '2',
    title: 'Breathe',
    note: 'Nature',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '3',
    title: 'Sleep',
    note: 'deep sleep',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },

  {
    _id: '4',
    title: 'Relax',
    note: 'Release the tention',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '5',
    title: 'Breathe',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    note: 'Nature',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '6',
    title: 'Sleep',
    note: 'deep sleep',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },
];
