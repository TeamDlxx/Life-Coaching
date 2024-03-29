import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Settings,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { mainStyles } from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import { HabitStats_style } from '../../Utilities/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { screens } from '../../Navigation/Screens';
import profile_placeholder from '../../Assets/Icons/dummy.png';
import CustomImage from '../../Components/CustomImage';
import { fileURL } from '../../Utilities/domains';
import ImageZoomer from '../../Components/ImageZoomer';
import analytics from '@react-native-firebase/analytics';

// For API's calling
import { useContext } from 'react';
import Context from '../../Context';
import showToast from '../../functions/showToast';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import EmptyView from '../../Components/EmptyView';
import CustomBellIcon from '../../Components/CustomBellIcon';

// icon

const ic_logo = require('../../Assets/app-icon/final.png');
const screen = Dimensions.get('screen');
const Profile = props => {
  const { Token, habitList, setHabitList, completed, purchasedSKUs, } =
    useContext(Context);
  const [user, setUser] = useState(null);
  const [loading, setisLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [googleOrAppleLogin, setGoogleOrAppleLogin] = useState(null);


  const onLoginSignUpScreen = screen => {
    props.navigation.navigate(screen, {
      from: props?.route?.name,
    });
  };

  const getUserDetail = async () => {
    AsyncStorage.getItem('@user').then(val => {
      if (val != null) {
        setUser(JSON.parse(val));
      }
    });
  };

  const getUserLoginStatus = async () => {
    return await AsyncStorage.getItem('@googleOrAppleLogin').then(val => {
      if (val !== null) {
        setGoogleOrAppleLogin(val);
        console.log(googleOrAppleLogin, "googleOrAppleLogin ...")
      }
    })
  }

  async function api_profile() {
    let res = await invokeApi({
      path: 'api/app_api/user_profile',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        setHabitList(res.habit);
      }
    }
    setisLoading(false);
  }

  const hideImageModal = () => {
    setModalImage(null);
  };

  const ShowImageModal = link => {
    if (!!link) {
      setModalImage(link);
    } 
    // else {
    //   showToast('Image not available', 'Alert');
    // }
  };

  const appendZero = val => {
    if (val < 10) {
      return '0' + val;
    }
    return val;
  };

  useEffect(() => {
    if (Token) {
      if (props.route.params?.updated) {
        getUserDetail();
      }
      if (props.route.params?.loggedIn) {
        getUserDetail();
        api_profile();
      }
    }
  }, [props.route.params]);

  useEffect(() => {
    getUserLoginStatus();
    if (Token) {
      getUserDetail();
      api_profile();
    }
  }, [Token]);

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
      <Header title="Profile"
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
      {/* {Token ? ( */}
      <View style={{ flex: 1 }}>

        <ImageZoomer
          closeModal={hideImageModal}
          visible={!!modalImage}
          url={modalImage}
        />


        <ScrollView>
          <View style={{ alignItems: 'center' }}>

            {Token &&
              <Pressable
                onPress={() => ShowImageModal(user.profile_image)}
                style={{
                  height: 110,
                  width: 110,
                  borderRadius: 110 / 2,
                  alignSelf: 'center',
                  marginTop: 30,
                  borderWidth: 1,
                  borderColor: Colors.gray05,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomImage
                  source={
                    !!user && !!user.profile_image
                      ? { uri: fileURL + user?.profile_image }
                      : profile_placeholder
                  }
                  style={{ height: 100, width: 100 }}
                  imageStyle={{ borderRadius: 100 / 2 }}
                />
              </Pressable>
            }

            {Token &&
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 18,
                    letterSpacing: 0.5,
                  }}>
                  {!!user && user?.name}
                </Text>
              </View>
            }

            {Token &&
              <View
                style={[
                  profile_styles.statRow,
                  { justifyContent: 'space-evenly', width: '100%' },
                ]}>
                <View style={[profile_styles.statItemView]}>
                  <Text style={profile_styles.statItemtext1}>Total Habits</Text>
                  <Text style={profile_styles.statItemtext2}>
                    {loading ? '--' : appendZero(habitList.length)}
                  </Text>
                </View>

                <View style={profile_styles.statItemView}>
                  <Text style={profile_styles.statItemtext1}>Completed</Text>
                  <Text style={profile_styles.statItemtext2}>
                    {loading ? '--' : appendZero(completed)}
                  </Text>
                </View>

                <View style={profile_styles.statItemView}>
                  <Text style={profile_styles.statItemtext1}>Pending</Text>
                  <Text style={profile_styles.statItemtext2}>
                    {loading ? '--' : appendZero(habitList.length - completed)}
                  </Text>
                </View>
              </View>
            }

          </View>

          <View style={{ paddingHorizontal: 30, marginTop: 40 }}>
            {optionsList.map((x, i) => {

              if (
                x.id == 'sub' &&
                !!purchasedSKUs.find(x => x == 'lifetime.purchase') == true
              ) {
                return;
              }


              if (
                x.id == '1' &&
                !Token
              ) {
                return;
              }

              // if (
              //   x.id == '2' && !Token && googleOrAppleLogin == "false" && guest == "true"
              // ) {
              //   return;
              // }

              if (x.id == '2') {
                if (!Token) {
                  return;
                } else if (googleOrAppleLogin == "true" && Token) {
                  return;
                }
              }

              if (
                x.id == '5' &&
                Token
              ) {
                return;
              }

              return (

                <Pressable
                  key={x.id}
                  onPress={() => {
                    if (!!x.screen) {
                      props.navigation.navigate(x.screen, {
                        user: x.screen == screens.editProfile ? user : null,
                        logout: x.screen == screens.Login ? false : null,
                      });
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor: '#BDC3C744',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <CustomImage
                      source={x.icon}
                      style={{ height: 20, width: 20 }}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        fontSize: 16,
                        letterSpacing: 0.6,
                      }}>
                      {x.name}
                    </Text>
                  </View>
                  <View>
                    <CustomImage
                      source={require('../../Assets/Icons/right_arrow.png')}
                      style={{ height: 15, width: 15 }}
                    />
                  </View>
                </Pressable>

              );
            })}
          </View>
        </ScrollView>
      </View>
      {/* ) */}


      {/* : */}


      {/* (
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center', flex: 1, marginTop: '10%'}}>
            <View style={{borderRadius: 15, overflow: 'hidden'}}>
              <Image
                source={ic_logo}
                style={{width: screen.width / 2.2, height: screen.width / 2.2}}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: '15%',
                marginHorizontal: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 24,
                    letterSpacing: 0.5,
                    textAlign: 'center',
                  }}>
                  Better.Me
                </Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    letterSpacing: 0.5,
                    textAlign: 'center',
                    color: Colors.gray13,
                  }}>
                  Better.me is an app for you to track your every little
                  progress and put your disturbed routine back on track. Improve
                  and organize your life again with interesting features.
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              marginHorizontal: 30,
              flex: 1,
            }}>
            <Pressable
              onPress={() => onLoginSignUpScreen(screens.Login)}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 10,
                height: 55,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: font.bold,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Login
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onLoginSignUpScreen(screens.signup)}
              style={{
                backgroundColor: Colors.lightPrimary1,
                borderRadius: 10,
                height: 55,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontFamily: font.bold,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Signup
              </Text>
            </Pressable>
          </View>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default Profile;

const profile_styles = StyleSheet.create({
  statItemtext1: {
    color: Colors.placeHolder,
    fontFamily: font.medium,
    fontSize: 12,
  },
  statItemtext2: {
    color: Colors.black,
    fontFamily: font.bold,
    fontSize: 20,
  },
  statItemView: {
    alignItems: 'center',
    backgroundColor: '#BDC3C733',
    // height: 60,
    width: 100,
    // aspectRatio:2,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  statRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  statOuterItem: {
    // padding: 10,
    borderRadius: 10,
    // flex:1,
    // marginHorizontal:10
    height: 50,
    width: 90,
    justifyContent: 'center',
    // alignItems:"center"
  },
  typeText: {
    fontFamily: font.medium,
    padding: 10,
    color: Colors.placeHolder,
    textTransform: 'capitalize',
  },
  selectedTypeText: {
    color: Colors.primary,
  },
});

const optionsList = [


  {
    id: '1',
    name: 'Edit Profile',
    icon: require('../../Assets/Icons/edit.png'),
    screen: screens.editProfile,
  },
  {
    id: '2',
    name: 'Change Password',
    icon: require('../../Assets/Icons/key.png'),
    screen: screens.changePassword,
  },

  {
    id: 'sub',
    name: 'Subscription Plans',
    icon: require('../../Assets/Icons/subscribe.png'),
    screen: screens.allPackages,
  },
  {
    id: '4',
    name: 'Downloaded Meditations',
    icon: require('../../Assets/Icons/music.png'),
    screen: screens.dowloadedTracks,
  },

  {
    id: '5',
    name: 'Login',
    icon: require('../../Assets/Icons/avatar.png'),
    screen: screens.Login,
  },
];
