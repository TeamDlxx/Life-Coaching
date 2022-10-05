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
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Header from '../../../Components/Header';
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
const screen = Dimensions.get('screen');
const week = [
  {name: 'monday', day: 1, status: false},
  {name: 'tuesday', day: 2, status: false},
  {name: 'wednesday', day: 3, status: false},
  {name: 'thursday', day: 4, status: false},
  {name: 'friday', day: 5, status: false},
  {name: 'satuday', day: 6, status: false},
  {name: 'sunday', day: 7, status: false},
];

const CreateHabit = props => {
  // Hooks
  const {params} = props.route;
  const {navigation} = props;
  console.log('navigation', navigation);
  const [Token] = useContext(Context);
  const [isLoading, setisLoading] = useState(false);

  const [Habit, setHabit] = useState({
    image: {
      uri: '',
      type: '',
      name: '',
    },
    localImage: '',
    title: '',
    type: null,
    reminder: {
      showModal: false,
      value: false,
      time: moment(),
    },
    targetDate: {
      showModal: false,
      value: false,
      date: moment(),
    },
    frequency: week,
  });
  const {title, type, reminder, targetDate, frequency, localImage, image} =
    Habit;
  const updateHabit = updation => setHabit({...Habit, ...updation});
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

  const btn_addHabit = async () => {
    let t_image = {...Habit.image};
    let t_habitName = Habit.title.trim();
    let t_type = Habit.type;
    let t_reminder = Habit.reminder;
    let t_targetDate = Habit.targetDate.date;
    let t_frequency = Habit.frequency.map(x => {
      return {
        status: x.status,
        day: x.name,
      };
    });
    console.log(t_image);
    if (t_image?.uri == '') {
      showToast('Please select an image', 'Alert');
    } else if (t_habitName == '') {
      showToast('Please enter Habit name', 'Alert');
    } else if (!isFirstLetterAlphabet(t_habitName)) {
      showToast('Habit name must start with alphabet [A-Z,a-z]', 'Alert');
    } else if (t_type == null) {
      showToast('Please select type of frequency', 'Alert');
    } else if (!t_frequency.some(x => x.status == true)) {
      showToast('Please select at least one frequency', 'Alert');
    } else {
      // let obj_createhabit = {
      //   name: t_habitName,
      //   type: t_type == 0 ? 'not to-do' : 'to-do',
      //   target_date: moment(t_targetDate).format('MM-DD-YYYY'),
      //   reminder: t_reminder.value,
      //   reminder_time: moment(t_reminder.time).format('HH:mm'),
      //   frequency: t_frequency,
      // };
      let fd_createhabit = new FormData();
      fd_createhabit.append('image', t_image);
      fd_createhabit.append('name', t_habitName);
      fd_createhabit.append('type', t_type == 0 ? 'not-to-do' : 'to-do');
      fd_createhabit.append('frequency', JSON.stringify(t_frequency));
      fd_createhabit.append(
        'target_date',
        moment(t_targetDate).format('MM-DD-YYYY'),
      );
      fd_createhabit.append('reminder', t_reminder.value);
      fd_createhabit.append(
        'reminder_time',
        moment(t_reminder.time).toISOString(),
      );

      console.log('Create Habit Obj', fd_createhabit);
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
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        navigation.navigate(screens.habitTracker);
      } else {
        showToast(res.message);
      }
    }
  };

  const setImage = img => {
    console.log('selected Image', img);
    updateHabit({
      image: {
        uri: img.path,
        type: img.mime,
        name: img.filename,
      },
      localImage: img.path,
    });
  };

  // USE EFFECT

  useEffect(() => {
    console.log('params', !!params?.todo);
    if (params?.item) {
      console.log('1');
      let {item} = params;
      updateHabit({
        title: item?.title,
        type: item?.to_do == true ? 1 : 0,
        reminder: {
          ...reminder,
          value: item?.reminder,
          time: moment(item?.reminder_time, 'hh:mm A'),
        },
        targetDate: {
          ...targetDate,
          date: moment(item?.target_date, 'DD MMM YYYY'),
        },
        frequency: [...item?.frequency],
      });
    } else if (params?.habit) {
      console.log('2');
      let {habit} = params;
      updateHabit({
        title: habit?.title,
        type: params.todo,
      });
    } else if (params?.todo != null && params?.todo != undefined) {
      console.log('3');
      updateHabit({
        type: params?.todo,
      });
    } else {
      console.log('4');
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
        title={!!params?.item ? 'Edit Habit' : 'Create Habit'}
      />
      <View style={[mainStyles.innerView, {paddingTop: 10}]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <UploadImage
              Token={Token}
              NetworkImage={image?.path}
              localImage={localImage}
              setImage={setImage}
              borderRadius={20}
              width={screen.width / 3}
            />
          </View>
          <View style={{marginTop: 10}}>
            <CustomSimpleTextInput
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
              // onPress={() => setTargetDate({...targetDate, showModal: true})}
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
              {week.map((x, i) => {
                return (
                  <Pressable
                    onPress={() => selectDay(x)}
                    style={[
                      createHabit_styles.weekButton,
                      frequency.find(y => y.day == x.day).status &&
                        createHabit_styles.selectedButton,
                    ]}>
                    <Text style={createHabit_styles.weekButtonText}>
                      {x.name.charAt(0)}
                    </Text>
                    <View style={{height: 12, width: 12, marginTop: 10}}>
                      {frequency.find(y => y.day == x.day).status && (
                        <Image
                          style={{height: 12, width: 12}}
                          source={require('../../../Assets/Icons/tick.png')}
                        />
                      )}
                    </View>
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
                  <Image
                    source={require('../../../Assets/Icons/edit.png')}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: Colors.placeHolder,
                      marginLeft: 5,
                    }}
                  />
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
            <CustomButton
              onPress={btn_addHabit}
              title={!!params?.item ? 'Save Changes' : 'Add Habit'}
            />
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
        display={Platform.OS == 'android' ? 'default' : 'inline'}
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
