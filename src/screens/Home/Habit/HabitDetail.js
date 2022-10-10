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
  const [note, setNote] = useState({
    modalVisible: false,
    item: null,
    text: '',
  });

  const updateNote = updation => setNote({...note, ...updation});

  const onPreviousWeek = () => {
    setCurrentWeek(moment(currentWeek).subtract(1, 'week'));
  };

  const onNextWeek = () => {
    setCurrentWeek(moment(currentWeek).add(1, 'week'));
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

  const deleteNote = (index, id) => {
    MenuRef.current[index].hide();
    Alert.alert('Delete Note', 'Are you sure to deleted this note', [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        onPress: () => api_removeNote(id),
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
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        setHabitDetail(res.habit);
        updateHabitList(res.habit);
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
    setRefreshing(false);
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

  const refreshDetail = () => {
    setRefreshing(true);
    api_habitDetail();
  };

  const updateHabitLocally = item => {
    setHabitDetail(item);
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
      <Header
        menu={dropDownMenu}
        navigation={props.navigation}
        title={'Habit Detail'}
      />
      <View style={{flex: 1}}>
        {habit != null && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshDetail}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.white}
              />
            }
            showsVerticalScrollIndicator={false}>
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
                  <Text style={[HabitDetail_style.detailText, {fontSize: 20}]}>
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
                    {habit.frequency.map((x, i) => {
                      return (
                        <View
                          style={[
                            createHabit_styles.weekButton,
                            x.status && createHabit_styles.selectedButton,
                            {margin: 3},
                          ]}>
                          <Text
                            adjustsFontSizeToFit={true}
                            style={[createHabit_styles.weekButtonText]}>
                            {x.day.charAt(0)}
                          </Text>
                          <View style={{height: 12, width: 12, marginTop: 10}}>
                            {x.status && (
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
                  <View style={{}}>
                    {sorttheListbyDate(habit.notes).map((x, i) => {
                      if (
                        moment(x.date).isBetween(
                          moment(currentWeek).startOf('isoWeek'),
                          moment(currentWeek).endOf('isoWeek'),
                          '[]',
                        )
                      )
                        return (
                          <LinearGradient
                            key={x.id}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            locations={[0.0, 0.99]}
                            colors={[Bcolors[i].dark, Bcolors[i].light]}
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
                                    // textAlign: 'justify',
                                  }}>
                                  {x.note_text}
                                </Text>
                              </View>
                              <Menu
                                ref={ref => (MenuRef.current[i] = ref)}
                                style={{
                                  backgroundColor: Colors.white,
                                }}
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
                                <MenuItem onPress={() => deleteNote(i, x._id)}>
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
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        <Loader enable={isLoading} />
        {editNoteModal()}
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
