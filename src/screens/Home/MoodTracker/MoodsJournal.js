import React, { useEffect, useState } from 'react';
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
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style, other_style } from '../../../Utilities/styles';
import moment, { months } from 'moment';
import { font } from '../../../Utilities/font';

import { screens } from '../../../Navigation/Screens';
import PushNotification from 'react-native-push-notification';
import LoginAlert from '../../../Components/LoginAlert';
import analytics from '@react-native-firebase/analytics';

import { BannerAd, BannerAdSize, useRewardedAd } from 'react-native-google-mobile-ads';
import {Admob_Ids} from '../../../Utilities/AdmobIds';

// import {useLoginAlert} from '../../../hooks/useLoginAlert';
// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';


import Happy from "../../../Assets/emojy/smile.gif"
import Neutral from "../../../Assets/emojy/neutral.gif"
import Sad from "../../../Assets/emojy/sad.gif"
import Cry from "../../../Assets/emojy/cry.gif"
import Angry from "../../../Assets/emojy/angrygif.gif"


const data = {
  labels: ["Happy", "Excited", "Sad", "Cry", "Neutral", "Angry"],
  datasets: [
    {
      data: [10, 20, 79, 50, 90, 95],
      color: (opacity = 1) => Colors.primary, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: [] // optional
};


const chartConfig = {

  backgroundColor: "gray",
  backgroundGradientFrom: "",
  backgroundGradientTo: "",
  color: (opacity = 1) => `silver`,
  labelColor: (opacity = 1) => `black`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  decimalPlaces: 0,

  useShadowColorFromDataset: true, // optional


  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: Colors.primary,

  },

  style: {
    borderRadius: 16
  },

};

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";




const MoodsJournal = props => {


  const { Token, habitList, setHabitList, isHabitPurchased } =
    useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const daysFlatList = React.useRef();
  const [daysList, setDays] = useState([]);

  const [moodsJournal, setMoodsJournal] = useState([
    { "icon": Happy, "emotion": "Happy", "date": "Today, 08:15pm", "sphere": "Work", "title": "I am so Happy Today", "description": "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available." },
    { "icon": Sad, "emotion": "Sad", "date": "Today, 08:15pm", "sphere": "Health", "title": "I am so Happy Today", "description": "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available." },
    { "icon": Cry, "emotion": "Crying", "date": "Today, 08:15pm", "sphere": "Friends", "title": "I am so Happy Today", "description": "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available." },
    { "icon": Angry, "emotion": "Angry", "date": "Today, 08:15pm", "sphere": "Family", "title": "I am so Happy Today", "description": "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available." }
  ]);

  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));

  const [adError, setAdError] = useState(false);



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

  const btn_add = () => {
      props.navigation.navigate(screens.moodTracker)


  };

  const daysInMonth = () => {
    let currentWeek = moment().startOf('week').isoWeekday(1);
    let count = 6;
    let days = [];

    for (let i = 0; i <= count; i++) {
      let newobj = {};
      newobj.date = moment(currentWeek).add(i, 'day');
      days.push(newobj);
    }
    setDays([...days]);
  };












  useEffect(() => {
    daysInMonth();

  }, [Token]);



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
      }, 300);
    }
  }, [daysList]);

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  }, []);

  //? Views

  const renderDays = ({ item, index }) => {
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

        <View style={{ alignItems: 'center' }}>
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

  const renderJournalItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: "white", borderRadius: 15, borderWidth: 0, borderColor: Colors.lightPrimary, padding: 14.5, marginTop: 15 }}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>

          <Image source={item.icon} style={{ height: 47, width: 47 }} />

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontFamily: font.bold, fontSize: 15 }}>{item.emotion} </Text>
            <Text style={{ marginTop: 6, fontFamily: font.regular, fontSize: 12, color: Colors.gray12 }}>{item.date}</Text>
          </View>

          <View style={{ height: 28, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightPrimary, borderRadius: 13 }}>
            <Text style={{ color: Colors.primary, fontWeight: "500", fontSize: 13 }}>{item.sphere}  </Text>
          </View>

        </View>


        <View>
          <Text style={{ fontFamily: font.regular, fontSize: 18.5, marginTop: 9 }}>{item.title}</Text>
          <Text style={{ marginTop: 9, fontFamily: font.regular, lineHeight: 20.5, color: Colors.gray14 }}>{item.description}</Text>
        </View>

      </View>
    );
  };




  const FlatListHeader = () => {
    return (
      <>
        <View
          style={{ paddingHorizontal: 20, backgroundColor: Colors.background }}>

          <View style={{ marginHorizontal: -20, marginTop: 5 }}>
            <FlatList
              listKey="days"
              initialNumToRender={7}
              ref={daysFlatList}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
              data={daysList}
              horizontal={true}
              renderItem={renderDays}
              onScrollToIndexFailed={() => {
                console.log('scroll error');
              }}
            />
          </View>

          <View style={{ backgroundColor: Colors.lightPrimary, height: 1, width: "100%", marginTop: 10 }} />


          <Text style={[other_style.labelText, { marginTop: 20 }]}>
            {moment().format('DD MMM YYYY')}
          </Text>


        </View>
        {isHabitPurchased == false && adError == false && (
          <View
            style={{
              width: '100%',
              height: 100,
              alignItems: 'center',
              paddingVertical: 15,
              // backgroundColor:'pink',
              justifyContent: 'center',
              marginTop: -15,
            }}>
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId={Admob_Ids.banner}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdFailedToLoad={err => {
                console.log(err, 'Banner Ad Error...');
                setAdError(true);
              }}
            />
          </View>
        )}
      </>
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
        title={'Mood Tracker'}
        titleAlignLeft
      />

      <View style={mainStyles.innerView}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, }}>
            <Loader enable={isLoading} />
            <View style={{ flex: 1 }}>
              <FlatListHeader />

              <View>


              

              </View>


              <View style={{ marginTop: 5, flex: 1 }}>
                <FlatList
                  listKey="days"
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  showsVerticalScrollIndicator={false}
                  data={moodsJournal}
                  renderItem={renderJournalItem}
                  onScrollToIndexFailed={() => {
                    console.log('scroll error');
                  }}
                />
              </View>

            </View>
          </View>


        </ScrollView>
        <Pressable style={FAB_style.View} onPress={btn_add}>
          <Image
            source={require('../../../Assets/Icons/plus.png')}
            style={FAB_style.image}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MoodsJournal;


