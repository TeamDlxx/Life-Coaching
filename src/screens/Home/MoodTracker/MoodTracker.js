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
  ScrollView,
  TouchableHighlight,
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
import {PieChart} from 'react-native-svg-charts';
import {create} from 'react-test-renderer';

const size = 300;
const _10percentOfsize = (10 / 100) * 300;

const MoodTracker = props => {
  const [CurrentQuestion, setCurrentQuestion] = useState(1);
  const [data, setData] = useState(data13);

  const selectAnswer = value => {
    let index = data.findIndex(x => x.key == CurrentQuestion);
    let newArray = [...data];
    let newobj = newArray[index];
    newobj = {...newobj, arc: {outerRadius: `${value}0%`}};

    newArray.splice(index, 1, newobj);
    console.log('newObj', newobj);
    setData(newArray);

    setCurrentQuestion(CurrentQuestion + 1);
  };

  const getStyle = size => {
    return {
      height: _10percentOfsize * size,
      width: _10percentOfsize * size,
      borderRadius: (_10percentOfsize * size) / 2,
      borderColor: Colors.gray04,
      borderWidth: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };
  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Wheel of Life'} />
      <View style={mainStyles.innerView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {CurrentQuestion < 9 && (
            <View style={{marginTop: 20, alignItems: 'center'}}>
              <Text style={{fontFamily: font.bold, fontSize: 24}}>
                {data13.find(x => x.key == CurrentQuestion).question}
              </Text>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  marginTop: 10,
                  textAlign: 'center',
                  color: '#404040',
                }}>
                How would you rate this area of your life?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: 20,
                }}>
                {options.map(x => (
                  <TouchableHighlight
                    underlayColor={Colors.lightPrimary}
                    onPress={() => selectAnswer(x)}
                    style={{
                      height: 40,
                      width: 40,
                      borderWidth: 1,
                      borderColor: Colors.gray02,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 5,
                      marginTop: 10,
                      alignSelf: 'center',
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                    }}>
                    <Text style={{fontSize: 18}}>{x}</Text>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          )}

          <View style={{alignItems: 'center', marginVertical: '20%'}}>
            <PieChart
              style={{width: size, height: size}}
              outerRadius={'100%'}
              innerRadius={0}
              data={data}
            />

            <View
              style={{
                height: size,
                width: size,
                position: 'absolute',
                zIndex: -1,
                borderRadius: size / 2,
                borderColor: Colors.gray04,
                borderWidth: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={WheelofLifeStyle.bordertext}>10</Text>
              <View style={getStyle(9)}>
                <Text style={WheelofLifeStyle.bordertext}>9</Text>
                <View style={getStyle(8)}>
                  <Text style={WheelofLifeStyle.bordertext}>8</Text>
                  <View style={getStyle(7)}>
                    <Text style={WheelofLifeStyle.bordertext}>7</Text>
                    <View style={getStyle(6)}>
                      <Text style={WheelofLifeStyle.bordertext}>6</Text>
                      <View style={getStyle(5)}>
                        <Text style={WheelofLifeStyle.bordertext}>5</Text>
                        <View style={getStyle(4)}>
                          <Text style={WheelofLifeStyle.bordertext}>4</Text>
                          <View style={getStyle(3)}>
                            <Text style={WheelofLifeStyle.bordertext}>3</Text>
                            <View style={getStyle(2)}>
                              <Text style={WheelofLifeStyle.bordertext}>2</Text>
                              <View style={getStyle(1)}>
                                <Text style={WheelofLifeStyle.bordertext}>
                                  1
                                </Text>
                                <View
                                  style={{
                                    height: 5,
                                    width: 5,
                                    borderRadius: 5 / 2,
                                    backgroundColor: Colors.gray04,
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{alignItems: 'center', paddingBottom: 50}}>
            {data13.map(x => (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'center',
                }}>
                <View
                  style={{backgroundColor: x.svg.fill, height: 20, width: 20}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    width: 100,
                    marginLeft: 10,
                    includeFontPadding: false,
                  }}>
                  {x.question}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MoodTracker;

const WheelofLifeStyle = StyleSheet.create({
  bordertext: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.background,
    includeFontPadding: false,
    paddingHorizontal: 5,
    color: Colors.gray07,
    fontSize: 12,
  },
});

const value = {
  key: 2,
  value: 100,
  svg: {fill: '#4775DC'},
  arc: {cornerRadius: 0, outerRadius: '30%'},
};

const data13 = [
  {
    key: 1,
    value: 100,
    svg: {fill: '#53DAFB'},
    arc: {outerRadius: '0%'},
    question: 'Health',
  },
  {
    key: 2,
    value: 100,
    svg: {fill: '#4775DC'},
    arc: {outerRadius: '0%'},
    question: 'Career',
  },
  {
    key: 3,
    value: 100,
    svg: {fill: '#B83958'},
    arc: {outerRadius: '0%'},
    question: 'Love',
  },
  {
    key: 4,
    value: 100,
    svg: {fill: '#9C56CC'},
    arc: {outerRadius: '0%'},
    question: 'Spirituality',
  },
  {
    key: 5,
    value: 100,
    svg: {fill: '#E894EA'},
    arc: {outerRadius: '0%'},
    question: 'Family',
  },
  {
    key: 6,
    value: 100,
    svg: {fill: '#6AD007'},
    arc: {outerRadius: '0%'},
    question: 'Money',
  },
  {
    key: 7,
    value: 100,
    svg: {fill: '#F5BF40'},
    arc: {outerRadius: '0%'},
    question: 'Fun',
  },
  {
    key: 8,
    value: 100,
    svg: {fill: '#E97434'},
    arc: {outerRadius: '0%'},
    question: 'Friends',
  },
];

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
