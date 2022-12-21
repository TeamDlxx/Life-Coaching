import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, allHabit_styles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
// fro API calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import PushNotification from 'react-native-push-notification';
import SwipeableFlatList from 'react-native-swipeable-list';
import analytics from '@react-native-firebase/analytics';

const screen = Dimensions.get('screen');
const ic_Hplaceholder = require('../../../Assets/Icons/h_placeholder1.png');
const AllHabits = props => {
  const {Token, habitList, setHabitList} = useContext(Context);
  const [sHabitList, setSHabitList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentWeek, setCurrentWeekDays] = useState([]);

  const makeDaysArray = () => {
    let selectedWeekDays = [];
    for (let i = 0; i < 7; i++) {
      selectedWeekDays.push(moment().startOf('isoWeek').add(i, 'days'));
    }
    setCurrentWeekDays(selectedWeekDays);
  };
  //  Functions

  const refreshFlatList = () => {
    setRefreshing(true);
    api_habitList();
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

  const callHabitListApi = () => {
    setisLoading(true);
    api_habitList();
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
    setisLoading(false);
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        setSHabitList(res.habits);
      } else {
        showToast(res.message);
      }
    }
  }

  function updateHabitLocally(item) {
    let newArray = [...sHabitList];
    let index = newArray.findIndex(x => x._id == item._id);
    newArray.splice(index, 1, item);
    setSHabitList(newArray);
  }

  const api_deleteHabit = async id => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/habit/delete_habit/' + id,
      method: 'DELETE',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        RemoveThisHabitScheduleNotifications(id);
        showToast(
          'Habit has been deleted successfully',
          'Habit Deleted',
          'success',
        );
        removeHabitFromList(id);
        removeFromGlobalHabitList(id);
      } else {
        showToast(res.message);
      }
    }
  };

  const RemoveThisHabitScheduleNotifications = id => {
    PushNotification.getScheduledLocalNotifications(list => {
      list.map(x => {
        if (x.data._id == id) {
          PushNotification.cancelLocalNotification(x.id);
        }
      });
    });
  };

  const removeFromGlobalHabitList = id => {
    let newArray = [...habitList];
    let index = newArray.findIndex(x => x._id == id);
    if (index != -1) {
      newArray.splice(index, 1);
      setHabitList(newArray);
    }
  };

  const removeHabitFromList = id => {
    let newArray = [...sHabitList];
    let index = newArray.findIndex(x => x._id == id);
    newArray.splice(index, 1);
    setSHabitList(newArray);
  };

  React.useEffect(() => {
    if (!!props.route.params?.updated) {
      console.log('ABC');
    }
  }, [props.route]);

  React.useEffect(() => {
    makeDaysArray();

    analytics().logEvent(props?.route?.name);

    if (Token) {
      callHabitListApi();
    }
    return () => {
      setSHabitList([]);
    };
  }, []);

  // Views
  const renderHabitsList = ({item, index}) => {
    let progress = findProgress(item);
    return (
      <Pressable
        key={item._id}
        onPress={() => {
          props.navigation.navigate(screens.habitDetail, {
            id: item._id,
            updateHabit: updateHabitLocally,
            removeHabitFromPreviosScreenList: removeHabitFromList,
          });
        }}
        style={allHabit_styles.itemView}>
        <View style={allHabit_styles.imageView}>
          {!!item?.images?.large ? (
            <CustomImage
              source={{uri: fileURL + item.images?.small}}
              indicatorProps={{color: Colors.primary}}
              style={allHabit_styles.itemImage}
            />
          ) : (
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: Colors.background,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={ic_Hplaceholder}
                style={{
                  height: '50%',
                  width: '50%',
                  tintColor: Colors.placeHolder,
                }}
              />
            </View>
          )}
        </View>
        <View style={allHabit_styles.detailView}>
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={allHabit_styles.title}>
              {item.name}
            </Text>
            <View style={allHabit_styles.targetDateView}>
              <Text style={allHabit_styles.targetDate}>
                Target Date : {moment(item.target_date).format('DD MMM YYYY')}
              </Text>
            </View>

            {!!item.reminder && (
              <View style={allHabit_styles.reminderView}>
                <Text style={allHabit_styles.reminderText}>
                  <Text>
                    Reminder at {moment(item.reminder_time).format('hh:mm A')}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          <View style={allHabit_styles.weekView}>
            {item.frequency.map((x, i) => {
              return (
                <View
                  key={x._id}
                  style={[
                    allHabit_styles.weekDayView,
                    {
                      backgroundColor: x.status
                        ? Colors.lightPrimary
                        : Colors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: x.status ? font.xbold : font.medium,
                      fontSize: 12,
                      color: x.status ? Colors.primary : Colors.placeHolder,
                      textTransform: 'capitalize',
                    }}>
                    {x.day.charAt(0)}
                  </Text>
                  {/* <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                    }}>
                    {item.notes.findIndex(
                      y =>
                        moment(y.date).format('DDMMYYYY') ==
                        moment(currentWeek[i]).format('DDMMYYYY'),
                    ) != -1 && (
                      <Image
                        style={{height: 8, width: 8,}}
                        source={require('../../../Assets/Icons/tick.png')}
                      />
                    )}
                  </View> */}
                </View>
              );
            })}
          </View>

          <View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              {currentWeek.map(x => {
                return (
                  <View
                    style={{
                      borderRadius: 4,
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {item.notes.findIndex(
                      y =>
                        moment(y.date).format('DDMMYYYY') ==
                        moment(x).format('DDMMYYYY'),
                    ) != -1 && (
                      <Image
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: Colors.primary,
                        }}
                        source={require('../../../Assets/Icons/tick.png')}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: 5,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}>
              <Text
                style={{
                  fontFamily: font.bold,
                  color: Colors.placeHolder,
                  fontSize: 12,
                }}>
                {item?.total_days != 0
                  ? parseInt((progress / item?.total_days) * 100) + '%'
                  : '0%'}
              </Text>
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Progress.Bar
                color={Colors.primary}
                height={8}
                borderColor={Colors.gray02}
                borderRadius={13}
                borderWidth={1}
                progress={
                  item?.total_days != 0 ? progress / item?.total_days : 0
                }
                width={null}
              />
            </View>
          </View>
        </View>
        {item?.total_days != 0 && progress / item?.total_days >= 1 && (
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 30,
              paddingVertical: 5,
              transform: [{rotateZ: '-45deg'}],
              position: 'absolute',
              left: -30,
              top: 15,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: font.medium,
                fontSize: 10,
                textAlign: 'center',
                // letterSpacing:1
              }}>
              COMPLETED
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Your Habits'} />

      <View style={{flex: 1}}>
        <Loader enable={isLoading} />
        <View style={{flex: 1}}>
          <SwipeableFlatList
            // useFlatList={true}
            contentContainerStyle={{paddingVertical: 10}}
            showsVerticalScrollIndicator={false}
            data={sHabitList}
            renderItem={renderHabitsList}
            // rightOpenValue={-60}
            // disableRightSwipe={true}
            // closeOnRowBeginSwipe={true}
            // closeOnRowPress={true}
            shouldBounceOnMount={true}
            maxSwipeDistance={70}
            keyExtractor={item => {
              return item._id;
            }}
            // renderHiddenItem={({item, index}) => {
            //   console.log('renderHiddenItem', item);
            //   return (
            //     <Pressable
            //       key={item._id}
            //       onPress={() =>
            //         Alert.alert(
            //           'Delete Habit',
            //           'Are you sure you want to delete this Habit',
            //           [
            //             {text: 'No'},
            //             {text: 'Yes', onPress: () => api_deleteHabit(item._id)},
            //           ],
            //         )
            //       }
            //       style={allHabit_styles.hiddenView}>
            //       <Image
            //         source={require('../../../Assets/Icons/trash.png')}
            //         style={allHabit_styles.hiddenIcon}
            //       />
            //     </Pressable>
            //   );
            // }}
            renderQuickActions={({item, index}) => {
              return (
                <Pressable
                  key={item._id}
                  onPress={() =>
                    Alert.alert(
                      'Delete Habit',
                      'Are you sure you want to delete this Habit',
                      [
                        {text: 'No'},
                        {text: 'Yes', onPress: () => api_deleteHabit(item._id)},
                      ],
                    )
                  }
                  style={allHabit_styles.hiddenView}>
                  <Image
                    source={require('../../../Assets/Icons/trash.png')}
                    style={allHabit_styles.hiddenIcon}
                  />
                </Pressable>
              );
            }}
            ListEmptyComponent={() =>
              isLoading == false &&
              sHabitList.length == 0 && (
                <EmptyView title={'No Habits'} noSubtitle />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllHabits;
