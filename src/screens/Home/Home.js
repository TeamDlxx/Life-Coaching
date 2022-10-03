import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  ImageBackground,
  Dimensions,
  Platform,
  Pressable,
  Share,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {mainStyles} from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import {screens} from '../../Navigation/Screens';
import * as Animatable from 'react-native-animatable';
import NotificationConfig from '../../Components/NotificationConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
const height = Dimensions.get('screen').width;

// background

const home1 = require('../../Assets/Images/home3.jpg');
const home2 = require('../../Assets/Images/home2.jpg');
const home3 = require('../../Assets/Images/home4.jpg');
const home4 = require('../../Assets/Images/home1.jpg');
const home5 = require('../../Assets/Images/home6.jpg');
const home6 = require('../../Assets/Images/home5.jpg');

const Home = props => {
  
  useEffect(() => {
    NotificationConfig(props);
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  const onDisplayNotification = async () => {
    const token = await AsyncStorage.getItem('@firebaseToken');
    console.log(token);
    try {
      const result = await Share.share({
        title: 'Firebase Token',
        message: token,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onNextScreen = screen => {
    if (!!screen) {
      props.navigation.navigate(screen);
    }
  };

  const ItemView = ({item, index}) => {
    let count = index < 2 ? 3 : index < 4 ? 2 : 1;
    return (
      <Animatable.View
        useNativeDriver
        // entering={BounceInUp.delay(count * 250)}
        animation={'bounceInDown'}
        delay={count * 250}
        key={item.id}
        style={{
          // margin: 10,
          flex: 1 / 2,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          // borderRadius: 25,
          borderRadius: 20,
          paddingTop: index % 2 != 0 ? 40 : 0,
          marginLeft: index % 2 == 0 ? 30 : 15,
          marginRight: index % 2 != 0 ? 30 : 15,
        }}>
        <Pressable
          onPress={() => onNextScreen(item.screen)}
          style={{borderRadius: 20, overflow: 'hidden', elevation: 3}}>
          <ImageBackground
            source={item.image}
            style={{height: 200, padding: 20}}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 16,
                fontFamily: font.xbold,
              }}>
              {item.title}
            </Text>
          </ImageBackground>
        </Pressable>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainViewForBottomTabScreens}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <>
        <Pressable
          disabled={true}
          onPress={() => {
            onDisplayNotification();
          }}
          style={{
            height: 50,
            justifyContent: 'center',
            paddingHorizontal: 30,
          }}>
          <Text style={{fontSize: 20, fontFamily: font.bold, letterSpacing: 2}}>
            LIFE COACHING
          </Text>
        </Pressable>

        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20, marginTop: 10}}
            bounces={false}
            numColumns={2}
            data={options}
            renderItem={ItemView}
          />
        </View>
      </>
    </SafeAreaView>
  );
};

export default Home;

const options = [
  {
    id: '1',
    title: 'Habit Tracker',
    image: home1,
    count: 5,
    screen: screens.habitTracker,
  },

  {
    id: '2',
    title: 'Mood Tracker',
    image: home2,
    count: 7,
    screen: screens.moodTracker,
  },

  {
    id: '3',
    title: 'Meditation',
    image: home3,
    count: 8,
    screen: screens.meditation,
  },

  {
    id: '4',
    title: 'Time Table',
    image: home4,
    count: 3,
    screen: screens.timeTable,
  },

  {
    id: '5',
    title: 'Gratitude',
    image: home5,
    count: 7,
    screen: screens.gratitude,
  },

  {
    id: '6',
    title: 'Quote',
    image: home6,
    count: 4,
    screen: screens.qouteList,
  },
];
