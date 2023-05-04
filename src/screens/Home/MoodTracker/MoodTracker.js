import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState, } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useContext } from 'react';
import Context from '../../../Context';
import invokeApi from '../../../functions/invokeAPI';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { InteractionManager } from 'react-native';


import Happy from "../../../Assets/emojy/smile.gif"
import Neutral from "../../../Assets/emojy/neutral.gif"
import Sad from "../../../Assets/emojy/sad.gif"
import Cry from "../../../Assets/emojy/cry.gif"
import Angry from "../../../Assets/emojy/angrygif.gif"


import BeachChair from "../../../Assets/Icons/beach-chair.png"
import Family from "../../../Assets/Icons/family.png"
import FriendShip from "../../../Assets/Icons/friendship.png"
import Heart from "../../../Assets/Icons/heart.png"
import Lock from "../../../Assets/Icons/lock.png"
import Money from "../../../Assets/Icons/money.png"
import Portfolio from "../../../Assets/Icons/portfolio.png"
import Stethoscope from "../../../Assets/Icons/stethoscope.png"


let allMoodsList = [];

const MoodTracker = props => {
  const { Token } = useContext(Context);

  const [emojis, setEmojis] = useState([
    { 'source': Happy, 'isSelected': false, "mood": "Happy" },
    { 'source': Neutral, 'isSelected': false, "mood": "Neutral" },
    { 'source': Sad, 'isSelected': false, "mood": "Sad" },
    { 'source': Cry, 'isSelected': false, "mood": "Cry" },
    { 'source': Angry, 'isSelected': false, "mood": "Angry" },
  ])

  const [intensityList, setIntensity] = useState([
    { 'intensity': 1, 'isSelected': false },
    { 'intensity': 2, 'isSelected': false },
    { 'intensity': 3, 'isSelected': false },
    { 'intensity': 4, 'isSelected': false },
    { 'intensity': 5, 'isSelected': false },
    { 'intensity': 6, 'isSelected': false },
    { 'intensity': 7, 'isSelected': false },
    { 'intensity': 8, 'isSelected': false },
    { 'intensity': 9, 'isSelected': false },
    { 'intensity': 10, 'isSelected': false },
  ])


  const [emotions, setEmotions] = useState([
    { "id": 1, "emotion": "Excited ", "isSelected": false },
    { "id": 2, "emotion": "Relaxed  ", "isSelected": false },
    { "id": 3, "emotion": "Proud ", "isSelected": false },
    { "id": 4, "emotion": "Hopeful ", "isSelected": false },
    { "id": 5, "emotion": "Happy  ", "isSelected": false },
    { "id": 6, "emotion": "Enthusiactic ", "isSelected": false },
    { "id": 7, "emotion": "Refreshed  ", "isSelected": false },
    { "id": 8, "emotion": "Gloomy  ", "isSelected": false },
    { "id": 9, "emotion": "Lonely ", "isSelected": false },
    { "id": 10, "emotion": "Anxious  ", "isSelected": false },
    { "id": 11, "emotion": "Sad ", "isSelected": false },
    { "id": 12, "emotion": "Angry  ", "isSelected": false },
    { "id": 13, "emotion": "Tired ", "isSelected": false },
    { "id": 14, "emotion": "Burdensome  ", "isSelected": false },
    { "id": 15, "emotion": "Bored ", "isSelected": false },
    { "id": 16, "emotion": "Stressed ", "isSelected": false },
  ])


  const [sphereOfLife, setSphereOfLife] = useState([
    { 'id': 1, 'source': Portfolio, 'isSelected': false, "sphere": "Work  ", },
    { 'id': 2, 'source': FriendShip, 'isSelected': false, "sphere": "Friends " },
    { 'id': 3, 'source': Heart, 'isSelected': false, "sphere": "Love " },
    { 'id': 4, 'source': Family, 'isSelected': false, "sphere": "Family " },
    { 'id': 5, 'source': Lock, 'isSelected': false, "sphere": "Personal " },
    { 'id': 6, 'source': Stethoscope, 'isSelected': false, "sphere": "Health " },
    { 'id': 7, 'source': Money, 'isSelected': false, "sphere": "Finance " },
    { 'id': 8, 'source': BeachChair, 'isSelected': false, "sphere": "Leisure " },
  ])

  const { params } = props.route;
  const [isLoading, setisLoading] = useState(false);
  const oldMood = params?.item;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [moodData, setMoodData] = useState({
    mood: oldMood ? oldMood.mood : "",
    intensity: oldMood ? oldMood.intensity : "",
    emotion: oldMood ? oldMood.emotion : [],
    sphere: oldMood ? oldMood.sphere_of_life : [],
    date: oldMood ? moment(oldMood.date).toDate() : moment().toDate(),
  }
  );

  const updateMoodData = updation => setMoodData({ ...moodData, ...updation });


  // BackButton Handler 
  const onBackPress = () => {
    if (oldMood && (moodData.mood != oldMood?.mood ||
      moodData.intensity != oldMood?.intensity ||
      moodData.emotion.length != oldMood?.emotion.length ||
      moodData.emotion != oldMood?.emotion ||
      moodData.sphere != oldMood?.sphere_of_life ||
      moodData.sphere.length != oldMood?.sphere_of_life.length ||
      moment(moodData.date).toISOString() != oldMood?.date
    )) {

      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to discard changes?',
        [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
        {cancelable: true},
      );
    }
    else if (oldMood == undefined && (moodData.mood != '' ||
      moodData.intensity != '' ||
      moodData.emotion.length != 0 || moodData.sphere.length != 0)) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to discard changes?',
        [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
        {cancelable: true},
      );
    }
    else {
      props.navigation.goBack();
    }
    return true;
  };

  // phone's back button listener

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [moodData]),
  );

  React.useEffect(() => {
    initFunction()
    return () => { };
  }, [Token, oldMood]);


  const initFunction = async () => {
    InteractionManager.runAfterInteractions(() => {
      if (Token) {
        apiAllMoods({
          start_date: '',
          end_date: '',
          moods: ''
        });
      }
      if (oldMood) {
        setisLoading(true)
        setTimeout(() => {
          setPreviousData()
        }, 50)
      }
    });
  }

  const apiAllMoods = async body => {
    let res = await invokeApi({
      path: 'api/mood/all_moods',
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
        allMoodsList = [];
        allMoodsList = res?.all_moods;
        console.log(allMoodsList, "All Moods List ......")
      } else {
        showToast(res.message);
      }
    }
  }


  const setPreviousData = async () => {

    for (let i = 0; i < oldMood?.emotion?.length; i++) {
      let emotionIdx = await emotions.findIndex((obj) => obj.emotion.trim() === oldMood?.emotion[i])
      if (emotionIdx != -1) {
        emotionPressed(emotions[emotionIdx], emotionIdx)
      }
    }

    for (let i = 0; i < oldMood?.sphere_of_life?.length; i++) {
      let sphereIdx = await sphereOfLife.findIndex((obj) => obj.sphere.trim() === oldMood?.sphere_of_life[i])
      if (sphereIdx != -1) {
        await spherePressed(sphereOfLife[sphereIdx], sphereIdx)
      }
    }

    let moodIdx = await emojis.findIndex((obj) => obj.mood === oldMood?.mood)
    if (moodIdx != -1) {
      emojiPressed(moodIdx)
    }

    let intensityIdx = await intensityList.findIndex((obj) => obj.intensity === oldMood?.intensity)
    if (intensityIdx != -1) {
      intensityPressed(intensityIdx)
    }

    setisLoading(false)
  }

  const checkMoodExist = async () => {

    let isError = false;
    for (let i = 0; i < allMoodsList.length; i++) {
      if (oldMood && (oldMood?.date != moment(moodData.date).toISOString() || oldMood?.mood != moodData.mood)) {
        if (moment(allMoodsList[i].date).format("DD-MM-YYYY") == moment(moodData.date).format("DD-MM-YYYY") && allMoodsList[i].mood == moodData.mood) {
          showToast('Your selected mood already exist on this date. Please select another date or mood.', 'Alert')
          isError = true;
        }
      }
      else if (oldMood == undefined && moment(allMoodsList[i].date).format("DD-MM-YYYY") == moment(moodData.date).format("DD-MM-YYYY") && allMoodsList[i].mood == moodData.mood) {
        showToast('Your selected mood already exist on this date. Please select another date or mood.', 'Alert')
        isError = true;
      }
    }

    if (isError == false) {
      props.navigation.navigate(screens.moodNote, {
        moodItem: moodData,
        oldData: oldMood,
        parameters: params,
      })
    }
  }


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };


  const handleDateConfirm = async date => {
    console.log(date)
    hideDatePicker();
    await updateMoodData({ date: date })
    await setTimePickerVisibility(true)
  };


  const handleTimeConfirm = async time => {
    console.log(time)
    hideTimePicker();
    await updateMoodData({ date: time })
  };


  const hideTimePicker = () => {
    setTimePickerVisibility(false)
  };


  const emojiPressed = async (index) => {
    for (let i = 0; i < emojis.length; i++) {
      emojis[i].isSelected = false
    }
    await setEmojis(emojis)
    emojis[index].isSelected = true;
    setEmojis([...emojis]);


    if (emojis[index].isSelected == true) {
      await updateMoodData({
        mood: emojis[index].mood.trim()
      })
    }

  }


  const intensityPressed = async (index) => {
    for (let i = 0; i < intensityList.length; i++) {
      intensityList[i].isSelected = false
    }
    await setIntensity(intensityList)
    intensityList[index].isSelected = true;
    setIntensity([...intensityList]);


    if (intensityList[index].isSelected == true) {
      await updateMoodData({
        intensity: intensityList[index].intensity
      })
    }

  }


  const emotionPressed = async (item, idx) => {

    emotions[idx].isSelected = !emotions[idx].isSelected;
    await setEmotions([...emotions]);

    let temp = [...moodData.emotion];
    let index = temp.findIndex(x => x == item?.emotion.trim());
    if (index != -1) {
      temp.splice(index, 1);
    } else {
      temp.push(item.emotion.trim());
    }

    await updateMoodData({
      emotion: [...temp]
    })
  }


  const spherePressed = async (item, idx) => {

    sphereOfLife[idx].isSelected = !sphereOfLife[idx].isSelected;
    await setSphereOfLife([...sphereOfLife]);

    let temp = [...moodData.sphere];

    let index = temp.findIndex(x => x == item?.sphere.trim());
    if (index != -1) {
      temp.splice(index, 1);
    } else {
      temp.push(item.sphere.trim());
    }

    await updateMoodData({
      sphere: [...temp]
    })
  }

  const renderEmoji = ({ item, index }) => {
    return (
      <Pressable onPress={() => { emojiPressed(index) }}
        style={{
          width: Dimensions.get("window").width / 5.8,
          backgroundColor: item.isSelected ? Colors.secondary : '#e6e6e6',
          height: 80,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
          borderColor: item.isSelected ? Colors.primary : '#d1d1d1',
          borderWidth: 0.5,
          marginRight: 5,
        }}>
        <Image source={item.source} style={{ height: 50, width: 50 }} />
      </Pressable>
    )
  }


  const renderMoodIntensity = ({ item, index }) => {
    return (
      <Pressable onPress={() => { intensityPressed(index) }}
        style={{
          width: 40,
          height: 45,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          marginRight: 7,
          backgroundColor: item.isSelected ? Colors.secondary : '#e6e6e6',
          borderColor: item.isSelected ? Colors.primary : '#d1d1d1',
          borderWidth: 0.5,
        }}>
        <Text
          style={{
            color: item.isSelected ? Colors.primary : "black",
            fontWeight: item.isSelected ? "600" : "normal",
            fontSize: 15,
          }}>
          {item.intensity + " "}</Text>
      </Pressable>
    )
  }


  const renderSphere = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => { spherePressed(item, index) }}
        style={{
          width: Dimensions.get("window").width / 4.6,
          backgroundColor: item.isSelected ? Colors.secondary : '#e6e6e6',
          borderColor: item.isSelected ? Colors.primary : '#d1d1d1',
          borderWidth: 0.5,
          height: 80,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 15,
          marginTop: 10,
          marginRight: 5,
        }}>
        <Image source={item.source} style={{ height: 35, width: 35, resizeMode: "contain" }} />
        <Text style={{
          marginTop: 5,
          color: item.isSelected ? Colors.primary : "black",
          fontWeight: item.isSelected ? "500" : "normal",
        }}
        >{item.sphere}</Text>
      </Pressable>
    )
  }


  const btn_next = async () => {
    let t_mood = moodData.mood;
    let t_intensity = moodData.intensity;
    let t_emotion = moodData.emotion;
    let t_sphere = moodData.sphere;
    let t_date = moment(moodData.date).toISOString();

    if (t_mood == '') {
      showToast('Please select your mood', 'Alert');
    } else if (t_intensity == '') {
      showToast('Please select your mood intensity', 'Alert');
    } else if (t_emotion.length == 0) {
      showToast('Please select your emotions', 'Alert');
    } else if (t_sphere.length == 0) {
      showToast('Please select your spheres of life', 'Alert');
    } else {
      await checkMoodExist();
    }
    console.log(moodData, "New mood data ...");
  }

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation}
        title={oldMood ? "Update your mood" : 'What is your mood?'}
        onBackPress={onBackPress} />
      <View style={mainStyles.innerView}>
        <Loader enable={isLoading} />
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
        >
          <View style={{ marginTop: 20 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={emojis}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={renderEmoji}
            />
          </View>


          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 25 }}>Mood Intensity</Text>

          <View style={{ marginTop: 20 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={intensityList}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={renderMoodIntensity}
            />
          </View>

          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 25 }}>Emotions</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20, justifyContent: "space-evenly" }}>
            {emotions.map((item, index) => {
              return (
                <Pressable
                  key={item.id}
                  onPress={() => { emotionPressed(item, index) }}
                  style={{
                    backgroundColor: item.isSelected ? Colors.secondary : '#e6e6e6',
                    borderColor: item.isSelected ? Colors.primary : '#d1d1d1',
                    borderWidth: 0.5,
                    height: 32,
                    borderRadius: 15,
                    paddingHorizontal: 11,
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 4
                  }}>
                  <Text style={{
                    color: item.isSelected ? Colors.primary : "black",
                    fontWeight: item.isSelected ? "500" : "normal"
                  }}>
                    {item.emotion}</Text>
                </Pressable>
              )
            })}
          </View>


          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 25 }}>Sphere of life</Text>


          <View style={{ marginTop: 15 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={sphereOfLife}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              numColumns={4}
              renderItem={renderSphere}
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <View style={{ marginBottom: 20, }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  color: Colors.black,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                {"Date"}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                if (oldMood == undefined) {
                  showDatePicker();
                }
              }}
              style={{
                height: 55,
                backgroundColor: '#fff',
                borderRadius: 15,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: Colors.gray02,
                flexDirection: "row",
                alignItems: "center",
              }}>
              <TextInput
                editable={false}
                style={{ flex: 1, paddingHorizontal: 20, fontFamily: font.regular, color: oldMood ? Colors.disable : Colors.black }}
                value={moment(moodData.date).format('ddd, MMMM DD YYYY , hh:mm a')}
              />
              <View
                style={{ justifyContent: "center", paddingRight: 13 }}>
                <Image style={{ height: 13, width: 13, tintColor: oldMood ? Colors.disable : Colors.black }} source={require("../../../Assets/Icons/down-arrow.png")} />
              </View>
            </Pressable>


          </View>


          <Pressable onPress={btn_next} style={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: "12%", marginBottom: 10
          }}>
            <Text style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16
            }}>
              Next </Text>
          </Pressable>



        </KeyboardAwareScrollView>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={moodData.date}
          onChange={date => updateMoodData({ date: date })}
          value={handleDateConfirm}
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          maximumDate={moment().toDate()}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          locale="en_GB"
          is24Hour={false}
          date={moodData.date}
          onChange={date => updateMoodData({ date: date })}
          value={handleTimeConfirm}
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoodTracker;


const data13 = [
  {
    key: 1,
    value: 100,
    svg: { fill: '#F5BF40' },
    arc: { outerRadius: '0%' },
    question: 'Happiness',
  },
  {
    key: 2,
    value: 100,
    svg: { fill: '#53DAFB' },
    arc: { outerRadius: '0%' },
    question: 'Trust',
  },
  {
    key: 3,
    value: 100,
    svg: { fill: '#6AD007' },
    arc: { outerRadius: '0%' },
    question: 'Excitement',
  },

  {
    key: 4,
    value: 100,
    svg: { fill: '#E97434' },
    arc: { outerRadius: '0%' },
    question: 'Surprised',
  },
  {
    key: 5,
    value: 100,
    svg: { fill: '#4775DC' },
    arc: { outerRadius: '0%' },
    question: 'Fear',
  },
  {
    key: 6,
    value: 100,
    svg: { fill: '#B83958' },
    arc: { outerRadius: '0%' },
    question: 'Sadness',
  },
  {
    key: 7,
    value: 100,
    svg: { fill: '#9C56CC' },
    arc: { outerRadius: '0%' },
    question: 'Disappointment',
  },
  {
    key: 8,
    value: 100,
    svg: { fill: '#E894EA' },
    arc: { outerRadius: '0%' },
    question: 'Anger',
  },
];

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
