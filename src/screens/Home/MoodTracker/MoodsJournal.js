import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style, other_style } from '../../../Utilities/styles';
import moment from 'moment';
import { font } from '../../../Utilities/font';

import { screens } from '../../../Navigation/Screens';
import LoginAlert from '../../../Components/LoginAlert';
import analytics from '@react-native-firebase/analytics';

import { BannerAd, BannerAdSize, useRewardedAd } from 'react-native-google-mobile-ads';
import { Admob_Ids } from '../../../Utilities/AdmobIds';

// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import EmptyView from '../../../Components/EmptyView';
import MoodListItem from './components/ListItem';

const MoodsJournal = props => {
  const { Token, allMoodJournals, setAllMoodJournals, updateAllMoodJournals } = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const daysFlatList = React.useRef();
  const [daysList, setDays] = useState([]);
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));

  const [adError, setAdError] = useState(false);


  useEffect(() => {
    daysInWeek();
    if (Token) {
      setisLoading(true);
      api_myMoods();
    }
    return () => { };
  }, [Token]);

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
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
      }, 300);
    }
  }, [daysList]);

  const daysInWeek = () => {
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

  const btn_add = () => {
    if (Token) {
      props.navigation.navigate(screens.moodTracker,);
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  const api_myMoods = async () => {
    let dateObj = {
      start_date: moment().startOf("week").toISOString(),
      end_date: moment().endOf("week").toISOString(),
    };

    console.log(dateObj, "date object")
    let res = await invokeApi({
      path: 'api/mood/mood_listing',
      method: 'POST',
      postData: dateObj,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        await setAllMoodJournals(res?.moods);
        console.log(allMoodJournals, "Moods List......")
      } else {
        showToast(res.message);
      }
    }
  };

  const removeMoodFromGlobalList = async (id) => {
    let newArray = [...allMoodJournals];
    let index = newArray.findIndex(x => x._id == id);
    if (index != -1) {
      newArray.splice(index, 1);
      setAllMoodJournals(newArray);
    }
    if (allMoodJournals.length == 0) {
      setToday(moment().toISOString())
    }
  };

  function updateMoodInGlobalList(item) {
    let newArray = [...allMoodJournals];
    let index = newArray.findIndex(x => x._id == item._id);
    newArray.splice(index, 1, item);
    setAllMoodJournals(newArray);
  }

  //? Views

  const renderDays = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => setToday(moment(item.date).format('YYYY-MM-DD'))}
        style={{
          margin: 10,
          alignItems: 'center',
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
      <MoodListItem
        onPress={() => {
          props.navigation.navigate(screens.moodDetail, {
            id: item._id,
            updateMood: updateMoodInGlobalList,
            removeMoodFromList: removeMoodFromGlobalList,
          });
        }}
        item={item}
      />
    );
  };


  const FlatListHeader = () => {
    return (
      <>
        <View
          style={{ paddingHorizontal: 15, backgroundColor: Colors.background, marginBottom: 15 }}>
          <Text style={other_style.labelText}>
            {moment().format('MMMM DD, YYYY')}
          </Text>
          <View style={{ marginHorizontal: -32, marginTop: 5 }}>
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
                console.log('daysList index scroll error');
              }}
            />
          </View>

          {/* <View style={{ backgroundColor: Colors.lightPrimary, height: 1, width: "100%", marginTop: 10 }} /> */}

        </View>
        {/* {adError == false && (
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
        )} */}
      </>
    );
  };

  const filterSelectedDayJournals = list => {
    return list.slice().filter(x => {
      if (moment(x.date).format('YYYY-MM-DD') == moment(today).format('YYYY-MM-DD')) {
        return true;
      }
      return false;
    });
  };


  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header
        navigation={props.navigation}
        title={'Mood Journals'}
        rightIcon={require('../../../Assets/Icons/list.png')}
        rightIcononPress={() => props.navigation.navigate(screens.allMoodJournals,
        )}
      />

      <View style={mainStyles.innerView}>
      <Loader enable={isLoading} />
        <View style={{ flex: 1, marginHorizontal: -15}}>
            <FlatList
              contentContainerStyle={
                filterSelectedDayJournals(allMoodJournals).length == 0
                  ? { flex: 1 ,paddingVertical: 10, paddingBottom: 50}
                  : { paddingVertical: 10, paddingBottom: 50 }
              }
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              showsVerticalScrollIndicator={false}
              data={filterSelectedDayJournals(allMoodJournals)}
              renderItem={renderJournalItem}
              onScrollToIndexFailed={() => {
                console.log('scroll error');
              }}
              ListHeaderComponent={FlatListHeader()}
              ListEmptyComponent={() => {
                return (
                  isLoading == false && (<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <EmptyView
                      style={{ marginTop: 0 }}
                      title={`No mood journal for this date`}
                      noSubtitle
                    />
                  </View>
                  ))
              }}
            />
        </View>

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


