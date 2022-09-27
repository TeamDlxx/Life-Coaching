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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, FAB_style, other_style} from '../../../Utilities/styles';
import moment from 'moment';
import {font} from '../../../Utilities/font';
import Modal from 'react-native-modal';
import {CustomMultilineTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import {screens} from '../../../Navigation/Screens';

const HabitTracker = props => {
  const daysFlatList = React.useRef();
  const [daysList, setDays] = useState([]);
  const [option, setOption] = useState(0);
  const [habitList, setHabitList] = useState([]);
  const [visibleAddHabitModal, setVisibleAddHabitModal] = useState(false);
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [note, setNote] = useState({
    text: '',
    modalVisible: false,
    item: null,
  });

  const daysInMonth = () => {
    let month = moment().month();
    let count = moment().month(month).daysInMonth();
    let days = [];
    for (let i = 1; i < count + 1; i++) {
      let newobj = {};
      newobj.date = moment().month(month).date(i);
      newobj.mood = emojis[Math.floor(Math.random() * 5)];
      days.push(newobj);
    }
    setDays([...days]);
  };

  const checkboxButton = item => {
    if (item.status == true) {
      setHabitList(prevState => {
        const newState = prevState.map(obj => {
          if (obj._id === item._id) {
            return {...obj, status: false};
          }
          return obj;
        });
        return newState;
      });
    } else {
      setNote({...note, modalVisible: true, item: item});
    }
  };

  const markCompeleted = () => {
    let {item} = note;
    setHabitList(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === item._id) {
          return {...obj, status: true, note: note.text};
        }
        return obj;
      });
      return newState;
    });
    setNote({modalVisible: false, text: '', item: null});
  };

  //? Navigation Functions

  const onChooseHabitScreen = async () => {
    await setVisibleAddHabitModal(false);
    props.navigation.navigate(screens.chooseHabit, {
      todo: option,
    });
  };

  useEffect(() => {
    daysInMonth();
    setHabitList(habitsList);
  }, []);

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

  //? Views

  const renderDays = ({item, index}) => {
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
        <View>
          {today == moment(item.date).format('YYYY-MM-DD') && (
            <View style={{marginRight: 10}}>
              <Text style={{fontSize: 36, color: Colors.white}}>
                {item?.mood?.emoji}
              </Text>
            </View>
          )}
        </View>
        <View style={{alignItems: 'center'}}>
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

  const renderHabitsList = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          props.navigation.navigate(screens.habitDetail, {item: item})
        }
        style={{
          // margin: 10,
          marginBottom: 15,
          alignItems: 'center',
          // padding: 10,
          borderRadius: 20,

          borderColor: Colors.gray02,
          borderWidth: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: 10,
          flexDirection: 'row',
          // paddingVertical: 16,
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
          <Image source={item.image} style={{height: 50, width: 50}} />
        </View>
        <View style={{marginLeft: 10, flex: 1}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 16,
              includeFontPadding: false,
              color: Colors.black,
            }}>
            {item.title}
          </Text>

          {item.status == true ? (
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
                  // tintColor: Colors.completed,
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

              <View style={{flex: 1}}>
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
          <TouchableHighlight
            underlayColor={Colors.lightPrimary2}
            style={{padding: 10, borderRadius: 900}}
            onPress={() => checkboxButton(item)}>
            <Image
              style={{
                height: 18,
                width: 18,
              }}
              source={
                item.status == true
                  ? require('../../../Assets/Icons/checked.png')
                  : require('../../../Assets/Icons/unchecked.png')
              }
            />
          </TouchableHighlight>
        </View>
      </Pressable>
    );
  };

  const flatListHeader = () => {
    return (
      <View style={{paddingHorizontal: 20, backgroundColor: Colors.background}}>
        <View style={{marginTop: 5}}>
          <Text style={other_style.labelText}>
            {moment().format('DD MMM YYYY')}
          </Text>
        </View>
        <View style={{marginHorizontal: -20, marginTop: 5}}>
          <FlatList
            listKey="days"
            initialNumToRender={31}
            ref={daysFlatList}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}
            data={daysList}
            horizontal={true}
            renderItem={renderDays}
            onScrollToIndexFailed={() => {
              console.log('scroll error');
            }}
          />
        </View>
        <View style={{marginTop: 5, marginBottom: 15}}>
          <Text style={other_style.labelText}>All Habits</Text>
        </View>
      </View>
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
          <View style={{paddingHorizontal: 10, marginVertical: 10}}>
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
          <View style={{marginTop: 30, marginBottom: 10, flexDirection: 'row'}}>
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
                  {tintColor: 'tomato'},
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
                  {tintColor: '#5dbb63'},
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
          {/* <View style={modalStyle.emojiView}>
            {emojis.map((item, index) => {
              return (
                <Pressable
                  onPress={() => setSelectedMood(item)}
                  style={[
                    selectedMood?._id == item._id
                      ? {
                          backgroundColor: Colors.lightPrimary,
                          borderRadius: 10,
                          borderColor: Colors.gray02,
                        }
                      : null,
                    {
                      flex: 1,
                      // paddingHorizontal: 10,
                      borderWidth: 1,
                      // borderWidth: 1,
                      borderColor: 'transparent',
                      paddingVertical: 10,
                      alignItems: 'center',

                      // backgroundColor:Colors.background
                    },
                  ]}>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{fontSize: 24, color: '#fff'}}>
                    {item.emoji}
                  </Text>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      fontSize: 12,
                      fontFamily: font.medium,
                      color:
                        selectedMood?._id == item._id
                          ? Colors.black
                          : Colors.gray14,
                      marginTop: 5,
                      textAlign: 'center',
                    }}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View> */}
          <View style={{marginHorizontal: 10, marginTop: 20}}>
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
        onBackButtonPress={() => setNote({...note, modalVisible: false})}
        onBackdropPress={() => setNote({...note, modalVisible: false})}
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
              lable={'Add Note'}
              placeholder={'Please enter a note for completing this Habit'}
              lableBold
              lableColor={Colors.black}
              value={note.text}
              onChangeText={text => setNote({...note, text: text})}
            />
          </View>
          <View style={{marginTop: 20}}>
            <CustomButton
              height={50}
              onPress={markCompeleted}
              title={'Mark Complete'}
            />
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
        title={'Habit Tracker'}
        titleAlignLeft
        rightIcon={require('../../../Assets/Icons/stats.png')}
        rightIcononPress={() => props.navigation.navigate(screens.habitStats)}
        rightIcon2={require('../../../Assets/Icons/list.png')}
        rightIcon2onPress={() => props.navigation.navigate(screens.allHabits)}
      />
      <View style={mainStyles.innerView}>
        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={flatListHeader()}
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            data={habitList}
            renderItem={renderHabitsList}
            keyExtractor={item => {
              return item._id;
            }}
          />
        </View>

        <Pressable
          style={FAB_style.View}
          onPress={() => setVisibleAddHabitModal(true)}>
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
  {name: 'Terrible', emoji: '😡', _id: '1'},
  {name: 'Bad', emoji: '🙁', _id: '2'},
  {name: 'Okay', emoji: '😐', _id: '3'},
  {name: 'Good', emoji: '🙂', _id: '4'},
  {name: 'Excellent', emoji: '😍', _id: '5'},
];

const habitsList = [
  {
    _id: '1',
    title: 'Leave Junk Food',
    status: false,
    note: '',
    frequency: [1, 2, 3, 4, 5, 6, 7],
    image: require('../../../Assets/Images/junkfood.webp'),
    to_do: false,
    target_date: '12 Oct 2022',
    reminder: true,
    reminder_time: '10:00 AM',
  },

  {
    _id: '2',
    title: 'Drink Water Regularly',
    status: true,
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    frequency: [1, 3, 4],
    image: require('../../../Assets/Images/water.png'),
    to_do: true,
    target_date: '12 Oct 2022',
    reminder: false,
    reminder_time: '06:30 PM',
  },

  {
    _id: '3',
    title: 'Quit Smoking',
    status: false,
    note: '',
    to_do: false,
    frequency: [1, 6, 7],
    image: require('../../../Assets/Images/smoking.jpeg'),
    target_date: '10 Nov 2022',
    reminder: true,
    reminder_time: '02:00 PM',
  },

  {
    _id: '4',
    title: 'Walk Regularly',
    status: true,
    note: '',
    to_do: true,
    frequency: [2, 3, 4],
    image: require('../../../Assets/Images/walking.webp'),
    target_date: '25 Sep  2022',
    reminder: true,
    reminder_time: '10:00 PM',
  },

  {
    _id: '23e1',
    title: 'Leave Junk Food',
    status: false,
    note: '',
    frequency: [1, 2, 3, 4, 5, 6, 7],
    image: require('../../../Assets/Images/junkfood.webp'),
    to_do: false,
    target_date: '12 Oct 2022',
    reminder: true,
    reminder_time: '10:00 AM',
  },

  {
    _id: 'fwe2',
    title: 'Drink Water Regularly',
    status: true,
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    frequency: [1, 3, 4],
    image: require('../../../Assets/Images/water.png'),
    to_do: true,
    target_date: '12 Oct 2022',
    reminder: false,
    reminder_time: '06:30 PM',
  },

  {
    _id: 'vDS3',
    title: 'Quit Smoking',
    status: false,
    note: '',
    to_do: false,
    frequency: [1, 6, 7],
    image: require('../../../Assets/Images/smoking.jpeg'),
    target_date: '10 Nov 2022',
    reminder: true,
    reminder_time: '02:00 PM',
  },

  {
    _id: '4EFWEFW',
    title: 'Walk Regularly',
    status: true,
    note: '',
    to_do: true,
    frequency: [2, 3, 4],
    image: require('../../../Assets/Images/walking.webp'),
    target_date: '25 Sep  2022',
    reminder: true,
    reminder_time: '10:00 PM',
  },

  {
    _id: '1F23F2WE',
    title: 'Leave Junk Food',
    status: false,
    note: '',
    frequency: [1, 2, 3, 4, 5, 6, 7],
    image: require('../../../Assets/Images/junkfood.webp'),
    to_do: false,
    target_date: '12 Oct 2022',
    reminder: true,
    reminder_time: '10:00 AM',
  },

  {
    _id: 'WEFWEF2',
    title: 'Drink Water Regularly',
    status: true,
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    frequency: [1, 3, 4],
    image: require('../../../Assets/Images/water.png'),
    to_do: true,
    target_date: '12 Oct 2022',
    reminder: false,
    reminder_time: '06:30 PM',
  },

  {
    _id: 'WEFBWRWEF3',
    title: 'Quit Smoking',
    status: false,
    note: '',
    to_do: false,
    frequency: [1, 6, 7],
    image: require('../../../Assets/Images/smoking.jpeg'),
    target_date: '10 Nov 2022',
    reminder: true,
    reminder_time: '02:00 PM',
  },

  {
    _id: '4WEFBRWEF',
    title: 'Walk Regularly',
    status: true,
    note: '',
    to_do: true,
    frequency: [2, 3, 4],
    image: require('../../../Assets/Images/walking.webp'),
    target_date: '25 Sep  2022',
    reminder: true,
    reminder_time: '10:00 PM',
  },
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
