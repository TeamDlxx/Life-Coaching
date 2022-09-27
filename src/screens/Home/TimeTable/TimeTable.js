import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {FAB_style, mainStyles, other_style} from '../../../Utilities/styles';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import Menuicon from '../../../Assets/Icons/menu.png';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import Modal from 'react-native-modal';

const TimeTable = props => {
  // Modal
  const [currentMonth, setCurrentMonth] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('yyyy-MM-DD'),
  );
  const [calendarMonth, setCalendarMonth] = useState(
    moment(new Date()).format('MMMM'),
  );
  const [schedules, setschedules] = useState([
    {
      title: 'Go for gym',
      time: '7:00 AM',
      image:
        'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
    },
    {
      title: 'Meeting with paddy',
      time: '8:00 AM',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const datecall = date => {
    setCurrentDate(date.dateString);
    // this.searchFilterFunction(date.dateString);
  };

  const gotoAddTask = () => {
    props.navigation.navigate(screens.addTask);
  };

  const gotoTaskDetail = () => {
    props.navigation.navigate(screens.taskDetail);
  };

  const cancelAction = () => {
    setModalVisible(false);
  };

  const modalOpen = () => {
    setModalVisible(true);
  };

  const EditModal = item => {
    return (
      <Modal
        onBackdropPress={() => cancelAction()}
        onRequestClose={cancelAction}
        isVisible={modalVisible == true}
        transparent={true}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View>
          <View
            style={{
              backgroundColor: Colors.background,
              width: '100%',
              paddingHorizontal: 18,
              paddingVertical: 15,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <View style={{width: '100%'}}>
              <View
                style={{
                  height: 5,
                  backgroundColor: Colors.gray04,
                  borderRadius: 5,
                  width: 60,
                  alignSelf: 'center',
                  marginBottom: 25,
                  marginTop: -5,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  cancelAction();
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: Colors.white,
                  borderRadius: 15,
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: '#007AFF',
                      fontSize: 15,
                      fontFamily: font.bold,
                    }}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cancelAction();
                }}
                style={{
                  marginTop: 1,
                  width: '100%',
                  height: 50,
                  backgroundColor: Colors.white,
                  borderRadius: 15,
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: '#007AFF',
                      fontSize: 15,
                      textAlign: 'center',
                      fontFamily: font.bold,
                    }}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{width: '100%', marginBottom: 10, marginTop: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    cancelAction();
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: Colors.white,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 15,
                        fontFamily: font.bold,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
        title={'Time Table'}
        // titleAlignLeft
      />
      {EditModal()}
      <View style={mainStyles.innerView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{marginTop: 10, borderRadius: 20, backgroundColor: 'white'}}>
            <Calendar
              dayComponent={({date, state}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      datecall(date);
                    }}>
                    {date.dateString == currentDate ? (
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          backgroundColor: Colors.primary,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: -7,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: state === 'disabled' ? 'gray' : 'white',
                          }}>
                          {date.day}
                        </Text>
                      </View>
                    ) : (
                      <View style={{width: 30, height: 30}}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: state === 'disabled' ? 'gray' : 'black',
                          }}>
                          {date.day}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              initialDate={currentMonth}
              key={currentMonth}
              minDate={'2012-05-10'}
              maxDate={'2023-05-30'}
              monthFormat={'MMMM'}
              onMonthChange={month => {
                console.log(month, 'month');
                setCalendarMonth(moment(month.dateString).format('MMMM'));
                setCurrentMonth(month.dateString);
              }}
              hideArrows={false}
              hideExtraDays={true}
              disableMonthChange={false}
              hideDayNames={false}
              showWeekNumbers={false}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              disableArrowLeft={false}
              disableArrowRight={false}
              disableAllTouchEventsForDisabledDays={true}
              renderHeader={date => {}}
              enableSwipeMonths={true}
              style={{
                borderRadius: 30,
                backgroundColor: Colors.white,
                paddingTop: 0,
                overflow: 'hidden',
                paddingBottom: 10,
                marginTop: 10,
              }}
              theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                calendarBorderRadius: 40,
                borderRadius: 30,
                textSectionTitleColor: Colors.black,
                textSectionTitleDisabledColor: Colors.primary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: 'black',
                todayTextColor: 'black',
                todayBackgroundColor: Colors.primary,
                dayTextColor: colors.white,
                textDisabledColor: 'gray',
                dotColor: Colors.primary,
                selectedDotColor: 'blue',
                arrowColor: Colors.primary,
                disabledArrowColor: Colors.primary,
                // monthTextColor: 'white',
                indicatorColor: Colors.primary,
                textDayFontSize: 13,
                textMonthFontSize: 16,
                textMonthFontWeight: 16,
                textDayHeaderFontSize: 14,
              }}
            />

            <Text
              style={[
                other_style.labelText,
                {
                  fontFamily: 'Pangram-ExtraBold',
                  textAlign: 'center',
                  position: 'absolute',
                  top: 23,
                  fontSize: 18,
                  right: 60,
                  left: 60,
                },
              ]}>
              {calendarMonth}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{marginTop: 20, justifyContent: 'center'}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={schedules}
                renderItem={({item, index}) => {
                  return (
                    <TouchableWithoutFeedback onPress={gotoTaskDetail}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                          width: '100%',
                          justifyContent: 'center',
                        }}>
                        {/* <Text style={{ transform: [{ rotate: '270deg' }], color: colors.gray, fontSize: 10, }}>{item.time}</Text> */}
                        <View
                          style={{
                            width: Dimensions.get('window').width - 43,
                            minHeight: 90,
                            backgroundColor: 'white',
                            ...styles.shadow,
                            borderRadius: 18,
                            padding: 15,
                            marginBottom: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 0,
                          }}>
                          <View style={{flex: 1.2}}>
                            <Image
                              source={{uri: item.image}}
                              style={[
                                styles.profileImage,
                                {height: 60, width: 60},
                              ]}
                            />
                          </View>
                          <View
                            style={{
                              flex: 4,
                              marginLeft: Platform.OS == 'android' ? 23 : 10,
                            }}>
                            <Text
                              style={[
                                styles.screenHeading,
                                {marginTop: 0, fontSize: 15, lineHeight: 22},
                              ]}>
                              {item.title}
                            </Text>
                            <Text style={{color: colors.gray, fontSize: 11}}>
                              {item.time}
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={modalOpen}
                            style={{padding: 5}}>
                            <Image
                              style={{height: 13, width: 13}}
                              source={Menuicon}></Image>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={
                            index + 1 === schedules.length ? {height: 100} : {}
                          }></View>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>

        <Pressable style={FAB_style.View} onPress={() => gotoAddTask()}>
          <Image
            source={require('../../../Assets/Icons/plus.png')}
            style={FAB_style.image}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TimeTable;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  profileImage: {
    height: 42,
    width: 42,
    borderRadius: 12,
  },
  screenHeading: {
    fontSize: 24,
    fontFamily: font.bold,
    color: Colors.black,
  },
});
