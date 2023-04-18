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
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, allHabit_styles } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
// fro API calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import { fileURL } from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import PushNotification from 'react-native-push-notification';
import SwipeableFlatList from 'react-native-swipeable-list';
import analytics from '@react-native-firebase/analytics';
import Modal from 'react-native-modal';
import LoginAlert from '../../../Components/LoginAlert';
import CustomButton from '../../../Components/CustomButton';

const screen = Dimensions.get('screen');
const ic_Hplaceholder = require('../../../Assets/Icons/h_placeholder1.png');


const AllHabits = props => {


  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [option, setOption] = useState(0);

  const { Token, habitList, setHabitList, isHabitPurchased, dashboardData, setDashBoardData } = useContext(Context);
  const [sHabitList, setSHabitList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentWeek, setCurrentWeekDays] = useState([]);
  const [visibleAddHabitModal, setVisibleAddHabitModal] = useState(false);

  const makeDaysArray = () => {
    let selectedWeekDays = [];
    for (let i = 0; i < 7; i++) {
      selectedWeekDays.push(moment().startOf('isoWeek').add(i, 'days'));
    }
    setCurrentWeekDays(selectedWeekDays);
  };
  //  Functions


  const onChooseHabitScreen = async () => {
    await setVisibleAddHabitModal(false);
    props.navigation.navigate(screens.chooseHabit, {
      todo: option,
    });
  };


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
        );
      }
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };


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

        let obj = dashboardData.habitStats;
        obj.all_habits = obj.all_habits - 1;

        let idx = sHabitList.findIndex(x => x._id == id)
        if (idx != -1) {
          if (sHabitList[idx].type == "to-do") {
            obj.good_habits = obj.good_habits != 0 ? obj.good_habits - 1 : 0;
          } else {
            obj.bad_habits = obj.bad_habits != 0 ? obj.bad_habits - 1 : 0;
          }

          let progress = findProgress(sHabitList[idx]);

          if (sHabitList[idx].total_days != 0 && progress / sHabitList[idx].total_days >= 1) {
            obj.completed_habits = obj.completed_habits != 0 ? obj.completed_habits - 1 : 0;
          } else {
            obj.pending_habits = obj.pending_habits != 0 ? obj.pending_habits - 1 : 0;
          }
        }
        await setDashBoardData({
          ...dashboardData,
          habitStats: obj
        })

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



  const renderHabitsList = ({ item, index }) => {
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
              source={{ uri: fileURL + item.images?.small }}
              indicatorProps={{ color: Colors.primary }}
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
          <View style={{ flex: 1 }}>
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
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
            <View style={{ flex: 1, marginTop: 5 }}>
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
              transform: [{ rotateZ: '-45deg' }],
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

      <View style={{ flex: 1 }}>
        <Loader enable={isLoading} />
        <View style={{ flex: 1 }}>
          <SwipeableFlatList
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            data={sHabitList}
            renderItem={renderHabitsList}

            shouldBounceOnMount={true}
            maxSwipeDistance={70}
            keyExtractor={item => {
              return item._id;
            }}

            renderQuickActions={({ item, index }) => {
              return (
                <Pressable
                  key={item._id}
                  onPress={() =>
                    Alert.alert(
                      'Delete Habit',
                      'Are you sure you want to delete this Habit',
                      [
                        { text: 'No' },
                        { text: 'Yes', onPress: () => api_deleteHabit(item._id) },
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

                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <EmptyView title={'No Habits Yet'} noSubtitle />
                  <TouchableOpacity onPress={btn_add} style={{ backgroundColor: Colors.lightPrimary, height: 40, width: 160, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Change My Habit   </Text>
                  </TouchableOpacity>
                </View>
              )
            }
          />
        </View>


        {addhabitModal()}


      </View>
    </SafeAreaView>
  );
};

export default AllHabits;


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