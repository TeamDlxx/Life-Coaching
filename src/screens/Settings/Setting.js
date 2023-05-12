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
import React, { useState, useEffect } from 'react';
import VersionCheck from 'react-native-version-check';
import { mainStyles } from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { screens } from '../../Navigation/Screens';
import showToast from '../../functions/showToast';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import Context from '../../Context';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import { androidAppLink, deepLinkQuote, iosAppLink } from '../../Utilities/domains';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import * as RNIap from 'react-native-iap';
import CustomBellIcon from '../../Components/CustomBellIcon';

const Setting = props => {
  const [isLoading, setisLoading] = useState(false);
  const { Token, setToken, setHabitList, adminURLsAndEmail, CheckPurchases, purchasedSKUs } =
    useContext(Context);

  console.log('adminURLsAndEmail', useContext(Context));

  const logout = async () => {
    try {
      let res = await AsyncStorage.multiRemove(['@token', '@user']);
      console.log('res', res);
      setToken(null);
      setHabitList([]);
      props.navigation.reset({
        index: 0,
        routes: [
          {
            // name: screens.landing,
            name: screens.Login,
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
            name: screens.Login,
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
          let { terms_and_conditions_link } = adminURLsAndEmail;
          await Linking.openURL(terms_and_conditions_link);
        } catch (e) {
          console.log('Link Open Error', e);
        }
        break;

      case 'privacy_policy':
        try {
          let { privacy_policy_link } = adminURLsAndEmail;
          await Linking.openURL(privacy_policy_link);
        } catch (e) {
          console.log('Link Open Error', e);
        }
        break;

      case 'share_app':
        try {
          const result = await Share.share({
            title: 'Better.Me',
            message: `Get yourself an app that will guide you through your routine and walk you to a better and more disciplined life., AppLink :${Platform.OS == "android" ? androidAppLink : iosAppLink}`,
            url: Platform.OS == "android" ? androidAppLink : iosAppLink,
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

      case 'restore_purchase':
        try {

          setisLoading(true)
          const purchases = await RNIap.getAvailablePurchases();



          console.log(purchases, "purchases from store...")
          setisLoading(false)

          if (purchases.length == 0) {
            showToast('Nothing to restore!', 'Alert');
            // Alert.alert("Nothing to restore.", '',[{text:"Ok"}],{ cancelable: true })
            return
          }


          purchases.forEach(async (purchase) => {
            switch (purchase.productId) {

              case 'lifetime.purchase':
                Alert.alert("All in one lifetime purchase successfully restored.",'',[{text:"Ok"}],{ cancelable: true })
                await CheckPurchases()
                break

              case 'all_in_one.monthly.subscription':
                Alert.alert("All in one monthly subscription successfully restored.",'',[{text:"Ok"}],{ cancelable: true })
                await CheckPurchases()
                break

              case 'habits.monthly.subscription':
                Alert.alert("Habit tracker monthly subscription successfully restored.",'',[{text:"Ok"}],{ cancelable: true })
                await CheckPurchases()
                break

              case 'meditation.monthly.subscription':
                Alert.alert("Meditations  monthly subscription successfully restored.",'',[{text:"Ok"}],{ cancelable: true })
                await CheckPurchases()
                break

              default:
                Alert.alert("Nothing to restore!",'',[{text:"Ok"}],{ cancelable: true });
                break

            }

          })

          console.log('Restore Successful', 'You successfully restored the following purchases: ');
        } catch (err) {
          setisLoading(false)
          console.warn(err); // standardized err.code and err.message available
          console.log(err.message);
        }

        break;



      case 'report':
        fn_report();
        break;

      case 'delete_user':
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [{ text: 'No' }, { text: 'Yes', onPress: () => api_deleteAccount() }],
          { cancelable: true }
        );

        break;

      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'No' },
          { text: 'Yes', onPress: () => api_LogOut() },
        ],{ cancelable: true });

        break;

      case 'reminder':
        props.navigation.navigate(screens.reminder);
        break;
    }
  }


  const fn_report = async () => {
    console.log('getUserEmail', await getUserEmail());
    let email = await getUserEmail();
    let subject = `Better.Me Feedback, Platform: ${Platform.OS
      }, Brand: ${DeviceInfo.getBrand()}, OS Version: ${DeviceInfo.getSystemVersion()}, App Version: ${VersionCheck.getCurrentVersion()} (${VersionCheck.getCurrentBuildNumber()})`;

    if (email) {
      subject = subject + `, User Email: ${email}`;
    }
    let { support_email } = adminURLsAndEmail;
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

  const ItemView = ({ item, index }) => {
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
        <View style={{ flex: 1, marginLeft: 15 }}>
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
        { marginBottom: useBottomTabBarHeight() },
      ]}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Settings"
        rightIconView={
          <View style={{
            marginRight: 20,
          }}>
            <CustomBellIcon
              onPress={() => props.navigation.navigate(screens.notificationScreen)}
            />
          </View>
        }
      />

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 30,
              paddingTop: 20,
            }}
            data={settings}
            renderItem={ItemView}
          />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text
            style={{
              fontFamily: font.medium,
              letterSpacing: 0.5,
              color: Colors.black,
            }}>
            Version:
            <Text style={{ fontFamily: font.bold, fontSize: 16 }}>
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
    id: '6',
    name: 'Restore Purchase',
    icon: require('../../Assets/Icons/restore.png'),
    action: 'restore_purchase',
  },

  {
    id: 'reminder',
    name: 'Reminder',
    icon: require('../../Assets/Icons/alert.png'),
    action: 'reminder',
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
