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
  DeviceEventEmitter
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {
  mainStyles,
  createHabit_styles,
  other_style,
} from '../../../Utilities/styles';
import {CustomMultilineTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {SwipeRow} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';

const screen = Dimensions.get('screen');

const HabitDetail = props => {
  const {params} = props.route;
  const MenuRef = useRef([]);
  const EditMenu = useRef();
  const [Habit, setHabit] = useState(habit);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [note, setNote] = useState({
    modalVisible: false,
    item: null,
    text: '',
  });

  const updateNote = updation => setNote({...note, ...updation});

  const onPreviousWeek = () => {
    setCurrentWeek(moment(currentWeek).subtract(1, 'week').isoWeekday(1));
  };

  const onNextWeek = () => {
    setCurrentWeek(moment(currentWeek).add(1, 'week').isoWeekday(1));
  };

  const getWeekDates = () => {
    let startDateOfWeek = moment(currentWeek).startOf('week');
    let endDateOfWeek = moment(currentWeek).endOf('week');
    console.log(startDateOfWeek, 'startDateOfWeek');
    console.log(endDateOfWeek, 'endDateOfWeek');
    return (
      moment(startDateOfWeek).format('DD MMM YYYY') +
      ' - ' +
      moment(endDateOfWeek).format('DD MMM YYYY')
    );
  };

  const editNoteModal = () => {
    return (
      <Modal
        isVisible={note.modalVisible}
        // isVisible={true}
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
              lable={'Edit Note'}
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
              onPress={() =>
                updateNote({modalVisible: false, text: '', item: null})
              }
              title={'Save Changes'}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const editNote = async (i, item) => {
    await MenuRef.current[i].hide();
    setTimeout(() => {
      updateNote({text: item.note, modalVisible: true});
    }, 400);
  };

  const deleteNote = i => {
    MenuRef.current[i].hide();
    Alert.alert('Delete Note', 'Are you sure to deleted this note', [
      {
        text: 'No',
      },
      {
        text: 'Yes',
      },
    ]);
  };

  useEffect(() => {
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
              // backgroundColor:'pink',
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
      <Header
        menu={dropDownMenu}
        navigation={props.navigation}
        title={'Habit Detail'}
      />
      <View style={{flex: 1}}>
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
                }}>
                <Image
                  source={Habit.image}
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    borderRadius: 20,
                  }}
                />
              </View>
              <View style={{marginTop: 30}}>
                <Text style={HabitDetail_style.lable}>Habit Name</Text>
                <Text style={[HabitDetail_style.detailText, {fontSize: 20}]}>
                  {Habit.title}
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
                      !!Habit.to_do
                        ? require('../../../Assets/Icons/check.png')
                        : require('../../../Assets/Icons/remove.png')
                    }
                    style={{height: 15, width: 15, marginRight: 5}}
                  />
                  <Text style={[HabitDetail_style.detailText, {marginTop: -2}]}>
                    {!!Habit.to_do ? 'TO-DO' : 'Not TO-DO'}
                  </Text>
                </View>
              </View>

              <View style={HabitDetail_style.ItemView}>
                <Text style={HabitDetail_style.lable}>Target Date</Text>
                <Text style={[HabitDetail_style.detailText]}>
                  {Habit.target_date}
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
                  {week.map((x, i) => {
                    return (
                      <View
                        style={[
                          createHabit_styles.weekButton,
                          Habit.frequency.find(y => y == x.day) &&
                            createHabit_styles.selectedButton,
                          {margin: 3},
                        ]}>
                        <Text
                          adjustsFontSizeToFit={true}
                          style={[createHabit_styles.weekButtonText]}>
                          {x.name.charAt(0)}
                        </Text>
                        <View style={{height: 12, width: 12, marginTop: 10}}>
                          {Habit.frequency.find(y => y == x.day) && (
                            <Image
                              style={{height: 12, width: 12}}
                              source={require('../../../Assets/Icons/tick.png')}
                            />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={HabitDetail_style.ItemView}>
                <Text style={HabitDetail_style.lable}>Reminder at</Text>
                <Text style={[HabitDetail_style.detailText]}>
                  {Habit.reminder_time}
                </Text>
              </View>

              <View style={HabitDetail_style.ItemView}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 20,
                    fontFamily: font.bold,
                    textAlign: 'center',
                  }}>
                  Notes
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Pressable
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
                      style={{height: 10, width: 10}}
                    />
                  </Pressable>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: Colors.gray02,
                      backgroundColor: '#F8F7FC',
                      // borderWidth: 1,
                      // borderColor: Colors.gray02,
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
                  </View>
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
                          moment(currentWeek).add(1, 'week').valueOf() <
                          moment().valueOf()
                        )
                      }
                      onPress={onNextWeek}
                      style={{
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: Colors.white,
                        // borderWidth: 1,
                        // borderColor: Colors.gray02,
                        // borderRadius: 10,
                      }}>
                      <Image
                        source={require('../../../Assets/Icons/right_arrow.png')}
                        style={{
                          height: 10,
                          width: 10,
                          tintColor:
                            moment(currentWeek).add(1, 'week').valueOf() <
                            moment().valueOf()
                              ? Colors.black
                              : Colors.placeHolder,
                        }}
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={{}}>
                  {Habit.notes.map((x, i) => {
                    if (!!x.note)
                      return (
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          locations={[0.0, 0.99]}
                          colors={[Bcolors[i], Bcolors2[i]]}
                          // locations={[0,0.5]}
                          style={{
                            marginTop: 10,
                            borderRadius: 10,
                            padding: 10,
                            // backgroundColor:
                            //   Bcolors[Math.floor(Math.random() * Bcolors.length)],
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  fontFamily: font.medium,
                                  fontSize: 12,
                                  color: Colors.gray12,
                                  // textAlign: 'justify',
                                }}>
                                {x.note}
                              </Text>
                            </View>
                            <Menu
                              ref={ref => (MenuRef.current[i] = ref)}
                              style={{
                                backgroundColor: Colors.white,
                              }}
                              visible={menuVisible}
                              onRequestClose={() => MenuRef.current[i].hide()}
                              anchor={
                                <Pressable
                                  onPress={() => MenuRef.current[i].show()}
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
                              <MenuItem onPress={() => deleteNote(i)}>
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
                            }}>
                            {moment(currentWeek)
                              .endOf('week')
                              .subtract(i, 'day')
                              .format('DD MMM YYYY')}
                          </Text>
                        </LinearGradient>
                      );
                  })}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {editNoteModal()}
      </View>
    </SafeAreaView>
  );
};

export default HabitDetail;

const habit = {
  _id: '1',
  title: 'Leave Junk Food',
  status: true,
  frequency: [1, 2, 4, 6, 7],
  image: require('../../../Assets/Images/junkfood.webp'),
  to_do: false,
  target_date: '12 Oct 2022',
  createdAt: '01 Aug 2022',
  reminder: true,
  reminder_time: '10:00 AM',
  notes: [
    {
      id: '1',
      date: '27 Aug 2022',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },

    {
      id: '2',
      date: '26 Aug 2022',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },

    {
      id: '3',
      date: '25 Aug 2022',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },

    {
      id: '4',
      date: '25 Aug 2022',

      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },

    {
      id: '5',
      date: '24 Aug 2022',

      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },
    {
      id: '6',
      date: '24 Aug 2022',

      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },
    {
      id: '7',
      date: '24 Aug 2022',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat elementum ultrices. Quisque rutrum est id ipsum laoreet cursus. Mauris congue imperdiet ipsum sed posuere',
    },
  ],
};

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
    // paddingTop:10
  },
});

const Bcolors = [
  '#EAF5FC',
  '#C4C0F6',
  '#FCE29F',
  '#B0D7C3',
  '#96EBD2',
  '#C1D5FF',
  '#FFB6BC',
];

const Bcolors2 = [
  '#EAF5FC55',
  '#C4C0F655',
  '#FCE29F55',
  '#B0D7C355',
  '#96EBD255',
  '#C1D5FF55',
  '#FFB6BC55',
];

const week = [
  {name: 'Monday', day: 1},
  {name: 'Tuesday', day: 2},
  {name: 'Wednesday', day: 3},
  {name: 'Thursday', day: 4},
  {name: 'Friday', day: 5},
  {name: 'Satuday', day: 6},
  {name: 'Sunday', day: 7},
];
//
