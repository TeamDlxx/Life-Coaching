import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, allHabit_styles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';

import {useContext} from 'react';
import Context from '../../../Context';

const AllHabits = props => {
  const [Token] = useContext(Context);
  //  Functions

  const findProgress = row => {
    let startDate = moment(row.createdAt, 'DD MMM YYYY');
    let endDate = moment(row.target_date, 'DD MMM YYYY');
    let diff = endDate.diff(startDate, 'days');
    return row.daysCompleted / diff;
  };
  //

  // Views
  const renderHabitsList = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          props.navigation.navigate(screens.habitDetail, {item: item})
        }
        style={allHabit_styles.itemView}>
        <View style={allHabit_styles.imageView}>
          <Image source={item.image} style={allHabit_styles.itemImage} />
        </View>
        <View style={allHabit_styles.detailView}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={allHabit_styles.title}>{item.title}</Text>

              <View style={allHabit_styles.targetDateView}>
                <Text style={allHabit_styles.targetDate}>
                  Target Date : {item.target_date}
                </Text>
              </View>
              {!!item.reminder && (
                <View style={allHabit_styles.reminderView}>
                  <Text style={allHabit_styles.reminderText}>
                    <Text>Reminder at {item.reminder_time}</Text>
                  </Text>
                </View>
              )}
            </View>
            {/* {!!item.status && (
              <View>
                <Image
                  source={require('../../../Assets/Icons/check.png')}
                  style={{height: 20, width: 20}}
                />
              </View>
            )} */}
          </View>
          <View style={allHabit_styles.weekView}>
            {weekDays.map((x, i) => {
              return (
                <View
                  style={[
                    allHabit_styles.weekDayView,
                    {
                      backgroundColor: item?.frequency?.find(z => z == x.day)
                        ? Colors.lightPrimary
                        : Colors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: item?.frequency?.find(z => z == x.day)
                        ? font.xbold
                        : font.medium,
                      fontSize: 12,
                      color: item?.frequency?.find(z => z == x.day)
                        ? Colors.primary
                        : Colors.placeHolder,
                    }}>
                    {x.name.charAt(0)}
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
                {Math.round(findProgress(item) * 100) + '%'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Progress.Bar
                color={Colors.primary}
                height={8}
                borderColor={Colors.gray02}
                borderRadius={13}
                borderWidth={1}
                progress={findProgress(item)}
                width={null}
              />
            </View>
          </View>
        </View>
        {!!item.status && (
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
              // width: 200,
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
        <SwipeListView
          useFlatList={true}
          contentContainerStyle={{paddingVertical: 10}}
          showsVerticalScrollIndicator={false}
          data={habitsList}
          renderItem={renderHabitsList}
          rightOpenValue={-60}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
          closeOnRowPress={true}
          keyExtractor={item => {
            return item._id;
          }}
          renderHiddenItem={() => (
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Delete Habite',
                  'Are you sure to delete this Habit',
                  [{text: 'No'}, {text: 'Yes'}],
                )
              }
              style={allHabit_styles.hiddenView}>
              <Image
                source={require('../../../Assets/Icons/trash.png')}
                style={allHabit_styles.hiddenIcon}
              />
            </Pressable>
          )}
        />
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
