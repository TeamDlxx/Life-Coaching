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
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { mainStyles } from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import { screens } from '../../Navigation/Screens';
import * as Animatable from 'react-native-animatable';
import NotificationConfig from '../../Components/NotificationConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Context from '../../Context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import analytics from '@react-native-firebase/analytics';
import showToast from '../../functions/showToast';
import messaging from '@react-native-firebase/messaging';
import CustomBellIcon from '../../Components/CustomBellIcon';

const height = Dimensions.get('screen').width;

const home1 = require('../../Assets/Images/home3.jpg');
const home2 = require('../../Assets/Images/home2.jpg');
const home3 = require('../../Assets/Images/home4.jpg');
const home4 = require('../../Assets/Images/home1.jpg');
const home5 = require('../../Assets/Images/home6.jpg');
const home6 = require('../../Assets/Images/home5.jpg');

const Home = props => {
  const habit = React.useContext(Context);
  const [opt, setOpt] = useState([]);

  // console.log('TestIds.REWARDED', Admob_Ids.rewarded);
  // const rewarded = useRewardedAd(Admob_Ids.rewarded, {
  //   requestNonPersonalizedAdsOnly: true,
  //   contentUrl: 'https://reactnative.dev/',
  // });

  // if (rewarded.error) {
  //   console.log('rewarded.error', rewarded.error);
  // }

  // if (rewarded.isLoaded) {
  // console.log('rewarded.isLoaded', rewarded.isLoaded);
  // }

  // console.log('rewarded', rewarded);
  async function checkNotificationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      // await messaging().registerDeviceForRemoteMessages();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      // await messaging().registerDeviceForRemoteMessages();
    } else {
    }
  }

  // useEffect(() => {
  //   checkNotificationPermission();
  //   NotificationConfig(props);
  //   analytics().logEvent(props?.route?.name);
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //     setOpt(options);
  //   }, 500);

  //   return () => {
  //     // unsubscribeLoaded();
  //     // unsubscribeEarned();
  //   };
  // }, []);

  useEffect(() => {
    setOpt(options);
    analytics().logEvent(props?.route?.name);
  }, [])

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

  const onNextScreen = item => {
    if (!!item?.comingsoon) {
      props.navigation.navigate(screens.comingSoon, {
        title: item?.title,
      });
    } else if (!!item?.screen) {
      props.navigation.navigate(item?.screen);
    }
  };

  const showAd = async () => {
    console.log('rewarded', rewarded);
    if (rewarded.isLoaded == false) {
      rewarded.load();
    } else if (rewarded.isLoaded == true) {
      try {
        rewarded.show();
      } catch (e) {
        console.log('rewarded Error', e);
      }
    }
  };

  const ItemView = ({ item, index }) => {
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
          // elevation:3,
          // borderRadius: 25,
          borderRadius: 20,
          paddingTop: index % 2 != 0 ? 40 : 0,
          marginLeft: index % 2 == 0 ? 30 : 15,
          marginRight: index % 2 != 0 ? 30 : 15,
          // overflow:"hidden",
        }}>
        <Pressable
          onPress={() => onNextScreen(item)}
          style={{ borderRadius: 20, overflow: 'hidden', elevation: 3 }}>
          <Image source={item.image} style={{ height: 200, width: '100%' }} />

          <View
            style={{
              height: 200,
              padding: 20,
              position: 'absolute',
              // backgroundColor:item.color
            }}>
            <Text
              style={{
                color: '#f2f2f2',
                fontSize: 18,
                fontFamily: font.xbold,
                textShadowColor: Colors.gray12,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
                textTransform: 'capitalize',
              }}>
              {item.title}
            </Text>
          </View>
          {!!item.comingsoon && (
            <View
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 30,
                paddingVertical: 5,
                transform: [{ rotateZ: '-45deg' }],
                position: 'absolute',
                right: -35,
                bottom: 20,

                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 1.41,

                elevation: 3,
                zIndex: 2,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: font.medium,
                  fontSize: 10,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}>
                Coming Soon
              </Text>
            </View>
          )}
        </Pressable>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainViewForBottomTabScreens,
        { marginBottom: useBottomTabBarHeight() },
      ]}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <View
        style={{
          height: 50,
          justifyContent: 'center',
          marginLeft: 30,
          width: '100%',
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 50,
        }}>
        <View>
          <Image
            resizeMode="contain"
            source={require('../../Assets/app-icon/text.png')}
            style={{ height: 25.5, aspectRatio: 6 }}
          />
        </View>
        <CustomBellIcon
          onPress={() => props.navigation.navigate(screens.notificationScreen)}
        />
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, marginTop: 15 }}
          numColumns={2}
          data={opt}
          renderItem={ItemView}
        />
      </View>
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
    color: '#E394BB',
  },

  {
    id: '2',
    title: 'Meditation',
    image: home3,
    count: 8,
    screen: screens.meditation,
    color: '#67C9BA',
  },
  {
    id: '3',
    title: 'Quotes',
    image: home6,
    count: 4,
    screen: screens.qouteList,
    color: '#E48281',
  },

  {
    id: '5',
    title: 'Notes',
    image: home4,
    count: 3,
    screen: screens.notesList,
    color: '#C4BCB2',
    // comingsoon: true,
  },
  {
    id: '4',
    title: 'Mood Tracker',
    image: home2,
    count: 7,
    screen: screens.moodChart,
    color: '#A5A5DB',
    comingsoon: false,
  },
  {
    id: '6',
    title: 'Gratitude',
    image: home5,
    count: 7,
    screen: screens.gratitude,
    color: '#44BCDF',
    comingsoon: false,
  },
];
