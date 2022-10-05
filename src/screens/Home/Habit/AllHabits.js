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
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, allHabit_styles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
// fro API calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';

const ic_nodata = require('../../../Assets/Icons/empty-box.png');
const screen = Dimensions.get('screen');

const AllHabits = props => {
  const [Token] = useContext(Context);
  const [sHabitList, setHabitList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //  Functions

  const refreshFlatList = () => {
    setRefreshing(true);
    api_habitList();
  };

  const findProgress = row => {
    let startDate = moment(row.createdAt, 'DD MMM YYYY');
    let endDate = moment(row.target_date, 'DD MMM YYYY');
    let diff = endDate.diff(startDate, 'days');
    return row.daysCompleted / diff;
  };

  const callHabitListApi = () => {
    setisLoading(true);
    api_habitList();
  };

  const api_habitList = async () => {
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
        showToast(
          'Habit has been deleted successfully',
          'Habit Deleted',
          'success',
        );
        removeHabitFromList(id);
      } else {
        showToast(res.message);
      }
    }
  };

  const removeHabitFromList = id => {
    let newArray = [...sHabitList];
    let index = newArray.findIndex(x => x._id == id);
    newArray.splice(index, 1);
    setHabitList(newArray);
  };
  //

  React.useEffect(() => {
    callHabitListApi();
  }, []);

  // Views
  const renderHabitsList = ({item, index}) => {
    let randomNumber = Math.random();
    return (
      <Pressable style={allHabit_styles.itemView}>
        <View style={allHabit_styles.imageView}>
          <CustomImage
            source={{uri: fileURL + item.images?.small}}
            indicatorProps={{color: Colors.primary}}
            style={allHabit_styles.itemImage}
          />
        </View>
        <View style={allHabit_styles.detailView}>
          <View style={{flex: 1}}>
            <Text style={allHabit_styles.title}>{item.name}</Text>
            <View style={allHabit_styles.targetDateView}>
              <Text style={allHabit_styles.targetDate}>
                Target Date : {moment(item.target_date).format('DD MMM YYYY')}
              </Text>
            </View>
            <View style={{height: 14}}>
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
                </View>
              );
            })}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
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
                {Math.round(randomNumber * 100) + '%'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Progress.Bar
                color={Colors.primary}
                height={8}
                borderColor={Colors.gray02}
                borderRadius={13}
                borderWidth={1}
                progress={randomNumber * 1}
                width={null}
              />
            </View>
          </View>
        </View>
        {!!Math.floor(randomNumber * 1) && (
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 30,
              paddingVertical: 5,
              transform: [{rotateZ: '-45deg'}],
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
              //    width: 200,
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

      <View style={{flex: 1}}>
        {/* <Loader enable={isLoading} /> */}
        <View style={{flex: 1}}>
          <SwipeListView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshFlatList}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.white}
              />
            }
            useFlatList={true}
            contentContainerStyle={{paddingVertical: 10}}
            showsVerticalScrollIndicator={false}
            data={sHabitList}
            renderItem={renderHabitsList}
            rightOpenValue={-60}
            disableRightSwipe={true}
            closeOnRowBeginSwipe={true}
            closeOnRowPress={true}
            keyExtractor={item => {
              return item._id;
            }}
            renderHiddenItem={({item, index}) => {
              return (
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Delete Habite',
                      'Are you sure to delete this Habit',
                      [
                        {text: 'No'},
                        {text: 'Yes', onPress: () => api_deleteHabit(item._id)},
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
    </SafeAreaView>
  );
};

export default AllHabits;

const weekDays = [
  {name: 'Monday', day: 1, value: false},
  {name: 'Tuesday', day: 2, value: false},
  {name: 'Wednesday', day: 3, value: false},
  {name: 'Thursday', day: 4, value: false},
  {name: 'Friday', day: 5, value: false},
  {name: 'Satuday', day: 6, value: false},
  {name: 'Sunday', day: 7, value: false},
];

const habitsList = [
  {
    _id: '1',
    title: 'Leave Junk Food',
    status: false,
    frequency: [1, 2, 3, 4, 5, 6, 7],
    image: require('../../../Assets/Images/junkfood.webp'),
    to_do: false,
    target_date: '12 Oct 2022',
    daysCompleted: 10,
    reminder: true,
    reminder_time: '10:00 AM',
    createdAt: '30 Aug 2022',
  },

  {
    _id: '2',
    title: 'Drink Water Regularly',
    status: true,
    frequency: [1, 3, 4],
    image: require('../../../Assets/Images/water.png'),
    to_do: true,
    target_date: '12 Oct 2022',
    reminder: false,
    daysCompleted: 10,
    reminder_time: '06:30 PM',
    createdAt: '30 Aug 2022',
  },

  {
    _id: '3',
    title: 'Quit Smoking',
    status: false,
    to_do: false,
    daysCompleted: 10,
    frequency: [1, 6, 7],
    image: require('../../../Assets/Images/smoking.jpeg'),
    target_date: '10 Nov 2022',
    createdAt: '30 Aug 2022',
    reminder: true,
    reminder_time: '02:00 PM',
  },

  {
    _id: '4',
    title: 'Walk Regularly',
    status: true,
    to_do: true,
    daysCompleted: 10,
    frequency: [2, 3, 4],
    image: require('../../../Assets/Images/walking.webp'),
    target_date: '25 Sep  2022',
    createdAt: '30 Aug 2022',
    reminder: true,
    reminder_time: '10:00 PM',
  },
];
