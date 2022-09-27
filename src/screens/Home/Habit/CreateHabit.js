import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const week = [
  {name: 'Monday', day: 1},
  {name: 'Tuesday', day: 2},
  {name: 'Wednesday', day: 3},
  {name: 'Thursday', day: 4},
  {name: 'Friday', day: 5},
  {name: 'Satuday', day: 6},
  {name: 'Sunday', day: 7},
];

const CreateHabit = props => {
  // Hooks
  const {params} = props.route;
  const [Habit, setHabit] = useState({
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
    frequency: [],
  });
  const {title, type, reminder, targetDate, frequency} = Habit;
  const updateHabit = updation => setHabit({...Habit, ...updation});
  const selectDay = day => {
    let newArray = [...frequency];
    let index = newArray.findIndex(x => x == day.day);
    if (index != -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(day.day);
    }

    updateHabit({frequency: [...newArray]});
  };

  // USE EFFECT

  useEffect(() => {
    console.log('params', params);
    if (!!params?.item) {
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
    }

    if (!!params?.habit) {
      let {habit} = params;
      updateHabit({
        title: habit?.title,
        type: params.todo,
      });
    }
  }, []);

  useEffect(() => {
    console.log('HABIT', Habit);
  }, [Habit]);

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
          <View style={{marginTop: 10}}>
            <CustomSimpleTextInput
              lable={'Habit Name'}
              lableColor={Colors.black}
              lableBold={true}
              // editable={!!!params?.habit}
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
                    Habit.type == 0 && createHabit_styles.selectedButton,
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
                    Habit.type == 1 && createHabit_styles.selectedButton,
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
                      frequency.find(y => y == x.day) &&
                        createHabit_styles.selectedButton,
                    ]}>
                    <Text style={createHabit_styles.weekButtonText}>
                      {x.name.charAt(0)}
                    </Text>
                    <View style={{height: 12, width: 12, marginTop: 10}}>
                      {frequency.find(y => y == x.day) && (
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
              onPress={() => props.navigation.navigate(screens.habitTracker)}
              title={!!params?.item ? 'Save Changes' : 'Add Habit'}
            />
          </View>
        </ScrollView>
      </View>
      <DateTimePickerModal
        buttonTextColorIOS={Colors.primary}
        isVisible={reminder.showModal}
        mode="time"
        display="spinner"
        is24Hour={false}
        onConfirm={val =>
          updateHabit({reminder: {...reminder, time: val, showModal: false}})
        }
        onCancel={() =>
          updateHabit({reminder: {...reminder, showModal: false}})
        }
      />

      <DateTimePickerModal
        buttonTextColorIOS={Colors.primary}
        isVisible={targetDate.showModal}
        mode="date"
        display="spinner"
        is24Hour={false}
        onConfirm={val =>
          updateHabit({
            targetDate: {...targetDate, date: val, showModal: false},
          })
        }
        onCancel={() =>
          updateHabit({targetDate: {...targetDate, showModal: false}})
        }
      />
    </SafeAreaView>
  );
};

export default CreateHabit;
