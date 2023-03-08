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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import play from '../../../Assets/Icons/play.png';

import anxious from '../../../Assets/meditationIcons/anxious.png';
import breathe from '../../../Assets/meditationIcons/breathe.png';
import focus from '../../../Assets/meditationIcons/focus.png';
import morning from '../../../Assets/meditationIcons/morning.png';
import sleep from '../../../Assets/meditationIcons/sleep.png';

const Gratitude = props => {
  const [categoryList, setCategoryList] = useState([
    {_id: '1', name: 'Breathe', image: breathe},
    {_id: '2', name: 'Anxious', image: anxious},
    {_id: '3', name: 'Focus', image: focus},
    {_id: '4', name: 'Morning', image: morning},
    {_id: '5', name: 'Sleep', image: sleep},
  ]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: '1',
    name: 'Breathe',
    image: breathe,
  });
  const [trackList, setTrackList] = useState([]);

  //? Navigation Functions

  useEffect(() => {
    setTrackList(tracksList);
  }, []);

  const gotoTrackPlayer = item => {
    props.navigation.navigate(screens.trackPlayer, {item: item});
  };

  //? Views

  const renderCategories = ({item, index}) => {
    return (
      <View>
        <Pressable
          onPress={() => setSelectedCategory(item)}
          style={{
            margin: 6,
            alignItems: 'center',
            justifyContent: 'center',
            // padding: 10,
            borderRadius: 20,
            borderColor: Colors.gray07,
            borderWidth: 0.8,
            backgroundColor:
              item._id == selectedCategory._id ? Colors.lightPrimary : Colors.white,
            paddingHorizontal: 15,
            height: 60,
            width: 60,
          }}>
          <View>
            <Image
              style={
                item._id == selectedCategory._id
                  ? {width: 30, height: 30, tintColor: Colors.white}
                  : {width: 30, height: 30}
              }
              source={item.image}
            />
          </View>
        </Pressable>
        <Text
        
          style={{
            fontFamily: font.medium,
            color: Colors.black,
            textAlign: 'center',
            fontSize: 12,
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

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
          <TouchableOpacity
            activeOpacity={1}
            style={{padding: 10}}
            //   onPress={() => checkboxButton(item)}
          >
            <TouchableOpacity
              onPress={() => {
                gotoTrackPlayer(item);
              }}
              style={{
                width: 35,
                height: 35,
                backgroundColor: Colors.white,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: Colors.primary,
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 5,
              }}>
              <Image
                style={{
                  height: 18,
                  width: 18,
                  //   tintColor:Colors.primary
                }}
                source={play}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const flatListHeader = () => {
    return (
      <View style={{paddingHorizontal: 20, backgroundColor: Colors.background}}>
        <View style={{marginHorizontal: -20, marginTop: 0}}>
          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}
            data={categoryList}
            horizontal={true}
            renderItem={renderCategories}
          />
        </View>
        <View style={{marginTop: 5, marginBottom: 25}}>
          {/* <Text style={other_style.labelText}>All Habits</Text> */}
        </View>
      </View>
    );
  };

  // Modal

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header
        navigation={props.navigation}
        title={'Gratitude'}
        // titleAlignLeft
      />
      <View style={mainStyles.innerView}>
        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={flatListHeader()}
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

export default Gratitude;

const tracksList = [
  {
    _id: '1',
    title: 'Relax',
    note: 'Release the tention',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '2',
    title: 'Breathe',
    note: 'Nature',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '3',
    title: 'Sleep',
    note: 'deep sleep',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },

  {
    _id: '4',
    title: 'Relax',
    note: 'Release the tention',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '5',
    title: 'Breathe',
    note: 'Nature',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '6',
    title: 'Sleep',
    note: 'deep sleep',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },
];
