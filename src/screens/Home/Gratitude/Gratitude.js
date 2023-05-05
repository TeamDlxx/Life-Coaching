import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import { Dimensions } from 'react-native';
import { useContext } from 'react';
import Context from '../../../Context';
import LoginAlert from '../../../Components/LoginAlert';
import showToast from '../../../functions/showToast';
import { other_style } from '../../../Utilities/styles';
import moment from 'moment';
import ListItem from './components/listItem';
import EmptyView from '../../../Components/EmptyView';
import invokeApi from '../../../functions/invokeAPI';
import Loader from '../../../Components/Loader';

import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Admob_Ids } from '../../../Utilities/AdmobIds';



const Gratitude = props => {
  const win = Dimensions.get("window");
  const { Token, gratitudesList, setGratitudesList, gratitudeExist, setGratitudeExist, allGratitudesList, setAllGratitudesList } = useContext(Context);
  const [daysList, setDays] = useState([]);
  const daysFlatList = React.useRef();
  const [today, setToday] = useState(moment().format('YYYY-MM-DD'));
  const [isLoading, setisLoading] = useState(false);

  const [adError, setAdError] = useState(false);


  useEffect(() => {
    daysofWeek();
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (Token) {
        setisLoading(true);
        api_myGratitudes();
        apiAllGratitudes({
          start_date: '',
          end_date: '',
        });
      } else {
        setGratitudeExist(false)
        setGratitudesList([])
        setAllGratitudesList([])
      }
    });
    return unsubscribe;

  }, [props.navigation, allGratitudesList, Token]);


  async function apiAllGratitudes(body) {
    let res = await invokeApi({
      path: 'api/gratitude/get_all_gratitude',
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        setAllGratitudesList(res?.gratitude)
        console.log(allGratitudesList, "All Gratitudes List ......")
      } else {
        showToast(res.message);
      }
    }
  }


  const api_myGratitudes = async () => {
    let dateObj = {
      date_from: moment().startOf("week").format('YYYY-MM-DD'),
      date_to: moment().endOf("week").format('YYYY-MM-DD'),
    };

    console.log(dateObj, "date object")
    let res = await invokeApi({
      path: 'api/gratitude/get_gratitude_list',
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
        await setGratitudesList(res?.gratitude);
        console.log(gratitudesList, "Gratitude List......")
        await setGratitudeExist(res?.is_exist)
        console.log(gratitudeExist, "is Data Exist ... ?")
      } else {
        showToast(res.message);
      }
    }
  };


  function updateGratitude(item) {
    let newArray = [...gratitudesList];
    let index = newArray.findIndex(x => x._id == item._id);
    newArray.splice(index, 1, item);
    setGratitudesList(newArray);
  }


  const removeGratitude = async (id) => {
    let newArray = [...gratitudesList];
    let index = newArray.findIndex(x => x._id == id);
    if (index != -1) {
      newArray.splice(index, 1);
      setGratitudesList(newArray);
    }
    if (gratitudesList.length == 0) {
      setToday(moment().format('YYYY-MM-DD'))
    }
    // await setGratitudesList((currentData) => currentData.filter((item) => item.id !== id));
  };


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

  const daysofWeek = () => {
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
      props.navigation.navigate(screens.addGratitude, { allGratitudes: allGratitudesList });
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  const flatListHeader = () => {
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
                console.log('scroll error');
              }}
            />
          </View>
        </View>

      </>
    );
  };

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

  const renderGratitudeList = ({ item, index }) => {
    let extraImg = item.images.length - 3;
    item.extraImages = extraImg;
    return (
      <ListItem
        onPress={() => {
          props.navigation.navigate(screens.gratitudeDetail, {
            id: item._id,
            updateGratitude: updateGratitude,
            removeGratitudeFromList: removeGratitude,
          });
        }}
        item={item}
        extraImg={extraImg}
      />
    );
  }


  const filterSelectedDayGratitudes = list => {
    return list.slice().filter(x => {
      if (moment(x.date).format('DD MMM YYYY') == moment(today).format('DD MMM YYYY')) {
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
        title={'Gratitude'}
        rightIcon={require('../../../Assets/Icons/list.png')}
        rightIcononPress={() => props.navigation.navigate(screens.allGratitudes,
        )}
      />
      <View style={mainStyles.innerView}>

        {isLoading == false ? gratitudesList.length == 0 && gratitudeExist == false ?
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../../../Assets/illustractions/gratitude-journal.png')}
              style={{
                width: win.width * 0.65,
                height: win.width * 0.65,
              }}
            />
            <Text
              style={{
                fontFamily: font.xbold,
                fontSize: 30,
                marginTop: 15,
              }}>
              No Gratitudes
            </Text>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 16,
                marginTop: 10,
                color: Colors.placeHolder,
                width: '80%',
                textAlign: 'center',
              }}>
              Create a memorandum for something you're grateful for!
            </Text>

            <View style={{ flex: 0.5, justifyContent: 'center', marginTop: 10 }}>
              <Pressable
                onPress={btn_add}
                style={[
                  FAB_style.View,
                  {
                    position: 'relative',
                    right: 0,
                    height: 65,
                    width: 65,
                    borderRadius: 65 / 2,
                  },
                ]}>
                <Image
                  source={require('../../../Assets/Icons/plus.png')}
                  style={FAB_style.image}
                />
              </Pressable>


            </View>

          </View>
          :
          <>
            <View style={{ flex: 1, marginHorizontal: -15 }}>
              <FlatList
                contentContainerStyle={
                  filterSelectedDayGratitudes(gratitudesList).length == 0
                    ? { flex: 1, paddingVertical: 10, paddingBottom: 50 }
                    : { paddingVertical: 10, paddingBottom: 50 }
                }
                showsVerticalScrollIndicator={false}
                data={filterSelectedDayGratitudes(gratitudesList)}
                ListHeaderComponent={flatListHeader()}
                // ListHeaderComponent={(gratitudesList.length != 0 || gratitudeExist == true) && flatListHeader()}
                renderItem={renderGratitudeList}
                keyExtractor={item => {
                  return item._id;
                }}
                ListEmptyComponent={() => {
                  return (
                    isLoading == false && (<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <EmptyView
                        style={{ marginTop: 0 }}
                        title={`No Gratitudes for this date`}
                        noSubtitle
                      />
                    </View>
                    ))
                }
                }
              />
            </View>
            <Pressable style={FAB_style.View} onPress={btn_add}>
              <Image
                source={require('../../../Assets/Icons/plus.png')}
                style={FAB_style.image}
              />
            </Pressable>
          </> : <Loader enable={isLoading} />
        }

      </View>
      {adError == false && (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <BannerAd
            size={BannerAdSize.BANNER}
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
    </SafeAreaView>
  );
};

export default Gratitude;