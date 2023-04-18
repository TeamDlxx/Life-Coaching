import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style } from '../../../Utilities/styles';
import moment from 'moment';
import { font } from '../../../Utilities/font';

import { screens } from '../../../Navigation/Screens';
import LoginAlert from '../../../Components/LoginAlert';
import analytics from '@react-native-firebase/analytics';

// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';

import { VictoryChart, VictoryTheme, VictoryLine, VictoryScatter, VictoryAxis } from "victory-native";


/// Emojis
import Happy from "../../../Assets/emojy/smile.gif"
import Neutral from "../../../Assets/emojy/neutral.gif"
import Sad from "../../../Assets/emojy/sad.gif"
import Cry from "../../../Assets/emojy/cry.gif"
import Angry from "../../../Assets/emojy/angrygif.gif"

let allMoods = [];
let selectedMoods = [];

const MoodsJournal = props => {
  const win = Dimensions.get("window");
  VictoryTheme.material.axis.style.grid.strokeWidth = 0;
  let start;
  let end;
  const { Token, } = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);


  const [currentWeek, setCurrentWeek] = useState({
    startDate: moment().startOf("week"),
    endDate: moment().endOf("week"),
  })
  const updateCurrentWeek = updation => setCurrentWeek({ ...currentWeek, ...updation });

  const [chartData, setChartData] = useState({
    happy: [],
    neutral: [],
    sad: [],
    cry: [],
    angry: []
  });

  const [moods, setMoods] = useState([
    { 'source': Happy, 'isSelected': true, "mood": "Happy" },
    { 'source': Neutral, 'isSelected': false, "mood": "Neutral" },
    { 'source': Sad, 'isSelected': false, "mood": "Sad" },
    { 'source': Cry, 'isSelected': false, "mood": "Cry" },
    { 'source': Angry, 'isSelected': false, "mood": "Angry" },
  ])

  const [exist, setIsExist] = useState(false)


  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  })

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setSelectedMoods()
      if (Token) {
        start = moment(new Date(currentWeek.startDate)).toDate();
        end = moment(new Date(currentWeek.endDate)).toDate();

        setisLoading(true);
        apiChartData({
          start_date: moment(start).toISOString(),
          end_date: moment(end).toISOString(),
        });

      } else {
        setIsExist(false)
        allMoods = []
        selectedMoods = []
        setChartData({
          ...chartData,
          happy: [],
          neutral: [],
          sad: [],
          cry: [],
          angry: []
        })
      }
    });
    return unsubscribe;
  }, [Token, props.navigation, allMoods]);


  const setSelectedMoods = async () => {
    for (let i = 0; i < selectedMoods.length; i++) {
      let idx = moods.findIndex(x => x.mood == selectedMoods[i])
      if (idx != 0) {
        moods[idx].isSelected = true;
      }
    }
    setMoods([...moods])
  }

  const apiChartData = async body => {
    let res = await invokeApi({
      path: 'api/mood/mood_graph',
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      setisLoading(false);
      setisRefreshing(false)

      if (res.code == 200) {

        chartData.happy = [];
        chartData.neutral = [];
        chartData.sad = [];
        chartData.cry = [];
        chartData.angry = [];
        setChartData({ ...chartData })

        allMoods = [];
        allMoods = res.moods;

        let isExist = res?.is_exist;
        setIsExist(isExist)


        if (selectedMoods.length == 0) {
          let index = moods.findIndex(x => x.isSelected == true);
          if (index != -1) {
            addToSelectedMoods(moods[index].mood)
          } else {
            showToast('Please select a mood', 'Alert');
          }
        }
        else {
          graphData(selectedMoods)
        }
      } else {
        showToast(res.message);
      }
    }
  };


  const addToSelectedMoods = async mood => {
    let temp = [...selectedMoods]
    temp.push(mood)
    selectedMoods = temp;
    graphData(temp)
    console.log(selectedMoods, "current moods....")
  }


  const renderEmojis = (moodItem) => {
    return (
      <Pressable
        onPress={() => emojiPressed(moodItem.index)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: "center",
          marginRight: 5,
          height: 40,
          width: 45,
          borderRadius: 8,
          backgroundColor: moodItem.item.isSelected ? Colors.lightPrimary1 : Colors.background,

        }}>
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: moodItem.item.mood == "Happy" ? "#c2b074" :
              moodItem.item.mood == "Sad" ? "#d4811b" :
                moodItem.item.mood == "Cry" ? "#cfa6a1" :
                  moodItem.item.mood == "Angry" ? "#7c926d" : "#8ebeb2",
            backgroundColor: moodItem.item.mood == "Happy" ? "#E8D595" :
              moodItem.item.mood == "Sad" ? "#ec9326" :
                moodItem.item.mood == "Cry" ? "#E9BBB5" :
                  moodItem.item.mood == "Angry" ? "#8DA47E" : "#AAD9CD",
            marginRight: 3,
          }}
        />
        <Image source={moodItem.item.source} style={{ height: 20, width: 20, }} />
      </Pressable>
    )
  }


  const emojiPressed = async (idx) => {
    moods[idx].isSelected = !moods[idx].isSelected;
    await setMoods([...moods])
    if (moods[idx].isSelected == true) {
      addToSelectedMoods(moods[idx].mood)
    }
    else (
      removeItemData(moods[idx].mood)
    )
  }


  const graphData = async (moodsList) => {
    for (let i = 0; i < moodsList.length; i++) {

      let array = [];

      allMoods.slice().filter(async x => {
        if (x.mood == moodsList[i]) {
          let obj = {
            day: moment(x.date).format("ddd"),
            intensity: x.intensity,
          };
          array.push(obj);

          if (x.mood == "Happy") {
            chartData.happy = array;
          }
          else if (x.mood == "Neutral") {
            chartData.neutral = array;
          }
          else if (x.mood == "Sad") {
            chartData.sad = array;

          }
          else if (x.mood == "Cry") {
            chartData.cry = array;
          }
          else {
            chartData.angry = array;
          }

          let newState = chartData;
          setChartData({ ...newState });

          return true;
        }
        return false;
      });
    }
    console.log(chartData, "chart data...")
  }


  const removeItemData = async (mood) => {

    let moodList = [...selectedMoods]
    let moodIdx = await moodList.findIndex((data) => data === mood)
    moodList.splice(moodIdx, 1)
    selectedMoods = moodList;
    console.log(selectedMoods, "remainig moods....")


    let emptyArr = []
    if (mood == "Happy") {
      chartData.happy = emptyArr;
    }
    else if (mood == "Neutral") {
      chartData.neutral = emptyArr;
    }
    else if (mood == "Sad") {
      chartData.sad = emptyArr;

    }
    else if (mood == "Cry") {
      chartData.cry = emptyArr;
    }
    else {
      chartData.angry = emptyArr;
    }

    let newState = chartData;
    setChartData({ ...newState });

    console.log(chartData, "remaining chart data...")

  }


  const btn_add = () => {
    if (Token) {
      props.navigation.navigate(screens.moodTracker, {
        isComingFrom: "note"
      });
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  }


  const moodJournal = () => {
    props.navigation.navigate(screens.moodsJournal)
  }


  const onPressPreviousBtn = async () => {
    if (exist == true) {
      start = moment(new Date(currentWeek.startDate)).toDate();
      end = moment(new Date(currentWeek.endDate)).toDate();
      await updateCurrentWeek({
        startDate: moment(start).subtract({ day: 7 }),
        endDate: moment(end).subtract({ day: 7 }),
      })

      console.log(currentWeek, "previous Week .....")

      setisRefreshing(true)
      await apiChartData({
        start_date: moment(start).subtract({ day: 7 }).toISOString(),
        end_date: moment(end).subtract({ day: 7 }).toISOString(),
      })
    }
  };


  const onPressNextBtn = async () => {

    if (moment(currentWeek.endDate).format("DD") != moment().endOf("week").format("DD")) {
      start = moment(new Date(currentWeek.startDate)).toDate();
      end = moment(new Date(currentWeek.endDate)).toDate();

      await updateCurrentWeek({
        startDate: moment(start).add({ day: 7 }),
        endDate: moment(end).add({ day: 7 }),
      })
      console.log(currentWeek, "next Week .....")

      setisRefreshing(true)
      await apiChartData({
        start_date: moment(start).add({ day: 7 }).toISOString(),
        end_date: moment(end).add({ day: 7 }).toISOString(),
      })
    }
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
      />

      <View style={mainStyles.innerView}>

        {isLoading == false ? allMoods.length == 0 && exist == false ?

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../../../Assets/illustractions/MoodTracker.png')}
              style={{
                width: win.width * 0.85,
                height: win.width * 0.65,
              }}
            />
            <Text
              style={{
                fontFamily: font.xbold,
                fontSize: 28,
                marginTop: 25,
              }}>
              No Mood Insights
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
              Start keeping a record of your moods at regular intervals with some additional notes !
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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginTop: 35,
                  backgroundColor: 'white',
                  paddingBottom: 0,
                  borderRadius: 20,
                }}>

                <View style={{ marginTop: 15, marginBottom: 0, marginLeft: 70 }}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={moods}
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
                    renderItem={renderEmojis}
                  />
                </View>

                <View style={{ top: -10 }}>
                  <VictoryChart
                    height={300}
                    width={Dimensions.get("window").width * 0.95}
                    maxDomain={{ y: 10 }}
                    minDomain={{ y: 0 }}
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 0, y: 0 }}
                    animate={{ duration: 0, onLoad: { duration: 0 }, onExit: { duration: 0 }, onEnter: { duration: 0 } }}
                    categories={{
                      x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      y: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                    }}
                  >
                    <VictoryAxis
                      domain={[1, 7]}
                      style={{
                        axis: { stroke: Colors.disable, strokeWidth: 0.5 },
                        ticks: { stroke: "none" },
                        tickLabels: { fill: Colors.black }
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        axis: { stroke: Colors.disable, strokeWidth: 0.5 },
                        ticks: { stroke: "none" },
                        tickLabels: { fill: Colors.black }
                      }}
                    />

                    <VictoryLine
                      interpolation="natural"
                      style={{ data: { stroke: "#E8D595", strokeWidth: 2, strokeLinecap: "round", } }}
                      data={chartData.happy} x="day" y="intensity" />
                    <VictoryScatter style={{ data: { fill: "#E8D595" } }} size={5} data={chartData.happy} x="day" y="intensity" />

                    <VictoryLine
                      interpolation="natural"
                      style={{ data: { stroke: "#AAD9CD", strokeWidth: 2, strokeLinecap: "round", } }}
                      data={chartData.neutral} x="day" y="intensity" />
                    <VictoryScatter style={{ data: { fill: "#AAD9CD" } }} size={5} data={chartData.neutral} x="day" y="intensity" />

                    <VictoryLine
                      interpolation="natural"
                      style={{ data: { stroke: "#ec9326", strokeWidth: 2, strokeLinecap: "round", } }}
                      data={chartData.sad} x="day" y="intensity" />
                    <VictoryScatter style={{ data: { fill: "#ec9326" } }} size={5} data={chartData.sad} x="day" y="intensity" />

                    <VictoryLine
                      interpolation="natural"
                      style={{ data: { stroke: "#E9BBB5", strokeWidth: 2, strokeLinecap: "round", } }}
                      data={chartData.cry} x="day" y="intensity" />
                    <VictoryScatter style={{ data: { fill: "#E9BBB5" } }} size={5} data={chartData.cry} x="day" y="intensity" />

                    <VictoryLine
                      interpolation="natural"
                      style={{ data: { stroke: "#8DA47E", strokeWidth: 2, strokeLinecap: "round", } }}
                      data={chartData.angry} x="day" y="intensity" />
                    <VictoryScatter style={{ data: { fill: "#8DA47E" } }} size={5} data={chartData.angry} x="day" y="intensity" />


                  </VictoryChart>
                </View>

              </View>

              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <Pressable
                  onPress={onPressPreviousBtn}
                  style={{
                    height: 50,
                    flex: 1.5,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: Colors.lightPrimary,
                    margin: 2, borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <Image style={{
                    height: 11, width: 11,
                    tintColor: exist == true ? Colors.black : Colors.disable
                  }} source={require('../../../Assets/Icons/left_arrow.png')} />
                </Pressable>

                <View style={{
                  height: 50,
                  flex: 7,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: Colors.lightPrimary,
                  margin: 2,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Text style={{ fontFamily: font.medium }}>
                    {moment(currentWeek.startDate).format("MMM DD") + " - " + moment(currentWeek.endDate).format("MMM DD")}</Text>
                </View>

                <Pressable
                  onPress={onPressNextBtn}
                  style={{
                    height: 50,
                    flex: 1.5,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: Colors.lightPrimary,
                    margin: 2, borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <Image style={{
                    height: 11, width: 11,
                    tintColor: moment(currentWeek.endDate).format("DD") != moment().endOf("week").format("DD") ? Colors.black : Colors.disable
                  }} source={require('../../../Assets/Icons/right_arrow.png')} />
                </Pressable>

              </View>


              <Pressable
                onPress={moodJournal}
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 10,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20
                }}>
                <Text style={{
                  color: "white",
                  fontFamily: font.medium,
                  fontSize: 14
                }}>{"Your Mood Journal >"}</Text>
              </Pressable>

            </View>
            <Pressable style={FAB_style.View} onPress={btn_add}>
              <Image
                source={require('../../../Assets/Icons/plus.png')}
                style={FAB_style.image}
              />
            </Pressable>
          </>
          : <Loader enable={isLoading} />
        }

      </View>
      <Loader style={{ bottom: win.height / 3, }} enable={isRefreshing} />
    </SafeAreaView>
  );
};

export default MoodsJournal;


