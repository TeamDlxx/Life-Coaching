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
  Dimensions,
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
import CustomImage from '../../../Components/CustomImage';

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';

const screen = Dimensions.get('screen');
const ic_nodata = require('../../../Assets/Icons/empty-box.png');

const HabitTracker = props => {
  const {params} = props.route;
  const {navigation} = props;
  const {Token, habitList, setHabitList} = useContext(Context);
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

  const checkSelectedDayHabits = item => {
    return (
      item?.frequency?.find(
        x => x.day == moment(today, 'YYYY-MM-DD').format('dddd').toLowerCase(),
      ).status &&
      moment(today, 'YYYY-MM-DD').isSameOrBefore(moment(item.target_date))
    );
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

  const daysInMonth = () => {
    let currentWeek = moment().startOf('week').isoWeekday(1);
    let count = 6;
    let days = [];

    for (let i = 0; i <= count; i++) {
      let newobj = {};
      newobj.date = moment(currentWeek).add(i, 'day');
      newobj.mood = emojis[Math.floor(Math.random() * 5)];
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
      setNote({...note, modalVisible: true, item: item});
    }
  };

  const markCompeleted = () => {
    let {item} = note;
    let obj_addNote = {
      note_text: note.text.trim(),
      date: moment(today, 'YYYY-MM-DD').toISOString(),
    };
    api_addNote(item._id, obj_addNote);
    setisLoading(true);
    setNote({modalVisible: false, text: '', item: null});
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
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        updateHabitList(res?.habit);
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
      } else {
        showToast(res.message);
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
        console.log('response', res);
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
    setRefreshing(true);
    api_myHabits();
  };

  useEffect(() => {
    daysInMonth();
    callHabitListAPI();

    return () => {
      setHabitList([]);
    };
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
    if (checkSelectedDayHabits(item)) {
      return (
        <Pressable
          onPress={() =>
            props.navigation.navigate(screens.habitDetail, {id: item._id})
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
            <CustomImage
              source={{uri: fileURL + item?.images?.small}}
              style={{height: 50, width: 50}}
              indicatorProps={{
                color: Colors.primary,
              }}
            />
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 16,
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
            {moment(today, 'YYYY-MM-DD').isSameOrBefore(moment()) && (
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
    }
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
          <Loader enable={isLoading} />
          <View style={{flex: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshFlatList}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  progressBackgroundColor={Colors.white}
                />
              }
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
              ListEmptyComponent={() =>
                isLoading == false && (
                  <View
                    style={{
                      width: screen.width,
                      marginTop: screen.width / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={ic_nodata}
                      style={{
                        width: screen.width * 0.3,
                        height: screen.width * 0.3,
                      }}
                    />
                    <View style={{alignItems: 'center', marginTop: 10}}>
                      <Text style={{fontFamily: font.bold}}>No Data</Text>
                      <Text style={{fontFamily: font.regular}}>
                        Swipe down to refresh
                      </Text>
                    </View>
                  </View>
                )
              }
            />
          </View>
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
