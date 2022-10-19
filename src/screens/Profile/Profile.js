import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Settings,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import {HabitStats_style} from '../../Utilities/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {screens} from '../../Navigation/Screens';
import profile_placeholder from '../../Assets/Icons/dummy.png';
import CustomImage from '../../Components/CustomImage';
import {fileURL} from '../../Utilities/domains';

const Profile = props => {
  const [user, setUser] = useState(null);

  const getUserDetail = async () => {
    AsyncStorage.getItem('@user').then(val => {
      if (val != null) {
        setUser(JSON.parse(val));
      }
    });
  };

  useEffect(() => {
    if (props.route.params?.updated) {
      getUserDetail();
    }
    console.log('props.route.params?.updated', props.route.params?.updated);
  }, [props.route.params]);

  useEffect(() => {
    getUserDetail();
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
      <Header title="Profile" />

      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{alignItems: 'center'}}>
            <View
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
                    ? {uri: fileURL + user?.profile_image}
                    : profile_placeholder
                }
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 100 / 2}}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: 18,
                  letterSpacing: 0.5,
                }}>
                {!!user && user?.name}
              </Text>
            </View>

            <View
              style={[
                profile_styles.statRow,
                {justifyContent: 'space-evenly', width: '100%'},
              ]}>
              <View style={[profile_styles.statItemView]}>
                <Text style={profile_styles.statItemtext1}>Total Habits</Text>
                <Text style={profile_styles.statItemtext2}>10</Text>
              </View>

              <View style={profile_styles.statItemView}>
                <Text style={profile_styles.statItemtext1}>
                  Favorite Quotes
                </Text>
                <Text style={profile_styles.statItemtext2}>06</Text>
              </View>

              <View style={profile_styles.statItemView}>
                <Text style={profile_styles.statItemtext1}>Pending Tasks</Text>
                <Text style={profile_styles.statItemtext2}>04</Text>
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                // backgroundColor: 'pink',
                width: '100%',
              }}>
              <View>
                <Text style={{fontFamily: font.bold, textAlign: 'center'}}>
                  Total Habits
                </Text>
                <Text style={{fontFamily: font.regular, textAlign: 'center'}}>
                  10
                </Text>
              </View>

              <View>
                <Text style={{fontFamily: font.bold, textAlign: 'center'}}>
                  Favourite Quotes
                </Text>
                <Text style={{fontFamily: font.regular, textAlign: 'center'}}>
                  08
                </Text>
              </View>
            </View>

            <View style={{marginTop:20}}>
              <Text style={{fontFamily: font.bold, textAlign: 'center'}}>
                Your Upcoming Tasks
              </Text>
              <Text style={{fontFamily: font.regular, textAlign: 'center'}}>
                10
              </Text>
            </View> */}
          </View>

          <View style={{paddingHorizontal: 30, marginTop: 40}}>
            {optionsList.map((x, i) => (
              <Pressable
                key={x.id}
                onPress={() => {
                  if (!!x.screen) {
                    props.navigation.navigate(x.screen, {
                      user: x.screen == screens.editProfile ? user : null,
                    });
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  // backgroundColor:'pink'
                }}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    // backgroundColor: '#F7F6F9',
                    backgroundColor: '#BDC3C744',

                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <CustomImage
                    source={x.icon}
                    style={{height: 20, width: 20}}
                  />
                </View>
                <View style={{flex: 1, marginLeft: 15}}>
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
                    style={{height: 15, width: 15}}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
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
    id: '3',
    name: 'Settings',
    icon: require('../../Assets/Icons/setting_filled.png'),
    screen: screens.settings,
  },
  {
    id: '4',
    name: 'Subscription',
    icon: require('../../Assets/Icons/subscribe.png'),
  },
];
