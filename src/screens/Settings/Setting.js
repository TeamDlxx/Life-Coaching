import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Linking,
  Share,
  Alert,
  Image,
  Platform,
  FlatList,
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
import DeviceInfo from 'react-native-device-info';
import {deepLinkQuote} from '../../Utilities/domains';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

const Setting = props => {
  const [isLoading, setisLoading] = useState(false);
  const {Token, setToken, setHabitList, adminURLsAndEmail} =
    useContext(Context);
  console.log('adminURLsAndEmail', useContext(Context));
  const logout = async () => {
    try {
      let res = await AsyncStorage.multiRemove([
        '@token',
        '@user',
        '@isSubscribedToTopic',
      ]);
      console.log('res', res);
      setToken(null);
      setHabitList([]);
      messaging().unsubscribeFromTopic('qouteCreated');
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: screens.landing,
            params: {
              logout: true,
            },
          },
        ],
      });
      PushNotification.cancelAllLocalNotifications();
    } catch (e) {
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: screens.landing,
            params: {
              logout: true,
            },
          },
        ],
      });
      setHabitList([]);
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
        showToast('Something went wrong!', 'Error');
      }
    }
  };

  const api_deleteAccount = async () => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/customer/delete_customer',
      method: 'DELETE',
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
      case 'terms_of_use':
        try {
          let {terms_and_conditions_link} = adminURLsAndEmail;
          await Linking.openURL(terms_and_conditions_link);
        } catch (e) {
          console.log('Link Open Error', e);
        }
        break;

      case 'privacy_policy':
        try {
          let {privacy_policy_link} = adminURLsAndEmail;
          await Linking.openURL(privacy_policy_link);
        } catch (e) {
          console.log('Link Open Error', e);
        }
        break;

      case 'share_app':
        try {
          const result = await Share.share({
            title: 'Better.Me',
            message: `Please install this app, AppLink :${deepLinkQuote}`,
            url: deepLinkQuote,
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
        let url = 'market://details?id=com.coachingoflife.app';
        try {
          await Linking.openURL(url);
        } catch (e) {
          console.log('Link Open Error', e);
        }
        // FN_InAppReview();
        break;

      case 'report':
        fn_report();
        break;

      case 'delete_user':
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [{text: 'No'}, {text: 'Yes', onPress: () => api_deleteAccount()}],
        );

        break;

      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {text: 'No'},
          {text: 'Yes', onPress: () => api_LogOut()},
        ]);

        break;
    }
  };

  const fn_report = async () => {
    console.log('getUserEmail', await getUserEmail());
    let email = await getUserEmail();
    let subject = `Better.Me Feedback, Platform: ${
      Platform.OS
    }, Brand: ${DeviceInfo.getBrand()}, OS Version: ${DeviceInfo.getSystemVersion()}, App Version: ${VersionCheck.getCurrentVersion()} (${VersionCheck.getCurrentBuildNumber()})`;

    if (email) {
      subject = subject + `, User Email: ${email}`;
    }
    let {support_email} = adminURLsAndEmail;
    Linking.openURL(`mailto:${support_email}?subject=${subject}`).catch(e => {
      console.log('Mail open error', e);
    });
  };

  const getUserEmail = async () => {
    if (Token) {
      return await AsyncStorage.getItem('@user').then(async user => {
        if (user != null) {
          let newUser = await JSON.parse(user);
          console.log('newUser', newUser);
          return newUser.user_id.email;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  };

  const ItemView = ({item, index}) => {
    if ((item.id == 'logout' || item.id == 'delete_user') && !Token) {
      return;
    }

    return (
      <Pressable
        key={item.id}
        onPress={() => performAction(item.action)}
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
              item.id == 'logout' || item.id == 'delete_user'
                ? '#D24D5733'
                : '#BDC3C744',

            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Image
            source={item.icon}
            style={{
              height: 20,
              width: 20,
              tintColor:
                item.id == 'logout' || item.id == 'delete_user'
                  ? Colors.logout
                  : Colors.black,
            }}
          />
        </View>
        <View style={{flex: 1, marginLeft: 15}}>
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: 16,
              letterSpacing: 0.6,
              color:
                item.id == 'logout' || item.id == 'delete_user'
                  ? Colors.logout
                  : Colors.black,
            }}>
            {item.name}
          </Text>
        </View>
        <View>
          <Image
            source={require('../../Assets/Icons/right_arrow.png')}
            style={{
              height: 15,
              width: 15,
              tintColor:
                item.id == 'logout' || item.id == 'delete_user'
                  ? Colors.logout
                  : Colors.black,
            }}
          />
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  }, []);

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
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 30,
              paddingTop: 20,
            }}
            data={settings}
            renderItem={ItemView}
          />
        </View>

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
    name: 'Terms of Use',
    icon: require('../../Assets/Icons/ic_terms.png'),
    action: 'terms_of_use',
  },
  {
    id: '2',
    name: 'Privacy Policy',
    icon: require('../../Assets/Icons/ic_privacypolicy.png'),
    action: 'privacy_policy',
  },
  {
    id: '3',
    name: 'Report Problem',
    icon: require('../../Assets/Icons/problem.png'),
    action: 'report',
  },
  {
    id: '4',
    name: 'Share App',
    icon: require('../../Assets/Icons/shareApp.png'),
    action: 'share_app',
  },
  {
    id: '5',
    name: 'Rate Us',
    icon: require('../../Assets/Icons/star.png'),
    action: 'rate_us',
  },
  {
    id: 'delete_user',
    name: 'Delete Account',
    icon: require('../../Assets/Icons/removeUser.png'),
    action: 'delete_user',
  },

  {
    id: 'logout',
    name: 'Logout',
    icon: require('../../Assets/Icons/logout.png'),
    action: 'logout',
  },
];
