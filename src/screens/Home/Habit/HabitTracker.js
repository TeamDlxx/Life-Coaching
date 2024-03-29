import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  TouchableHighlight,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style, other_style } from '../../../Utilities/styles';
import moment, { months } from 'moment';
import { font } from '../../../Utilities/font';
import Modal from 'react-native-modal';
import { CustomMultilineTextInput } from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import { screens } from '../../../Navigation/Screens';
import CustomImage from '../../../Components/CustomImage';
import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';
import LoginAlert from '../../../Components/LoginAlert';
import analytics from '@react-native-firebase/analytics';

import { BannerAd, BannerAdSize, useRewardedAd } from 'react-native-google-mobile-ads';

// import {useLoginAlert} from '../../../hooks/useLoginAlert';
// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import { fileURL } from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import { Admob_Ids } from '../../../Utilities/AdmobIds';

const ic_nodata = require('../../../Assets/Icons/empty-box.png');
const ic_Hplaceholder = require('../../../Assets/Icons/h_placeholder1.png');

const HabitTracker = props => {
  // const checkLogin = useLoginAlert();





  const { Token, habitList, setHabitList, isHabitPurchased, dashboardData, setDashBoardData } =
    useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const daysFlatList = React.useRef();
  const [daysList, setDays] = useState([]);
  const [option, setOption] = useState(0);
  const [visibleAddHabitModal, setVisibleAddHabitModal] = useState(false);
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [note, setNote] = useState({
    text: '',
    modalVisible: false,
    item: null,
  });
  const [adError, setAdError] = useState(false);
  // console.log('isHabitPurchased', isHabitPurchased);

  const [progressViewOffsetValue, setProgressViewOffsetValue] = useState(undefined);
  const goBackEventWasHandled = useRef(false)

  const filterSelectedDayHabits = list => {
    return list.slice().filter(x => {
      if (
        x.frequency?.find(
          x =>
            x.day == moment(today, 'YYYY-MM-DD').format('dddd').toLowerCase(),
        ).status == true &&
        moment(today, 'YYYY-MM-DD').isSameOrBefore(
          moment(x.target_date),
          'date',
        ) &&
        moment(today, 'YYYY-MM-DD').isSameOrAfter(moment(x.createdAt), 'date')
      ) {
        return true;
      }
      return false;
    });
  };

  const checkCompleted = notes => {
    let index = notes.findIndex(
      x => moment(x.date).format('YYYY-MM-DD') == today,
    );

    if (index < 0) {
      return false;
    } else {
      return true;
    }
  };

  const btn_add = () => {
    if (Token) {
      if (habitList.length < 5 || isHabitPurchased == true) {
        setVisibleAddHabitModal(true);
      } else {
        props.navigation.navigate(screens.allPackages, {
          from: 'habit',
        });
        return;
        Alert.alert(
          'Subscription',
          'Your Habit limit is over\nPlease buy subcription to add more?',
          [
            { text: 'No' },
            {
              text: 'Yes',
              onPress: () => {
                props.navigation.navigate(screens.allPackages, {
                  from: 'habit',
                });
              },
            },
          ],
          {cancelable: true},
        );
      }
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  const daysInMonth = () => {
    let currentWeek = moment().startOf('week').isoWeekday(1);
    let count = 6;
    let days = [];

    for (let i = 0; i <= count; i++) {
      let newobj = {};
      newobj.date = moment(currentWeek).add(i, 'day');
      newobj.mood = emojis[i];
      days.push(newobj);
    }
    setDays([...days]);
  };

  const checkboxButton = async item => {
    if (checkCompleted(item.notes)) {
      let id = await item.notes.find(
        x => moment(x.date).format('YYYY-MM-DD') == today,
      )._id;
      api_removeNote(item._id, id);
    } else {
      setNote({ ...note, modalVisible: true, item: item });
    }
  };

  const markCompeleted = () => {
    console.log('markCompeleted');

    let { item } = note;
    let obj_addNote = {
      note_text: note.text.trim(),
      date: moment(today, 'YYYY-MM-DD').toISOString(),
    };
    api_addNote(item._id, obj_addNote);
    setisLoading(true);
    setNote({ modalVisible: false, text: '', item: null });
  };

  const api_addNote = async (id, obj) => {
    let res = await invokeApi({
      path: 'api/habit/add_note/' + id,
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: obj,
      navigation: props.navigation,
    });
    setisLoading(false);

    if (res) {
      if (res.code == 200) {
        updateHabitList(res?.habit);
        removeScheduleNotification(res?.habit._id);
        dashBoardApi();

        // let obj = dashboardData.habitStats;
        // obj.completed_habits = obj.completed_habits + 1;
        // obj.pending_habits = obj.pending_habits != 0 ? obj.pending_habits - 1 : 0;
        // await setDashBoardData({
        //   ...dashboardData,
        //   habitStats: obj
        // })

      } else {
        showToast(res.message);
      }
    }
  };

  const updateHabitList = habit => {
    let newArray = [...habitList];
    let index = newArray.findIndex(x => x._id == habit._id);
    if (index != -1) {
      newArray.splice(index, 1, habit);
      setHabitList(newArray);
    }
  };

  const api_removeNote = async (habit_id, note_id) => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/habit/remove_note/' + habit_id,
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: {
        note_id: note_id,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        updateHabitList(res.habit);
        addScheduleNotification(res.habit);
        dashBoardApi();

        // let obj = dashboardData.habitStats;
        // obj.completed_habits = obj.completed_habits != 0 ? obj.completed_habits - 1 : 0;
        // obj.pending_habits = obj.pending_habits + 1;
        // await setDashBoardData({
        //   ...dashboardData,
        //   habitStats: obj
        // })

      } else {
        showToast(res.message);
      }
    }
  };

  const dashBoardApi = async () => {
    let res = await invokeApi({
      path: 'api/customer/app_dashboard',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        let meditation = res.meditation_of_the_day;
        let quote = res.quote_of_day;
        let habit = res.habit_stats;
        let note = res.notes;
        await setDashBoardData({
          ...dashboardData,
          habitStats: habit,
          meditationOfTheDay: meditation,
          quoteOfTheDay: quote,
          notes: note,
        })
      } else { }
    }
  }

  //? Schedule Notifications

  const removeScheduleNotification = id => {
    PushNotification.getScheduledLocalNotifications(list => {
      let notification = list.find(
        x => x.data._id == id && moment(x.date).isSame(moment(today), 'date'),
      );
      console.log('notification', notification);
      if (!!notification) {
        PushNotification.cancelLocalNotification(notification.id);
      }
    });
  };

  const addScheduleNotification = obj_habit => {
    console.log('addScheduleNotification', obj_habit);
    if (obj_habit.reminder) {
      let days = [];
      obj_habit.frequency.filter(x => {
        if (x.status == true) {
          days.push(x.day.toLowerCase());
        }
      });

      if (days.includes(moment(today).format('dddd').toLowerCase())) {
        let scheduledTime = moment(
          moment(today).format('DD-MM-YYYY') +
          ' ' +
          moment(obj_habit?.reminder_time).format('HH:mm'),
          'DD-MM-YYYY HH:mm',
        ).toISOString();
        if (moment(scheduledTime).isAfter(moment())) {
          console.log('isAfter');
          PushNotification.localNotificationSchedule({
            title: obj_habit?.name,
            message: 'Please complete your todays habit',
            date: moment(scheduledTime).toDate(),
            userInfo: {
              _id: obj_habit?._id,
              type: 'habit',
            },
            channelId: '6007',
            channelName: 'lifeCoaching',
            smallIcon: 'ic_stat_name',
          });
        }
      }
    }
  };

  //? Navigation Functions

  const onChooseHabitScreen = async () => {
    await setVisibleAddHabitModal(false);
    props.navigation.navigate(screens.chooseHabit, {
      todo: option,
    });
  };

  //todo API's

  const api_myHabits = async () => {
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
        setHabitList(res.habits);
      } else {
        showToast(res.message);
      }
    }
  };

  const callHabitListAPI = () => {
    setisLoading(true);
    api_myHabits();
  };

  const refreshFlatList = () => {
    if (Token) {
      setRefreshing(true);
      api_myHabits();
    }
  };


  useEffect(() => {
    daysInMonth();
    if (Token) {
      if (habitList.length == 0) {
        callHabitListAPI();
      }
    }
    return () => { };
  }, [Token]);



  useEffect(() => {
    let index = daysList.findIndex(
      x => today == moment(x.date).format('YYYY-MM-DD'),
    );
    if (index != -1) {
      setTimeout(() => {
        daysFlatList?.current?.scrollToIndex({
          animated: true,
          index: index,
        });
      }, 500);
    }
  }, [daysList]);

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  }, []);

  useEffect(() => {
    // perform the navigation with the hidden refresh indicator
    if (progressViewOffsetValue !== undefined) {
      props.navigation.goBack()
    }
    const unsubscribe = props.navigation.addListener('beforeRemove', (event) => {
      // Handle GO_BACK event only, because it fits my use case, please tweak it to fit yours
      if (event.data.action.type === 'GO_BACK' && !goBackEventWasHandled.current) {
        event.preventDefault()
        goBackEventWasHandled.current = true
        setProgressViewOffsetValue(-1000) // set to a ridiculous value to hide the refresh control
      }
    })
    return unsubscribe
  }, [props.navigation, progressViewOffsetValue])
  //? Views

  const renderDays = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => setToday(moment(item.date).format('YYYY-MM-DD'))}
        style={{
          margin: 10,
          alignItems: 'center',
          // padding: 10,
          borderRadius: 20,
          alignSelf: 'flex-start',
          borderColor: Colors.gray02,
          borderWidth: 1,
          backgroundColor:
            today == moment(item.date).format('YYYY-MM-DD')
              ? Colors.lightPrimary
              : Colors.white,
          paddingHorizontal: 15,
          height: 70,
          flexDirection: 'row',
        }}>
        {/* <View>
          {today == moment(item.date).format('YYYY-MM-DD') && (
            <View style={{marginRight: 10}}>
              <Text style={{fontSize: 36, color: Colors.white}}>
                {item?.mood?.emoji}
              </Text>
            </View>
          )}
        </View> */}
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: font.medium,
              color:
                today == moment(item.date).format('YYYY-MM-DD')
                  ? Colors.black
                  : Colors.gray06,
            }}>
            {moment(item.date).format('dd')}
          </Text>

          <Text
            style={{
              fontFamily: font.medium,
              color:
                today == moment(item.date).format('YYYY-MM-DD')
                  ? Colors.black
                  : Colors.gray10,
              fontSize: 16,
              marginTop: 5,
            }}>
            {moment(item.date).format('D')}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderHabitsList = ({ item, index }) => {
    return (
      <Pressable
        onPress={() =>
          props.navigation.navigate(screens.habitDetail, { id: item._id })
        }
        style={{
          marginBottom: 15,
          alignItems: 'center',
          borderRadius: 20,
          borderColor: Colors.gray02,
          borderWidth: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: 10,
          flexDirection: 'row',
          marginHorizontal: 20,
          height: 80,
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 15,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: Colors.gray02,
          }}>
          {item?.images ? (
            <CustomImage
              source={{ uri: fileURL + item?.images?.small }}
              style={{ height: 50, width: 50 }}
              indicatorProps={{
                color: Colors.primary,
              }}
            />
          ) : (
            <View
              style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: Colors.background,
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
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: font.bold,
              fontSize: 14,
              includeFontPadding: false,
              color: Colors.black,
            }}>
            {item.name}
          </Text>

          {checkCompleted(item.notes) ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                source={require('../../../Assets/Icons/check.png')}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 5,
                }}
              />
              <Text
                style={{
                  fontFamily: font.medium,
                  color: Colors.text,
                  fontSize: 12,
                }}>
                Completed
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                source={require('../../../Assets/Icons/inProgress.png')}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 5,
                  tintColor: Colors.lightPrimary,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: font.medium,
                    color: Colors.text,
                    fontSize: 12,
                  }}>
                  Pending
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={{}}>
          {moment(today, 'YYYY-MM-DD').isSameOrBefore(moment()) && (
            <TouchableHighlight
              underlayColor={Colors.lightPrimary2}
              style={{ padding: 10, borderRadius: 900 }}
              onPress={() => checkboxButton(item)}>
              <Image
                style={{
                  height: 18,
                  width: 18,
                }}
                source={
                  checkCompleted(item.notes)
                    ? require('../../../Assets/Icons/checked.png')
                    : require('../../../Assets/Icons/unchecked.png')
                }
              />
            </TouchableHighlight>
          )}
        </View>
      </Pressable>
    );
  };

  const flatListHeader = () => {
    return (
      <>
        <View
          style={{ paddingHorizontal: 20, backgroundColor: Colors.background }}>
          <Pressable
            onPress={() =>
              PushNotification.getScheduledLocalNotifications(list => {
                console.log('list', list);
              })
            }
            style={{ marginTop: 5 }}>
            <Text style={other_style.labelText}>
              {moment().format('DD MMM YYYY')}
            </Text>
          </Pressable>
          <View style={{ marginHorizontal: -20, marginTop: 5 }}>
            <FlatList
              listKey="days"
              initialNumToRender={7}
              ref={daysFlatList}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
              data={daysList}
              horizontal={true}
              renderItem={renderDays}
              onScrollToIndexFailed={() => {
                console.log('scroll error');
              }}
            />
          </View>

          <Pressable style={{ marginTop: 5, marginBottom: 15 }}>
            <Text style={other_style.labelText}>All Habits</Text>
          </Pressable>
        </View>
        {isHabitPurchased == false && adError == false && (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
            }}>
            <BannerAd
              size={BannerAdSize.BANNER}
              unitId={Admob_Ids.banner}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdFailedToLoad={err => {
                console.log(err, 'Banner Ad Error...');
                setAdError(true);
              }}
            />
          </View>
        )}
      </>
    );
  };

  // Modal

  const addhabitModal = () => {
    return (
      <Modal
        isVisible={visibleAddHabitModal}
        onBackButtonPress={() => setVisibleAddHabitModal(false)}
        onBackdropPress={() => setVisibleAddHabitModal(false)}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        style={{
          marginHorizontal: 10,
          marginBottom: Platform.OS == 'ios' ? 20 : 10,
        }}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: Colors.background,
            borderRadius: 10,
            paddingVertical: 20,
          }}>
          <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
            <Text
              style={{
                color: Colors.gray14,
                fontFamily: font.xbold,
                textAlign: 'center',
                fontSize: 16,
              }}>
              {moment(today, 'YYYY-MM-DD').format('DD MMM YYYY') ==
                moment().format('DD MMM YYYY') && <Text>{'Today, '}</Text>}
              {moment(today, 'YYYY-MM-DD').format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={{ marginTop: 30, marginBottom: 10, flexDirection: 'row' }}>
            <Pressable
              onPress={() => setOption(0)}
              style={[
                modalStyle.btn_view,
                option == 0 ? modalStyle.selectedBtnView : null,
              ]}>
              <Image
                source={require('../../../Assets/Icons/cancel.png')}
                style={[
                  modalStyle.btn_icon,
                  option == 0 ? modalStyle.slectedIcon : null,
                  { tintColor: 'tomato' },
                ]}
              />
              <Text
                style={[
                  modalStyle.btn_text,
                  option == 0 ? modalStyle.selectedBtnText : null,
                ]}>
                Break Bad Habit
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setOption(1)}
              style={[
                modalStyle.btn_view,
                option == 1 ? modalStyle.selectedBtnView : null,
              ]}>
              <Image
                source={require('../../../Assets/Icons/infinity.png')}
                style={[
                  modalStyle.btn_icon,
                  option == 1 ? modalStyle.slectedIcon : null,
                  { tintColor: '#5dbb63' },
                ]}
              />
              <Text
                style={[
                  modalStyle.btn_text,
                  option == 1 ? modalStyle.selectedBtnText : null,
                ]}>
                Create Good Habit
              </Text>
            </Pressable>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
            <CustomButton
              onPress={onChooseHabitScreen}
              title={'Create Habit'}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const addNoteModal = () => {
    return (
      <Modal
        isVisible={note.modalVisible}
        onBackButtonPress={() => setNote({ ...note, modalVisible: false })}
        onBackdropPress={() => setNote({ ...note, modalVisible: false })}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        hideModalContentWhileAnimating={true}
        style={{
          marginHorizontal: 5,
        }}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: Colors.background,
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
          <View
            style={{
              height: 80,
              width: 80,
              marginTop: -40,
              alignSelf: 'center',
              borderWidth: 10,
              borderColor: Colors.background,
              borderRadius: 40,
              backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{ height: 70, width: 70 }}
              source={require('../../../Assets/Icons/check.png')}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomMultilineTextInput
              lable={'Add Note'}
              subLabel={'(Optional)'}
              placeholder={'Please enter a note for completing this Habit'}
              lableBold
              lableColor={Colors.black}
              value={note.text}
              onChangeText={text => setNote({ ...note, text: text })}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <CustomButton
              height={50}
              onPress={markCompeleted}
              title={'Mark Complete'}
            />
          </View>
        </View>
        {note.modalVisible && <Toast />}
      </Modal>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header
        navigation={props.navigation}
        title={'Habit Tracker'}
        // rightIcon={require('../../../Assets/Icons/stats.png')}
        // rightIcononPress={() => props.navigation.navigate(screens.habitStats)}
        rightIcon={require('../../../Assets/Icons/list.png')}
        rightIcononPress={() => props.navigation.navigate(screens.allHabits)}
      />
      <View style={mainStyles.innerView}>
        <View style={{ flex: 1, marginHorizontal: -20 }}>
          <Loader enable={isLoading} />
          <View style={{ flex: 1 }}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshFlatList}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  progressBackgroundColor={Colors.white}
                  // progressViewOffset={Platform.OS == 'android' ? -20 : 0}
                  progressViewOffset={progressViewOffsetValue}
                />
              }
              listKey="main"
              stickyHeaderIndices={[0]}
              stickyHeaderHiddenOnScroll={true}
              ListHeaderComponent={flatListHeader()}
              contentContainerStyle={
                filterSelectedDayHabits(habitList).length == 0
                  ? { flex: 1 }
                  : { paddingVertical: 10, paddingBottom: 50 }
              }
              showsVerticalScrollIndicator={false}
              data={filterSelectedDayHabits(habitList)}
              renderItem={renderHabitsList}
              keyExtractor={item => {
                return item._id;
              }}
              ListEmptyComponent={() =>
                isLoading == false && (

                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <EmptyView
                      style={{ marginTop: 0 }}
                      title={`No Habits for this date`}
                      noSubtitle
                    />
                    <TouchableOpacity onPress={btn_add} style={{ backgroundColor: Colors.lightPrimary, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 20, paddingHorizontal: 10 }}>
                      <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Change My Habit    </Text>
                    </TouchableOpacity>
                  </View>

                )
              }
            />
          </View>
        </View>

        <Pressable style={FAB_style.View} onPress={btn_add}>
          <Image
            source={require('../../../Assets/Icons/plus.png')}
            style={FAB_style.image}
          />
        </Pressable>

        {addhabitModal()}
        {addNoteModal()}
      </View>
    </SafeAreaView>
  );
};

export default HabitTracker;

const emojis = [
  { name: 'Terrible', emoji: '😡', _id: '1' },
  { name: 'Bad', emoji: '🙁', _id: '2' },
  { name: 'Okay', emoji: '😐', _id: '3' },
  { name: 'Good', emoji: '🙂', _id: '4' },
  { name: 'Excellent', emoji: '😍', _id: '5' },
  { name: 'Shocked', emoji: '😲', _id: '6' },
  { name: 'Sad', emoji: '😥', _id: '6' },
];

const modalStyle = StyleSheet.create({
  btn_view: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.gray02,
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // height:120
    paddingVertical: 20,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
  selectedBtnView: {
    borderColor: Colors.gray02,
    backgroundColor: Colors.lightPrimary,
  },
  btn_text: {
    fontFamily: font.medium,
    fontSize: 16,
    color: Colors.gray10,
    marginTop: 10,
    textAlign: 'center',
  },
  selectedBtnText: {
    color: Colors.black,
  },
  btn_icon: {
    marginLeft: 5,
    height: 30,
    width: 30,
    tintColor: Colors.gray10,
  },
  slectedIcon: {
    tintColor: Colors.primary,
  },
  emojiView: {
    borderColor: Colors.gray02,
    backgroundColor: Colors.background,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    // justifyContent:"space-evenly"
    alignItems: 'center',
    // paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
