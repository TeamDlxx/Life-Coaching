import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../../Components/Header';
import Colors, {Bcolors} from '../../../Utilities/Colors';
import {mainStyles, createHabit_styles} from '../../../Utilities/styles';
import {CustomMultilineTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CustomImage from '../../../Components/CustomImage';
// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';

const screen = Dimensions.get('screen');

const HabitDetail = props => {
  const {Token, habitList, setHabitList} = useContext(Context);
  const {params} = props.route;
  const MenuRef = useRef([]);
  const EditMenu = useRef();
  const [habit, setHabitDetail] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [currentWeekDays, setCurrentWeekDays] = useState([]);
  const [note, setNote] = useState({
    modalVisible: false,
    item: null,
    text: '',
    update: false,
  });

  const makeDaysArray = () => {
    let selectedWeekDays = [];
    for (let i = 0; i < 7; i++) {
      selectedWeekDays.push(
        moment(currentWeek).startOf('isoWeek').add(i, 'days'),
      );
    }
    setCurrentWeekDays(selectedWeekDays);
  };

  const updateNote = updation => setNote({...note, ...updation});

  const onPreviousWeek = () => {
    setCurrentWeek(moment(currentWeek).subtract(1, 'week'));
    // makeDaysArray();
  };

  useEffect(() => {
    makeDaysArray();
  }, [currentWeek]);

  const onNextWeek = () => {
    setCurrentWeek(moment(currentWeek).add(1, 'week'));
    // makeDaysArray();
  };

  const onViewAllNotes = () => {
    props.navigation.navigate(screens.AllNotes, {
      habit: habit,
      backScreenfunc: forNextScreen,
      updateHabit: params?.updateHabit,
    });
  };

  const checkCompleted = item => {
    let index = habit.notes.findIndex(
      x =>
        moment(x.date).format('YYYY-MM-DD') ==
        moment(item).format('YYYY-MM-DD'),
    );

    if (index < 0) {
      return false;
    } else {
      return true;
    }
  };

  const forNextScreen = habit => {
    setHabitDetail(habit);
  };

  const getWeekDates = () => {
    let startDateOfWeek = moment(currentWeek).startOf('week');
    let endDateOfWeek = moment(currentWeek).endOf('week');
    return (
      moment(startDateOfWeek).format('DD MMM YYYY') +
      ' - ' +
      moment(endDateOfWeek).format('DD MMM YYYY')
    );
  };

  const markCompeleted = () => {
    let {item} = note;
    let obj_addNote = {
      note_text: note.text.trim(),
      date: moment(note.item).toISOString(),
    };
    api_addNote(item._id, obj_addNote, note.item);
    setisLoading(true);
    setNote({modalVisible: false, text: '', item: null});
  };

  const api_addNote = async (id, obj, date) => {
    let res = await invokeApi({
      path: 'api/habit/add_note/' + habit?._id,
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: obj,
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        removeScheduleNotification(res.habit._id, date);
        setHabitDetail(res.habit);
        updateHabitList(res.habit);
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const editNoteModal = () => {
    return (
      <Modal
        isVisible={note.modalVisible}
        onBackButtonPress={() => updateNote({modalVisible: false})}
        onBackdropPress={() => updateNote({modalVisible: false})}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        hideModalContentWhileAnimating={true}
        style={{marginHorizontal: 5}}>
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
              style={{height: 70, width: 70}}
              source={require('../../../Assets/Icons/check.png')}
            />
          </View>
          <View style={{marginTop: 10}}>
            <CustomMultilineTextInput
              lable={note.update == false ? 'Add Note' : 'Edit Note'}
              placeholder={'Please enter a note for completing this Habit'}
              lableBold
              lableColor={Colors.black}
              value={note.text}
              onChangeText={text => updateNote({text: text})}
            />
          </View>
          <View style={{marginTop: 20}}>
            <CustomButton
              height={50}
              onPress={note.update == false ? markCompeleted : btn_saveChnages}
              title={note.update == false ? 'Mark Complete' : 'Save Changes'}
            />
          </View>
        </View>
        {!!note?.modalVisible && <Toast />}
      </Modal>
    );
  };

  const editNote = async (i, item) => {
    await MenuRef.current[i].hide();

    setTimeout(() => {
      updateNote({
        text: item?.note_text,
        modalVisible: true,
        item: item,
        update: true,
      });
    }, 400);
  };

  const btn_saveChnages = () => {
    let obj = {
      note_id: note?.item?._id,
      note_text: note?.text.trim(),
      date: note?.item?.date,
    };
    api_editNote(obj);
    setisLoading(true);
    setTimeout(() => {
      updateNote({text: '', modalVisible: false, item: null});
    }, 50);
  };

  const api_editNote = async obj => {
    let res = await invokeApi({
      path: 'api/habit/edit_note/' + habit?._id,
      method: 'PUT',
      headers: {
        'x-sh-auth': Token,
      },
      postData: obj,
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        setHabitDetail(res.habit);
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const deleteNote = (obj, index) => {
    MenuRef.current[index].hide();
    Alert.alert('Delete Note', 'Are you sure you want to delete this note', [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        onPress: () => api_editNote(obj),
      },
    ]);
  };

  const api_removeNote = async note_id => {
    let res = await invokeApi({
      path: 'api/habit/remove_note/' + habit._id,
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
    if (res) {
      if (res.code == 200) {
        setHabitDetail(res.habit);
        updateHabitList(res.habit);
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
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

  const api_habitDetail = async () => {
    let res = await invokeApi({
      path: 'api/habit/habit_detail/' + params?.id,
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);

    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        setHabitDetail(res.habit);
        if (moment(res?.habit?.target_date).valueOf() < moment().valueOf()) {
          setCurrentWeek(moment(res?.habit?.target_date));
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const callHabitDetailApi = () => {
    setisLoading(true);
    api_habitDetail();
  };

  const sorttheListbyDate = list => {
    return list.slice().sort(function (a, b) {
      return moment(b.date).valueOf() - moment(a.date).valueOf();
    });
  };

  const checkNotesforthisweek = list => {
    return list
      .slice()
      .filter(
        x =>
          moment(x.date).isBetween(
            moment(currentWeek).startOf('isoWeek'),
            moment(currentWeek).endOf('isoWeek'),
            undefined,
            '[]',
          ) && x.note_text != '',
      );
  };

  const refreshDetail = () => {
    setRefreshing(true);
    api_habitDetail();
  };

  const updateHabitLocally = item => {
    setHabitDetail(item);
  };

  //? Schedule Notifications

  const removeScheduleNotification = (id, date) => {
    PushNotification.getScheduledLocalNotifications(list => {
      let notification = list.find(
        x => x.data._id == id && moment(x.date).isSame(moment(date), 'date'),
      );
      if (!!notification) {
        PushNotification.cancelLocalNotification(notification.id);
      }
    });
  };

  useEffect(() => {
    callHabitDetailApi();
    return () => {};
  }, []);

  const dropDownMenu = () => {
    return (
      <Menu
        style={{
          backgroundColor: Colors.white,
        }}
        ref={EditMenu}
        onRequestClose={() => EditMenu?.current.hide()}
        anchor={
          <TouchableHighlight
            onPress={() => EditMenu?.current.show()}
            underlayColor={Colors.lightPrimary}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
            }}>
            <Image
              source={require('../../../Assets/Icons/threeDots.png')}
              style={{height: 15, width: 15, tintColor: Colors.black}}
            />
          </TouchableHighlight>
        }>
        <MenuItem
          onPress={() => {
            EditMenu?.current.hide();
            props.navigation.navigate(screens.createHabit, {
              item: habit,
              updateHabit: params?.updateHabit,
              updateHabitDetail: updateHabitLocally,
            });
          }}>
          <Text style={{fontFamily: font.bold}}>Edit</Text>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <View style={{flex: 1}}>
        <Header
          menu={dropDownMenu}
          navigation={props.navigation}
          title={'Habit Detail'}
        />
        <View style={{flex: 1}}>
          {habit != null && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    padding: 15,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: Colors.gray02,
                    marginTop: '25%',
                    marginHorizontal: 10,
                  }}>
                  <View
                    style={{
                      width: screen.width / 3,
                      aspectRatio: 1,
                      borderRadius: 20,
                      alignSelf: 'center',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                      marginTop: -screen.width / 5,
                      backgroundColor: Colors.white,
                    }}>
                    <CustomImage
                      source={{uri: fileURL + habit.images?.large}}
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                      }}
                      imageStyle={{
                        borderRadius: 20,
                      }}
                      indicatorProps={{
                        color: Colors.primary,
                      }}
                    />
                  </View>
                  <View style={{marginTop: 30}}>
                    <Text style={HabitDetail_style.lable}>Habit Name</Text>
                    <Text
                      style={[HabitDetail_style.detailText, {fontSize: 20}]}>
                      {habit.name}
                    </Text>
                  </View>

                  <View style={HabitDetail_style.ItemView}>
                    <Text style={HabitDetail_style.lable}>Type</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <Image
                        source={
                          habit.type == 'to-do'
                            ? require('../../../Assets/Icons/check.png')
                            : require('../../../Assets/Icons/remove.png')
                        }
                        style={{height: 15, width: 15, marginRight: 5}}
                      />
                      <Text
                        style={[HabitDetail_style.detailText, {marginTop: -2}]}>
                        {habit.type == 'to-do' ? 'TO-DO' : 'Not TO-DO'}
                      </Text>
                    </View>
                  </View>

                  <View style={HabitDetail_style.ItemView}>
                    <Text style={HabitDetail_style.lable}>Target Date</Text>
                    <Text style={[HabitDetail_style.detailText]}>
                      {moment(habit.target_date).format('DD MMM YYYY')}
                    </Text>
                  </View>

                  <View style={HabitDetail_style.ItemView}>
                    <Text style={HabitDetail_style.lable}>Start Date</Text>
                    <Text style={[HabitDetail_style.detailText]}>
                      {moment(habit.createdAt).format('DD MMM YYYY')}
                    </Text>
                  </View>

                  <View style={HabitDetail_style.ItemView}>
                    <Text style={HabitDetail_style.lable}>Frequency</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 5,
                      }}>
                      {habit?.frequency.map((x, i) => {
                        return (
                          <View
                            style={[
                              createHabit_styles.weekButton,
                              x.status && createHabit_styles.selectedButton,
                              {margin: 3},
                            ]}>
                            <Text
                              adjustsFontSizeToFit={true}
                              style={[
                                createHabit_styles.weekButtonText,
                                {
                                  color: x.status && Colors.primary,
                                  fontFamily: x.status
                                    ? font.bold
                                    : font.regular,
                                },
                              ]}>
                              {x.day.charAt(0)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  {habit.reminder && (
                    <View style={HabitDetail_style.ItemView}>
                      <Text style={HabitDetail_style.lable}>Reminder at</Text>
                      <Text style={[HabitDetail_style.detailText]}>
                        {moment(habit.reminder_time).format('hh:mm A')}
                      </Text>
                    </View>
                  )}

                  {/* Notes */}

                  <View style={HabitDetail_style.ItemView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Pressable
                        disabled={
                          !(
                            moment(currentWeek).startOf('week').valueOf() >
                            moment(habit?.createdAt).startOf('week').valueOf()
                          )
                        }
                        onPress={onPreviousWeek}
                        style={{
                          height: 40,
                          width: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F8F7FC',
                          borderWidth: 1,
                          borderColor: Colors.gray02,
                          borderRadius: 10,
                        }}>
                        <Image
                          source={require('../../../Assets/Icons/left_arrow.png')}
                          style={{
                            height: 10,
                            width: 10,
                            tintColor:
                              moment(currentWeek).startOf('week').valueOf() >
                              moment(habit?.createdAt).startOf('week').valueOf()
                                ? Colors.black
                                : Colors.placeHolder,
                          }}
                        />
                      </Pressable>
                      <Pressable
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: Colors.gray02,
                          backgroundColor: '#F8F7FC',
                          marginHorizontal: 4,
                          borderRadius: 10,
                          height: 40,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: font.medium,
                            textAlign: 'center',
                            fontSize: 14,
                          }}>
                          {moment(currentWeek).isSame(new Date(), 'week')
                            ? 'This Week'
                            : getWeekDates()}
                        </Text>
                      </Pressable>
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          backgroundColor: '#F8F7FC',
                          borderWidth: 1,
                          borderColor: Colors.gray02,
                          borderRadius: 10,
                          marginVertical: 10,
                        }}>
                        <Pressable
                          disabled={
                            !(
                              moment(currentWeek).endOf('week').valueOf() <
                                moment(habit?.target_date)
                                  .endOf('week')
                                  .valueOf() &&
                              moment(currentWeek).endOf('week').valueOf() <=
                                moment().valueOf()
                            )
                          }
                          onPress={onNextWeek}
                          style={{
                            height: 40,
                            width: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Image
                            source={require('../../../Assets/Icons/right_arrow.png')}
                            style={{
                              height: 10,
                              width: 10,
                              tintColor:
                                moment(currentWeek).endOf('week').valueOf() <
                                  moment(habit?.target_date)
                                    .endOf('week')
                                    .valueOf() &&
                                moment(currentWeek).endOf('week').valueOf() <=
                                  moment().valueOf()
                                  ? Colors.black
                                  : Colors.placeHolder,
                            }}
                          />
                        </Pressable>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      {currentWeekDays.map((x, i) => {
                        if (
                          habit?.frequency.findIndex(
                            y =>
                              y.day.toLowerCase() ===
                                moment(x).format('dddd').toLowerCase() &&
                              y.status == true,
                          ) != -1
                        ) {
                          return (
                            <Pressable
                              onPress={() => {
                                if (!moment(x).isAfter(moment())) {
                                  if (!checkCompleted(x)) {
                                    setNote({
                                      modalVisible: true,
                                      text: '',
                                      update: false,
                                      item: x,
                                    });
                                  } else {
                                    props.navigation.navigate(
                                      screens.NotesDetail,
                                      {
                                        habit: habit,
                                        date: moment(x).toISOString(),
                                        backScreenfunc: forNextScreen,
                                        updateHabit: params?.updateHabit,
                                      },
                                    );
                                  }
                                } else {
                                  showToast(
                                    'You cannot mark complete for future days',
                                    'Alert',
                                  );
                                }
                              }}
                              style={{
                                borderWidth: 1,
                                borderColor: Colors.gray02,
                                borderRadius: 10,
                                // padding: 5,
                                margin: 5,
                                flex: 1,
                                // width: '14.1%',
                                aspectRatio: 0.7,
                                justifyContent: 'center',
                                backgroundColor: checkCompleted(x)
                                  ? Colors.secondary
                                  : Colors.white,
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                }}>
                                <View style={{}}>
                                  <Text
                                    style={{
                                      textTransform: 'capitalize',
                                      fontFamily: checkCompleted(x)
                                        ? font.bold
                                        : font.regular,
                                      color: checkCompleted(x)
                                        ? Colors.primary
                                        : Colors.black,
                                    }}>
                                    {moment(x).format('dddd').charAt(0)}
                                  </Text>
                                </View>
                                <View>
                                  <View
                                    style={{
                                      height: 12,
                                      width: 12,
                                      marginTop: 10,
                                    }}>
                                    {checkCompleted(x) && (
                                      <Image
                                        style={{height: 12, width: 12}}
                                        source={require('../../../Assets/Icons/tick.png')}
                                      />
                                    )}
                                  </View>
                                </View>
                              </View>
                            </Pressable>
                          );
                        } else {
                          return (
                            <View
                              opacity={0.5}
                              style={{
                                borderWidth: 1,
                                borderColor: Colors.gray02,
                                borderRadius: 10,
                                margin: 5,
                                flex: 1,
                                aspectRatio: 0.7,
                                justifyContent: 'center',
                                // backgroundColor: Colors.gray01,
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                }}>
                                <View style={{}}>
                                  <Text
                                    style={{
                                      textTransform: 'capitalize',
                                      fontFamily: font.regular,
                                      color: Colors.gray10,
                                    }}>
                                    {moment(x).format('dddd').charAt(0)}
                                  </Text>
                                </View>
                                <View>
                                  <View
                                    style={{
                                      height: 12,
                                      width: 12,
                                      marginTop: 10,
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          );
                        }
                      })}
                    </View>
                    <View style={{marginVertical: 10}}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 16,
                          fontFamily: font.bold,
                          textAlign: 'center',
                        }}>
                        Notes
                      </Text>
                    </View>

                    <Pressable
                      onPress={onViewAllNotes}
                      style={{
                        alignSelf: 'flex-end',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: 12,
                          fontFamily: font.bold,
                        }}>
                        View All
                      </Text>
                    </Pressable>
                    <View style={{}}>
                      {checkNotesforthisweek(habit.notes).length == 0 && (
                        <EmptyView
                          style={{
                            marginTop: 0,
                            paddingVertical: 90,
                            width: '100%',
                          }}
                          noSubtitle
                          title="No Notes for this week"
                        />
                      )}
                      <>
                        {sorttheListbyDate(habit.notes).map((x, i) => {
                          if (
                            moment(x.date).isBetween(
                              moment(currentWeek).startOf('isoWeek'),
                              moment(currentWeek).endOf('isoWeek'),
                              undefined,
                              '[]',
                            ) &&
                            x.note_text != ''
                          )
                            return (
                              <LinearGradient
                                key={x.id}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                locations={[0.0, 0.99]}
                                colors={['#FCE29F', '#FCE29F55']}
                                style={{
                                  marginTop: 10,
                                  borderRadius: 10,
                                  padding: 10,
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <View style={{flex: 1}}>
                                    <Text
                                      style={{
                                        fontFamily: font.medium,
                                        fontSize: 12,
                                        color: Colors.gray12,
                                      }}>
                                      {x.note_text}
                                    </Text>
                                  </View>
                                  <Menu
                                    ref={ref => (MenuRef.current[i] = ref)}
                                    style={{
                                      backgroundColor: Colors.white,
                                    }}
                                    onRequestClose={() =>
                                      MenuRef.current[i].hide()
                                    }
                                    anchor={
                                      <Pressable
                                        onPress={() =>
                                          MenuRef.current[i].show()
                                        }
                                        style={{
                                          height: 25,
                                          width: 25,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginRight: -5,
                                          marginTop: -5,
                                          borderRadius: 25 / 2,
                                        }}>
                                        <Image
                                          style={{
                                            height: 10,
                                            width: 10,
                                            tintColor: Colors.gray12,
                                          }}
                                          source={require('../../../Assets/Icons/threeDots.png')}
                                        />
                                      </Pressable>
                                    }>
                                    <MenuItem onPress={() => editNote(i, x)}>
                                      <Text style={{fontFamily: font.bold}}>
                                        Edit
                                      </Text>
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem
                                      onPress={() => {
                                        deleteNote(
                                          {
                                            note_id: x._id,
                                            note_text: '',
                                            date: x.date,
                                          },
                                          i,
                                        );
                                        MenuRef.current[i].hide();
                                      }}>
                                      <Text style={{fontFamily: font.bold}}>
                                        Delete
                                      </Text>
                                    </MenuItem>
                                  </Menu>
                                </View>
                                <Text
                                  style={{
                                    fontFamily: font.medium,
                                    fontSize: 10,
                                    textAlign: 'right',
                                    color: Colors.black,
                                    marginTop: 5,
                                  }}>
                                  {moment(x.date).format('dddd, DD MMM YYYY')}
                                </Text>
                              </LinearGradient>
                            );
                        })}
                      </>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
          <Loader enable={isLoading} />
          {editNoteModal()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HabitDetail;

const HabitDetail_style = StyleSheet.create({
  lable: {
    fontSize: 12,
    fontFamily: font.regular,
    color: Colors.placeHolder,
  },
  detailText: {
    fontSize: 14,
    fontFamily: font.bold,
    marginTop: 5,
    color: Colors.black,
  },
  ItemView: {
    marginTop: 20,
  },
});
