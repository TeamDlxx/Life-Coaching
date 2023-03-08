import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import styles, { mainStyles } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import { PieChart } from 'react-native-svg-charts';

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


const MoodTracker = props => {

  const [emojis, setEmojis] = useState([
    { 'source': Happy, 'isSelected': false },
    { 'source': Neutral, 'isSelected': false },
    { 'source': Sad, 'isSelected': false },
    { 'source': Cry, 'isSelected': false },
    { 'source': Angry, 'isSelected': false },
  ])


  const [emotions, setEmotions] = useState([
    { "emotion": "Excited ", "isSelected": false },
    { "emotion": "Relaxed  ", "isSelected": false },
    { "emotion": "Proud ", "isSelected": false },
    { "emotion": "Hopeful ", "isSelected": false },
    { "emotion": "Happy  ", "isSelected": false },
    { "emotion": "Enthusiactic ", "isSelected": false },
    { "emotion": "Refreshed  ", "isSelected": false },
    { "emotion": "Gloomy  ", "isSelected": false },
    { "emotion": "Lonely ", "isSelected": false },
    { "emotion": "Anxious  ", "isSelected": false },
    { "emotion": "Sad ", "isSelected": false },
    { "emotion": "Angry  ", "isSelected": false },
    { "emotion": "Tired ", "isSelected": false },
    { "emotion": "Burdensome  ", "isSelected": false },
    { "emotion": "Bored ", "isSelected": false },
    { "emotion": "Stressed ", "isSelected": false },
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



  const emojiPressed = async (index) => {

    for (let i = 0; i < emojis.length; i++) {
      emojis[i].isSelected = false
    }
    await setEmojis(emojis)
    emojis[index].isSelected = true;
    setEmojis([...emojis]);


  }


  const spherePressed = async (index) => {

    for (let i = 0; i < sphereOfLife.length; i++) {
      sphereOfLife[i].isSelected = false
    }
    await setSphereOfLife(sphereOfLife)
    sphereOfLife[index].isSelected = true;
    setSphereOfLife([...sphereOfLife]);

  }


  const emotionPressed = async (index) => {

    for (let i = 0; i < emotions.length; i++) {
      emotions[i].isSelected = false
    }
    await setEmotions(emotions)
    emotions[index].isSelected = true;
    setEmotions([...emotions]);

  }




  const itemView = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => { emojiPressed(index) }} style={{ width: Dimensions.get("window").width / 5.3, backgroundColor: item.isSelected ? Colors.secondary : Colors.background, height: 80, alignItems: "center", justifyContent: "center", borderRadius: 15 }}>
        <Image source={item.source} style={{ height: 50, width: 50 }} />
      </TouchableOpacity>
    )
  }


  const sphere = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => { spherePressed(index) }} style={{ width: Dimensions.get("window").width / 4.2, backgroundColor: item.isSelected ? Colors.secondary : Colors.background, height: 80, alignItems: "center", justifyContent: "center", borderRadius: 15, marginTop: 10 }}>
        <Image source={item.source} style={{ height: 35, width: 35, resizeMode: "contain" }} />
        <Text style={{ marginTop: 5 }}>{item.sphere}</Text>
      </TouchableOpacity>
    )
  }


  const AddMoodNotes = () => {
    props.navigation.navigate(screens.moodNote)
  }




  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'What is your mood?'} />
      <View style={mainStyles.innerView}>

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ marginTop: 20 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={emojis}
              renderItem={itemView}
            />
          </View>


          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 20 }}>Mood Intensity</Text>

          <TextInput
            placeholder='1 - 10'
            keyboardType="number-pad"
            style={{ height: 53, width: "100%", backgroundColor: "white", borderRadius: 8, paddingHorizontal: 15, borderWidth: 0, borderColor: Colors.lightPrimary, marginTop: 20, }}
          />

          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 15 }}>Emotions</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 25, justifyContent: "space-evenly" }}>
            {emotions.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => { emotionPressed(index) }} style={{ backgroundColor: item.isSelected ? Colors.secondary : '#e6e6e6', height: 32, borderRadius: 15, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", margin: 4 }}>
                  <Text style={{ color: item.isSelected ? Colors.primary : "black", fontWeight: item.isSelected ? "500" : "normal" }}>{item.emotion}</Text>
                </TouchableOpacity>
              )
            })}
          </View>


          <Text style={{ fontFamily: font.bold, textAlign: "center", fontSize: 17, marginTop: 20 }}>Sphere of life</Text>


          <View style={{ marginTop: 10 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={sphereOfLife}
              key={'_'}
              keyExtractor={item => "_" + item.id}
              numColumns={4}
              renderItem={sphere}
            />
          </View>



          <TouchableOpacity onPress={AddMoodNotes} style={{ backgroundColor: Colors.primary, borderRadius: 10, height: 50, alignItems: "center", justifyContent: "center", marginTop: "12%" }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Next </Text>
          </TouchableOpacity>



        </ScrollView>
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
