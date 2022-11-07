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
import moment from 'moment';
// For API's calling
import {useContext} from 'react';
import Context from '../../Context';
import showToast from '../../functions/showToast';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import EmptyView from '../../Components/EmptyView';

const Profile = props => {
  const {Token} = useContext(Context);
  const [user, setUser] = useState(null);

  const [stats, updateStat] = useState({
    total: 0,
    complete: 0,
    pending: 0,
    loading: true,
  });

  const setStats = val =>
    updateStat(prev => {
      return {...prev, ...val};
    });

  const getUserDetail = async () => {
    AsyncStorage.getItem('@user').then(val => {
      if (val != null) {
        setUser(JSON.parse(val));
      }
    });
  };

  const findProgress = item => {
    let freq = [];
    item.frequency.filter((x, i) => {
      if (x.status == true) {
        freq.push(x.day);
      }
    });
    let count = 0;
    item.notes.map((x, i) => {
      if (freq.includes(moment(x.date).format('dddd').toLowerCase())) {
        count = count + 1;
      }
    });
    return count;
  };

  async function api_habitList() {
    let res = await invokeApi({
      path: 'api/habit/habit_list',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        let newArray = res.habits;
        let completed = 0;

        if (res.habits.length != 0) {
          newArray.map((x, i) => {
            if (x.total_days != 0) {
              if (findProgress(x) / x.total_days == 1) {
                completed = completed + 1;
              }
            }
          });

          let pending = newArray.length - completed;

          setStats({
            total:
              newArray.length < 10 ? '0' + newArray.length : newArray.length,
            complete: completed < 10 ? '0' + completed : completed,
            pending: pending < 10 ? '0' + pending : pending,
            loading: false,
          });
        } else {
          setStats({
            total: '00',
            complete: '00',
            pending: '00',
            loading: false,
          });
        }
      } else {
        setStats({
          total: '00',
          complete: '00',
          pending: '00',
          loading: false,
        });
      }
    }
  }

  useEffect(() => {
    if (props.route.params?.updated) {
      getUserDetail();
    }
  }, [props.route.params]);

  useEffect(() => {
    getUserDetail();
    api_habitList();
  }, []);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', e => {
      console.log(e, 'hello bottom');
      api_habitList();
    });

    return unsubscribe;
  }, [props.navigation]);

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
                <Text style={profile_styles.statItemtext2}>
                  {stats.loading ? '--' : stats.total}
                </Text>
              </View>

              <View style={profile_styles.statItemView}>
                <Text style={profile_styles.statItemtext1}>Completed</Text>
                <Text style={profile_styles.statItemtext2}>
                  {stats.loading ? '--' : stats.complete}
                </Text>
              </View>

              <View style={profile_styles.statItemView}>
                <Text style={profile_styles.statItemtext1}>Pending</Text>
                <Text style={profile_styles.statItemtext2}>
                  {stats.loading ? '--' : stats.pending}
                </Text>
              </View>
            </View>
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
    name: 'Subscription',
    icon: require('../../Assets/Icons/subscribe.png'),
    screen: screens.allPackages,
  },
  {
    id: '4',
    name: 'Downloaded Meditations',
    icon: require('../../Assets/Icons/music.png'),
    screen: screens.dowloadedTracks,
  },
];
