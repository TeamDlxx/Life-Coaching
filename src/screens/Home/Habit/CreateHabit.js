import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Pressable,
  Switch,
  ScrollView,
  Platform,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Header from '../../../Components/Header';
import {useFocusEffect} from '@react-navigation/native';
import {
  mainStyles,
  other_style,
  createHabit_styles,
} from '../../../Utilities/styles';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';
import {screens} from '../../../Navigation/Screens';
import {CustomSimpleTextInput} from '../../../Components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import UploadImage from '../../../Components/UploadImage';
// For API's
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import {isFirstLetterAlphabet} from '../../../functions/regex';
import rountToNextmins from '../../../functions/rountToNextmins';
import PushNotification from 'react-native-push-notification';
const screen = Dimensions.get('screen');
const week = [
  {day: 'monday', status: false},
  {day: 'tuesday', status: false},
  {day: 'wednesday', status: false},
  {day: 'thursday', status: false},
  {day: 'friday', status: false},
  {day: 'saturday', status: false},
  {day: 'sunday', status: false},
];

const CreateHabit = props => {
  // Hooks
  const {params} = props.route;
  const {navigation} = props;
  const {Token, setHabitList, habitList} = useContext(Context);
  const [isLoading, setisLoading] = useState(false);

  const [Habit, setHabit] = useState({
    image: {
      uri: '',
      type: '',
      name: '',
    },
    preDefinedImage: null,
    localImage: '',
    title: '',
    type: null,
    reminder: {
      showModal: false,
      value: false,
      time: rountToNextmins(5),
    },
    targetDate: {
      showModal: false,
      value: false,
      date: moment().add(1, 'week'),
    },
    frequency: week,
  });
  const [oldData, setoldData] = useState({
    image: {
      uri: '',
      type: '',
      name: '',
    },
    preDefinedImage: null,
    localImage: '',
    title: '',
    type: null,
    reminder: {
      showModal: false,
      value: false,
      time: rountToNextmins(5),
    },
    targetDate: {
      showModal: false,
      value: false,
      date: moment().add(1, 'week'),
    },
    frequency: week,
  });
  const {
    title,
    type,
    reminder,
    targetDate,
    frequency,
    localImage,
    image,
    preDefinedImage,
  } = Habit;
  const updateHabit = updation => setHabit({...Habit, ...updation});
  const updateOldData = updation => setoldData({...Habit, ...updation});
  const selectDay = day => {
    let newArray = [...frequency];
    let index = newArray.findIndex(x => x.day == day.day);
    let newObj = newArray[index];
    newObj = {
      ...newObj,
      status: !newObj.status,
    };
    newArray.splice(index, 1, newObj);
    updateHabit({frequency: [...newArray]});
  };

  const btn_editHabit = async () => {
    let t_image = {...Habit.image};
    let t_habitName = Habit.title.trim();
    let t_type = Habit.type;
    let t_reminder = Habit.reminder;
    let t_targetDate = Habit.targetDate.date;
    let t_frequency = Habit.frequency.map(x => {
      return {
        day: x.day,
        status: x.status,
      };
    });

    if (t_habitName == '') {
      showToast('Please enter Habit name', 'Alert');
    } else if (t_type == null) {
      showToast('Please select type of frequency', 'Alert');
    } else if (!t_frequency.some(x => x.status == true)) {
      showToast('Please select at least one frequency', 'Alert');
    } else {
      let fd_editHabit = new FormData();
      if (!!t_image?.uri) {
        fd_editHabit.append('image', t_image);
      }
      fd_editHabit.append('name', t_habitName);
      fd_editHabit.append('type', t_type == 0 ? 'not-to-do' : 'to-do');
      fd_editHabit.append('frequency', JSON.stringify(t_frequency));
      fd_editHabit.append(
        'target_date',
        moment(t_targetDate).format('YYYY-MM-DD'),
      );
      if (Habit?.localImage == '' && Habit?.image?.uri == '') {
        fd_editHabit.append('remove_image', true);
      } else {
        fd_editHabit.append('remove_image', false);
      }
      fd_editHabit.append('reminder', t_reminder.value);
      fd_editHabit.append(
        'reminder_time',
        moment(t_reminder.time).toISOString(),
      );
      api_editHabit(fd_editHabit);
    }
  };

  const api_editHabit = async fdata => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/habit/edit_habit/' + params.item._id,
      method: 'PUT',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        if (res?.habit?.reminder) {
          RemoveThisHabitScheduleNotifications(res?.habit?._id);
          scheduleNotification(res?.habit);
        } else {
          RemoveThisHabitScheduleNotifications(res?.habit?._id);
        }
        showToast(
          'Habit has been updated successfully',
          'Habit Updated',
          'success',
        );
        if (!!params?.updateHabitDetail) {
          params?.updateHabitDetail(res.habit);
        }
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
        updateHabitList(res.habit);
        navigation.goBack();
      } else {
        showToast(res.message);
      }
    }
  };

  const RemoveThisHabitScheduleNotifications = id => {
    console.log('id for habit', id);
    PushNotification.getScheduledLocalNotifications(list => {
      list.map(x => {
        if (x.data._id == id) {
          PushNotification.cancelLocalNotification(x.id);
        }
      });
    });
  };

  const updateHabitList = habit => {
    let newArray = [...habitList];
    let index = newArray.findIndex(x => x._id == habit._id);
    if (index != -1) {
      newArray.splice(index, 1, habit);
      setHabitList(newArray);
    }
  };

  const btn_addHabit = async () => {
    let t_image = {...Habit.image};
    let t_preDefinedImage = Habit.preDefinedImage;
    console.log('preDefinedImage', t_preDefinedImage);
    let t_habitName = Habit.title.trim();
    let t_type = Habit.type;
    let t_reminder = Habit.reminder;
    let t_targetDate = Habit.targetDate.date;
    let t_frequency = Habit.frequency;
    if (t_habitName == '') {
      showToast('Please enter Habit name', 'Alert');
    } else if (t_type == null) {
      showToast('Please select type of frequency', 'Alert');
    } else if (!t_frequency.some(x => x.status == true)) {
      showToast('Please select at least one frequency', 'Alert');
    } else {
      let fd_createhabit = new FormData();
      if (t_image?.uri == '' && t_preDefinedImage == null) {
        // fd_createhabit.append('image', '');
        fd_createhabit.append('images', JSON.stringify({}));
      } else if (t_image?.uri != '') {
        fd_createhabit.append('image', t_image);
        fd_createhabit.append('images', JSON.stringify({}));
      } else {
        fd_createhabit.append('images', JSON.stringify(t_preDefinedImage));
      }

      if (t_image?.uri != '') {
        fd_createhabit.append('uploaded_img', false);
      } else {
        fd_createhabit.append('uploaded_img', true);
      }

      fd_createhabit.append('name', t_habitName);
      fd_createhabit.append('start_date', moment().toISOString());
      fd_createhabit.append('type', t_type == 0 ? 'not-to-do' : 'to-do');
      fd_createhabit.append('frequency', JSON.stringify(t_frequency));
      fd_createhabit.append(
        'target_date',
        moment(t_targetDate).format('YYYY-MM-DD'),
      );
      fd_createhabit.append('reminder', t_reminder.value);
      fd_createhabit.append(
        'reminder_time',
        moment(t_reminder.time).toISOString(),
      );

      api_createHabit(fd_createhabit);
    }
  };

  const api_createHabit = async fdata => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/habit/add_habit',
      method: 'POST',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        if (res?.habit?.reminder) {
          scheduleNotification(res?.habit);
        }
        setHabitList(res?.all_habits);
        navigation.navigate(screens.habitTracker);
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

  const scheduleNotification = obj_habit => {
    let days = [];
    obj_habit.frequency.filter(x => {
      if (x.status == true) {
        days.push(x.day.toLowerCase());
      }
    });

    let diff = 0;

    if (
      moment(obj_habit.target_date).format('DDMMYYYY') ==
      moment().format('DDMMYYYY')
    ) {
      diff = 0;
    } else {
      diff = moment(obj_habit.target_date).diff(moment(), 'days') + 1;
    }

    for (let i = 0; i <= diff; i++) {
      let day = moment().add(i, 'days');
      if (days.includes(day.format('dddd').toLowerCase())) {
        let scheduledTime = moment(
          day.format('DD-MM-YYYY') +
            ' ' +
            moment(obj_habit?.reminder_time).format('HH:mm'),
          'DD-MM-YYYY HH:mm',
        ).toISOString();
        if (moment(scheduledTime).isAfter(moment())) {
          PushNotification.localNotificationSchedule({
            title: obj_habit?.name,
            message: "Please complete your today's habit",
            date: moment(scheduledTime).toDate(),
            userInfo: {
              _id: obj_habit?._id,
              type: 'habit',
            },
            channelId: '6007',
            channelName: 'lifeCoaching',
          });
        }
      }
    }
  };

  const setImage = img => {
    console.log('img', img);

    if (img) {
      if (Platform.OS == 'android') {
        let name = img.path.split('/');

        updateHabit({
          image: {
            uri: img.path,
            type: img.mime,
            name: name[name.length - 1],
          },
          localImage: img.path,
        });
      } else if (Platform.OS == 'ios') {
        let name = img.path.split('/');
        updateHabit({
          image: {
            uri: img.path,
            type: img.mime,
            name: !!img.filename ? img.filename : name[name.length - 1],
          },
          localImage: img.path,
        });
      }
    } else {
      updateHabit({
        image: {
          uri: '',
          type: '',
          name: '',
        },
        preDefinedImage: null,
        localImage: '',
      });
    }
  };

  // USE EFFECT

  const onBackPress = () => {
    let arr1 = Habit?.frequency.map(x => x.status);
    let arr2 = oldData?.frequency.map(x => x.status);
    if (
      Habit?.title != oldData?.title ||
      Habit.type != oldData?.type ||
      Habit?.localImage != oldData?.localImage ||
      JSON.stringify(arr1) != JSON.stringify(arr2) ||
      moment(Habit?.targetDate?.date).format('DDMMYYYY') !=
        moment(oldData?.targetDate?.date).format('DDMMYYYY') ||
      Habit?.reminder?.value != oldData?.reminder?.value ||
      moment(Habit?.reminder?.time).format('HH:mm') !=
        moment(oldData?.reminder?.time).format('HH:mm')
    ) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to discard changes?',
        [{text: 'No'}, {text: 'Yes', onPress: () => props.navigation.goBack()}],
      );
    } else {
      props.navigation.goBack();
    }
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [Habit]),
  );
  useEffect(() => {
    if (params?.item) {
      let {item} = params;
      let changes = {
        title: item?.name,
        localImage: item?.images && fileURL + item?.images.large,
        type: item?.type == 'to-do' ? 1 : 0,
        reminder: {
          ...reminder,
          value: item?.reminder,
          time: moment(item?.reminder_time),
        },
        targetDate: {
          ...targetDate,
          date: moment(item?.target_date),
        },
        frequency: [...item?.frequency],
      };
      updateHabit({...changes});
      updateOldData({...changes});
    } else if (params?.habit) {
      let {habit} = params;
      let changes = {
        title: habit?.name,
        type: params.todo,
        preDefinedImage: habit?.images,
      };
      updateHabit({...changes});
      updateOldData({...changes});
    } else if (params?.todo != null && params?.todo != undefined) {
      let changes = {type: params?.todo};
      updateHabit({...changes});
      updateOldData({...changes});
    } else {
    }
  }, []);

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header
        navigation={props.navigation}
        onBackPress={onBackPress}
        title={!!params?.item ? 'Edit Habit' : 'Create Habit'}
      />
      <View style={[mainStyles.innerView, {paddingTop: 10}]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <UploadImage
              Token={Token}
              NetworkImage={image?.path}
              localImage={
                !!localImage
                  ? localImage
                  : !!preDefinedImage
                  ? fileURL + preDefinedImage?.large
                  : ''
              }
              setImage={setImage}
              borderRadius={20}
              width={screen.width / 3}
              removeImage={
                !!Habit?.image?.uri || !!localImage || !!preDefinedImage?.large
              }
            />
          </View>
          <View style={{marginTop: 10}}>
            <CustomSimpleTextInput
              autoCapitalize={true}
              lable={'Habit Name'}
              lableColor={Colors.black}
              lableBold={true}
              placeholder={'Your Custom Habit Name'}
              value={title}
              onChangeText={text => updateHabit({title: text})}
            />
          </View>

          <View style={{marginTop: 15}}>
            <View style={{marginBottom: 10}}>
              <Text style={other_style.labelText}>Type of Habit</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {(!!params?.habit == false ||
                (!!params?.todo == 0 && !!params?.habit == true)) && (
                <Pressable
                  onPress={() => updateHabit({type: 0})}
                  style={[
                    createHabit_styles.typeButton,
                    type == 0 && createHabit_styles.selectedButton,
                  ]}>
                  <Image
                    style={[createHabit_styles.typeButtonIcon]}
                    source={require('../../../Assets/Icons/remove.png')}
                  />
                  <Text style={createHabit_styles.typeButtonText}>
                    Not To-Do
                  </Text>
                </Pressable>
              )}
              {(!!params?.habit == false ||
                (!!params?.todo == 1 && !!params?.habit == true)) && (
                <Pressable
                  onPress={() => updateHabit({type: 1})}
                  style={[
                    createHabit_styles.typeButton,
                    type == 1 && createHabit_styles.selectedButton,
                  ]}>
                  <Image
                    style={[createHabit_styles.typeButtonIcon]}
                    source={require('../../../Assets/Icons/correct.png')}
                  />
                  <Text style={createHabit_styles.typeButtonText}>To-Do</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={{marginTop: 15}}>
            <View style={{marginBottom: 10}}>
              <Text style={other_style.labelText}>Target Date</Text>
            </View>
            <Pressable
              onPress={() =>
                updateHabit({targetDate: {...targetDate, showModal: true}})
              }
              style={{
                backgroundColor: Colors.white,
                padding: 20,
                borderRadius: 10,
                borderColor: Colors.gray02,
                borderWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{width: 20}} />
              <Text
                style={{
                  fontFamily: font.medium,
                  color: Colors.black,
                  flex: 1,
                  textAlign: 'center',
                }}>
                {moment(targetDate.date).format('DD MMMM YYYY')}
              </Text>

              <Image
                source={require('../../../Assets/Icons/calendar.png')}
                style={{height: 20, width: 20, tintColor: Colors.placeHolder}}
              />
            </Pressable>
          </View>

          <View style={{marginTop: 15}}>
            <View style={{marginBottom: 10}}>
              <Text style={other_style.labelText}>Frequency</Text>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {frequency.map((x, i) => {
                return (
                  <Pressable
                    onPress={() => selectDay(x)}
                    style={[
                      createHabit_styles.weekButton,
                      x.status && createHabit_styles.selectedButton,
                    ]}>
                    <Text
                      style={[
                        createHabit_styles.weekButtonText,
                        {
                          color:
                            x.status == true ? Colors.primary : Colors.black,
                        },
                      ]}>
                      {x.day.charAt(0)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={createHabit_styles.reminderView}>
            <View style={{marginBottom: 0, paddingVertical: 10}}>
              <Text style={other_style.labelText}>Habit Reminder</Text>
            </View>
            <View>
              <Switch
                onChange={() =>
                  updateHabit({reminder: {...reminder, value: !reminder.value}})
                }
                trackColor={{true: Colors.primary}}
                thumbColor={
                  Platform.OS == 'android' ? Colors.gray01 : Colors.white
                }
                value={reminder.value}
              />
            </View>
          </View>

          {reminder.value && (
            <View style={createHabit_styles.timeButton}>
              <Pressable
                onPress={() =>
                  updateHabit({
                    reminder: {...reminder, showModal: !reminder.showModal},
                  })
                }
                style={{
                  height: 35,
                  width: 35,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: -15,
                  marginTop: -20,
                }}>
                <Image
                  source={require('../../../Assets/Icons/edit.png')}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: Colors.placeHolder,
                    marginLeft: 5,
                  }}
                />
              </Pressable>
              <View style={{}}>
                <Image
                  source={require('../../../Assets/Icons/alert.png')}
                  style={{height: 80, width: 80}}
                />
              </View>
              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={[
                      createHabit_styles.timeButtonTextHeader,
                      {marginTop: 0},
                    ]}>
                    Set Reminder
                  </Text>
                </View>
                <Text style={createHabit_styles.timeButtonText1}>
                  You will recieve a reminder on specified days on the following
                  time{' '}
                </Text>
                <Pressable
                  onPress={() =>
                    updateHabit({
                      reminder: {...reminder, showModal: !reminder.showModal},
                    })
                  }
                  style={createHabit_styles.selectTimeButtion}>
                  <Text style={[createHabit_styles.timeButtonText2]}>
                    {moment(reminder.time).format('hh:mm A')}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={{marginVertical: 20}}>
            {!!params?.item ? (
              <CustomButton onPress={btn_editHabit} title={'Save Changes'} />
            ) : (
              <CustomButton onPress={btn_addHabit} title={'Add Habit'} />
            )}
          </View>
        </ScrollView>
        <Loader enable={isLoading} />
      </View>
      <DateTimePickerModal
        accentColor={Colors.primary}
        buttonTextColorIOS={Colors.primary}
        isVisible={reminder.showModal}
        mode="time"
        display="spinner"
        date={moment(Habit?.reminder?.time).toDate()}
        is24Hour={false}
        onConfirm={val =>
          updateHabit({
            reminder: {
              ...reminder,
              time: moment(val).toISOString(),
              showModal: false,
            },
          })
        }
        onCancel={() =>
          updateHabit({reminder: {...reminder, showModal: false}})
        }
      />

      <DateTimePickerModal
        isVisible={targetDate.showModal}
        mode="date"
        date={moment(targetDate.date).toDate()}
        display={Platform.OS == 'android' ? 'default' : 'spinner'}
        is24Hour={false}
        minimumDate={moment().toDate()}
        onConfirm={val =>
          updateHabit({
            targetDate: {
              ...targetDate,
              date: moment(val).toISOString(),
              showModal: false,
            },
          })
        }
        onCancel={() =>
          updateHabit({targetDate: {...targetDate, showModal: false}})
        }
        accentColor={Colors.primary}
        buttonTextColorIOS={Colors.primary}
      />
    </SafeAreaView>
  );
};

export default CreateHabit;
