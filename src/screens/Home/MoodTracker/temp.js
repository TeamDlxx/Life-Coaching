import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import styles, {
  mainStyles,
  FAB_style,
  other_style,
} from '../../../Utilities/styles';
import moment from 'moment';
import {font} from '../../../Utilities/font';
import Modal from 'react-native-modal';
import CustomButton from '../../../Components/CustomButton';
import {screens} from '../../../Navigation/Screens';


// Icons
import next from '../../../Assets/Icons/nextMonth.png';
import previous from '../../../Assets/Icons/previousMonth.png';
import addIcon from '../../../Assets/Icons/plus.png';

import Greateful from '../../../Assets/3Demojy/Greateful.png';
import Excited from '../../../Assets/3Demojy/Excited.png';
import Happy from '../../../Assets/3Demojy/Happy.png';
import Confused from '../../../Assets/3Demojy/Confused.png';
import Calm from '../../../Assets/3Demojy/Calm.png';
import Surprised from '../../../Assets/3Demojy/Surprised.png';
import Sick from '../../../Assets/3Demojy/Sick.png';
import Angry from '../../../Assets/3Demojy/Angry.png';
import Sleepy from '../../../Assets/3Demojy/Sleepy.png';

import Greateful1 from '../../../Assets/emojy/Greateful.png';
import Excited1 from '../../../Assets/emojy/Excited.png';
import Happy1 from '../../../Assets/emojy/Happy.png';
import Confused1 from '../../../Assets/emojy/Confused2.png';
import Calm1 from '../../../Assets/emojy/Calm.png';
import Surprised1 from '../../../Assets/emojy/Surprised.png';
import Sick1 from '../../../Assets/emojy/Sick.png';
import Angry1 from '../../../Assets/emojy/Angry.png';
import Sleepy1 from '../../../Assets/emojy/Sleepy.png';

const MoodTracker = props => {
  const daysFlatList = React.useRef();
  const [daysList, setDays] = useState([]);
  const [selectedMood, setSelectedMood] = useState({
    name: '',
    emoji: '',
    _id: '',
  });
  const [habitList, setHabitList] = useState([]);
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [currentMonth, setCurrentMonth] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const daysInMonth = item => {
    let month = item;
    let count = moment().month(month).daysInMonth();
    let days = [];
    for (let i = 1; i < count + 1; i++) {
      let newobj = {};
      newobj.date = moment().month(month).date(i);
      newobj.mood = emojis[Math.floor(Math.random() * 9)];
      days.push(newobj);
    }
    setDays([...days]);
    setIsAnimating(false);
  };

  useEffect(() => {
    setIsAnimating(true);
    daysInMonth(moment().month());
    setHabitList(habitsList);
  }, []);

  useEffect(() => {
    let index = daysList.findIndex(
      x => today == moment(x.date).format('YYYY-MM-DD'),
    );
    setCurrentIndex(index);
    if (index != -1) {
      setTimeout(() => {
        daysFlatList?.current?.scrollToIndex({
          animated: true,
          index: index,
        });
      }, 1000);
    }
  }, []);

  //? Views

  const nextMonth = () => {
    let newMonth = moment(currentMonth, 'YYYY-MM-DD')
      .add(1, 'months')
      .format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
    daysInMonth(moment(newMonth, 'YYYY-MM-DD').month());
  };

  const previousMonth = () => {
    let newMonth = moment(currentMonth, 'YYYY-MM-DD')
      .subtract(1, 'months')
      .format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
    daysInMonth(moment(newMonth, 'YYYY-MM-DD').month());
  };

  const changeMood = item => {
    setSelectedMood(item);
    console.log(item, 'item');
  };
  const gotoAddMood = () => {
    props.navigation.navigate(screens.addMood, {
      item: changeMood,
      selectedMood: selectedMood,
    });
  };

  // main render helping views
  const emptyMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary,
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const firstMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#70D9D2',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Sleepy}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const secondMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F07774',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Angry}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F07774',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const thirdMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#96B0EA',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Sick}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#96B0EA', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#96B0EA',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const forthMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FCEF8C',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Surprised}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FCEF8C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FCEF8C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FCEF8C',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const fifthMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#7FD0EE',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Calm}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#7FD0EE', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#7FD0EE', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#7FD0EE', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#7FD0EE',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const sixthMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#B0D785',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Confused}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#B0D785', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#B0D785', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#B0D785', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#B0D785', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#B0D785',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const seventhMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F6CA7C',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Happy}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#F6CA7C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#F6CA7C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#F6CA7C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#F6CA7C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#F6CA7C', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F6CA7C',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const eighthMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.lightPrimary2,
              width: 25,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#BB4CBD',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Excited}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#BB4CBD', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#BB4CBD',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const ninthMode = (item, index) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FBA283',
              width: 25,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Image style={{width: 25, height: 25}} source={Greateful}></Image>
          </View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, backgroundColor: '#FBA283', width: 25}}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FBA283',
              width: 25,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}></View>
          <Text
            style={{
              color: Colors.gray01,
              position: 'absolute',
              top: -10,
              width: 60,
              fontSize: 12,
            }}
            ellipsizeMode="clip"
            numberOfLines={1}>
            - - - - - - - - - -
          </Text>
        </View>
        {dayTimeView(item, index)}
      </View>
    );
  };

  const dayTimeView = (item, index) => {
    return (
      <View style={{flex: 2}}>
        <Text
          style={
            moment(item.date).format('YYYY-MM-DD') ==
            moment().format('YYYY-MM-DD')
              ? [
                  other_style.labelText,
                  {
                    marginTop: 10,
                    fontSize: 14,
                    color: Colors.black,
                    textAlign: 'center',
                  },
                ]
              : [
                  other_style.labelText,
                  {
                    marginTop: 10,
                    fontSize: 14,
                    color: Colors.gray07,
                    textAlign: 'center',
                  },
                ]
          }>
          {moment(item.date).format('ddd')}
        </Text>
        {moment(item.date).format('YYYY-MM-DD') ==
        moment().format('YYYY-MM-DD') ? (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
              alignSelf: 'center',
            }}>
            <Text
              style={[
                other_style.labelText,
                {fontSize: 12, color: Colors.white, textAlign: 'center'},
              ]}>
              {moment(item.date).format('DD')}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              other_style.labelText,
              {
                marginTop: 8,
                fontSize: 12,
                color: Colors.gray07,
                textAlign: 'center',
                fontFamily: 'Pangram-Medium',
              },
            ]}>
            {moment(item.date).format('DD')}
          </Text>
        )}
      </View>
    );
  };

  const isAnimatingIndicater = () => {
    return (
      isAnimating && (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          animating={isAnimating}
          style={styles.loading}
        />
      )
    );
  };

  const returnIcon = () => {
    console.log(selectedMood._id, 'selectedMood._id');
    if (selectedMood._id == '1') {
      return Greateful1;
    }
    if (selectedMood._id == '2') {
      return Excited1;
    }
    if (selectedMood._id == '3') {
      return Happy1;
    }
    if (selectedMood._id == '4') {
      return Confused1;
    }
    if (selectedMood._id == '5') {
      return Calm1;
    }
    if (selectedMood._id == '6') {
      return Surprised1;
    }
    if (selectedMood._id == '7') {
      return Sick1;
    }
    if (selectedMood._id == '8') {
      return Angry1;
    }
    if (selectedMood._id == '9') {
      console.log('done');
      return Sleepy1;
    }
  };

  // main render helping views .............

  // Main render View............
  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header
        navigation={props.navigation}
        title={'Mood Tracker'}
        // titleAlignLeft
      />
      <View style={mainStyles.innerView}>
        {isAnimatingIndicater()}
        <View style={{flex: 1, marginHorizontal: 0}}>
          <View
            style={{
              marginTop: 20,
              marginBottom: 10,
              alignItems: 'center',
              borderRadius: 20,
              borderColor: Colors.gray02,
              borderWidth: 1,
              backgroundColor: Colors.white,
              paddingHorizontal: 0,
              flexDirection: 'row',
              marginHorizontal: -5,
              height: 110,
            }}>
            <View style={{flex: 4, justifyContent: 'center'}}>
              {selectedMood.name == '' ? (
                <Text
                  style={[
                    other_style.labelText,
                    {
                      marginLeft: 25,
                      fontSize: 17,
                      letterSpacing: 0,
                      fontFamily: 'Pangram-ExtraBold',
                    },
                  ]}>
                  What's your {'\n'}mood today?
                </Text>
              ) : (
                <Text
                  style={[
                    other_style.labelText,
                    {
                      marginLeft: 25,
                      fontSize: 17,
                      letterSpacing: 0,
                      fontFamily: 'Pangram-ExtraBold',
                    },
                  ]}>
                  i'm feeling {'\n'}
                  {selectedMood.name} today.
                </Text>
              )}
            </View>
            <View style={{flex: 1}}>
              {selectedMood.emoji !== '' ? (
                <TouchableOpacity onPress={gotoAddMood}>
                  <Image
                    source={returnIcon()}
                    style={{width: 45, height: 45}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={gotoAddMood} style={modalStyle.View}>
                  <Image
                    source={addIcon}
                    style={[FAB_style.image, {height: 15, width: 15}]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View
            style={{
              flex: 9,
              backgroundColor: 'white',
              borderRadius: 20,
              marginHorizontal: -5,
            }}>
            <View style={{flex: 1.1, justifyContent: 'center'}}>
              <Text
                style={[
                  other_style.labelText,
                  {marginTop: 0, fontSize: 18, marginLeft: 17},
                ]}>
                Mood chart
              </Text>
            </View>
            <View style={{flex: 5, borderRadius: 8}}>
              <FlatList
                style={{flex: 5, borderRadius: 8, marginHorizontal: 15}}
                data={daysList}
                horizontal={true}
                initialNumToRender={31}
                ref={daysFlatList}
                onScrollToIndexFailed={() => {
                  console.log('scroll error');
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <View
                    style={
                      index == 0
                        ? {width: 60, flex: 1, marginLeft: 0}
                        : {width: 60, flex: 1}
                    }>
                    {item.mood._id == 0 && emptyMode(item, index)}

                    {item.mood._id == 1 && firstMode(item, index)}

                    {item.mood._id == 2 && secondMode(item, index)}

                    {item.mood._id == 3 && thirdMode(item, index)}

                    {item.mood._id == 4 && forthMode(item, index)}

                    {item.mood._id == 5 && fifthMode(item, index)}

                    {item.mood._id == 6 && sixthMode(item, index)}

                    {item.mood._id == 7 && seventhMode(item, index)}

                    {item.mood._id == 8 && eighthMode(item, index)}
                    {item.mood._id == 9 && ninthMode(item, index)}
                  </View>
                )}></FlatList>
            </View>
            <View
              style={{
                flex: 0.9,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  onPress={previousMonth}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: Colors.lightPrimary,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image style={{height: 18, width: 18}} source={previous} />
                </TouchableOpacity>
                <View
                  style={{
                    height: 40,
                    backgroundColor: Colors.lightPrimary,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={[
                      other_style.labelText,
                      {marginTop: 0, fontSize: 14, color: Colors.black},
                    ]}>
                    {moment(currentMonth, 'YYYY-MM-DD').format('MMMM')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={nextMonth}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: Colors.lightPrimary,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image style={{height: 18, width: 18}} source={next} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{flex: 1.5}}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoodTracker;

const emojis = [
  {name: 'Terrible', emoji: '😡', _id: '1'},
  {name: 'Bad', emoji: '🙁', _id: '2'},
  {name: 'Okay', emoji: '😐', _id: '3'},
  {name: 'Good', emoji: '🙂', _id: '4'},
  {name: 'Excellent', emoji: '😍', _id: '5'},
  {name: 'Excellent', emoji: '😍', _id: '6'},
  {name: 'Excellent', emoji: '😍', _id: '7'},
  {name: 'Excellent', emoji: '😍', _id: '8'},
  {name: 'Excellent', emoji: '😍', _id: '9'},
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.gray02,
    backgroundColor: Colors.background,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  selectedBtnView: {
    borderColor: Colors.gray02,
    backgroundColor: Colors.lightPrimary,
  },
  btn_text: {
    fontFamily: font.medium,
    fontSize: 16,
    color: Colors.gray10,
  },
  selectedBtnText: {
    color: Colors.primary,
  },
  btn_icon: {
    marginLeft: 5,
    height: 20,
    width: 20,
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
  View: {
    height: 55,
    width: 55,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // bottom: Platform.OS == 'ios' ? 0 : 20,
    // right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
