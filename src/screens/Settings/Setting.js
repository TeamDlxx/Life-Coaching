import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Linking,
  Share,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import VersionCheck from 'react-native-version-check';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {screens} from '../../Navigation/Screens';
import showToast from '../../functions/showToast';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useContext} from 'react';
import Context from '../../Context';
import PushNotification from 'react-native-push-notification';

const Setting = props => {
  const [isLoading, setisLoading] = useState(false);
  const {Token, setToken} = useContext(Context);

  const logout = async () => {
    try {
      let res = await AsyncStorage.multiRemove(['@token', '@user']);
      console.log('res', res);
      setToken(null);
      props.navigation.reset({
        index: 0,
        routes: [{name: screens.landing}],
      });
      PushNotification.cancelAllLocalNotifications();
    } catch (e) {
      props.navigation.reset({
        index: 0,
        routes: [{name: screens.landing}],
      });
      PushNotification.cancelAllLocalNotifications();
    }
  };

  const api_LogOut = async obj => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/app_api/logout',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        logout();
      } else {
        setisLoading(false);
        logout();
      }
    }
  };

  const performAction = async type => {
    switch (type) {
      case 'share_app':
        try {
          const result = await Share.share({
            title: 'Life Coaching',
            message:
              'Please install this app and stay safe , AppLink :https://play.google.com/store/apps',
            url: 'https://play.google.com/store/apps',
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
        break;

      case 'rate_us':
        let url = 'https://www.google.com/';
        // Linking.openURL(url);

        const supported = await Linking.canOpenURL(url);

        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
        break;

      case 'report':
        Linking.openURL(
          'mailto:support@lifeCoaching.com?subject=Report a Problem',
        ).catch(e => {
          console.log('Mail open error', e);
        });
        break;

      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {text: 'No'},
          {text: 'Yes', onPress: () => api_LogOut()},
        ]);

        break;
    }
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainViewForBottomTabScreens,
        {marginBottom: useBottomTabBarHeight()},
      ]}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Settings" />

      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{paddingHorizontal: 30, marginTop: 40}}>
            {settings.map((x, i) => {
              if (x.id == 'logout' && !Token) {
                return;
              }
              return (
                <Pressable
                  key={x.id}
                  onPress={() => performAction(x.action)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor:
                        x.id == 'logout' ? '#D24D5733' : '#BDC3C744',

                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <Image
                      source={x.icon}
                      style={{
                        height: 20,
                        width: 20,
                        tintColor:
                          x.id == 'logout' ? Colors.logout : Colors.black,
                      }}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 15}}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        fontSize: 16,
                        letterSpacing: 0.6,
                        color: x.id == 'logout' ? Colors.logout : Colors.black,
                      }}>
                      {x.name}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../Assets/Icons/right_arrow.png')}
                      style={{
                        height: 15,
                        width: 15,
                        tintColor:
                          x.id == 'logout' ? Colors.logout : Colors.black,
                      }}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text
            style={{
              fontFamily: font.medium,
              letterSpacing: 0.5,
              color: Colors.black,
            }}>
            Version:
            <Text style={{fontFamily: font.bold, fontSize: 16}}>
              {' ' + VersionCheck.getCurrentVersion()}
            </Text>
          </Text>
        </View>
        <Loader enable={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default Setting;

const settings = [
  {
    id: '1',
    name: 'Share App',
    icon: require('../../Assets/Icons/shareApp.png'),
    action: 'share_app',
  },
  {
    id: '2',
    name: 'Rate Us',
    icon: require('../../Assets/Icons/star.png'),
    action: 'rate_us',
  },
  {
    id: '3',
    name: 'Report Problem',
    icon: require('../../Assets/Icons/problem.png'),
    action: 'report',
  },
  {
    id: 'logout',
    name: 'Logout',
    icon: require('../../Assets/Icons/logout.png'),
    action: 'logout',
  },
];
