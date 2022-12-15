import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {PieChart} from 'react-native-svg-charts';


const size = 300;
const _10percentOfsize = (10 / 100) * size;

const MoodTracker = props => {
  const [CurrentQuestion, setCurrentQuestion] = useState(1);
  const [data, setData] = useState(data13);

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

  const selectAnswer = value => {
    let index = data.findIndex(x => x.key == CurrentQuestion);
    let newArray = [...data];
    let newobj = newArray[index];
    newobj = {...newobj, arc: {outerRadius: `${value}0%`}, value: 100};
    newArray.splice(index, 1, newobj);
    console.log('newObj', newobj);
    setData(newArray);
    setCurrentQuestion(CurrentQuestion + 1);
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Wheel of Mood'} />
      <View style={mainStyles.innerView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {CurrentQuestion < 9 && (
            <View style={WheelofLifeStyle.questionView}>
              <Text style={WheelofLifeStyle.questionText}>
                {data13.find(x => x.key == CurrentQuestion).question}
              </Text>
              <Text style={WheelofLifeStyle.rateText}>
                How would you rate this area of your mood?
              </Text>
              <View style={WheelofLifeStyle.answerButtonView}>
                {options.map(x => (
                  <TouchableHighlight
                    key={x.toString()}
                    underlayColor={Colors.lightPrimary}
                    onPress={() => selectAnswer(x)}
                    style={WheelofLifeStyle.answerButton}>
                    <Text style={WheelofLifeStyle.answerButtonText}>{x}</Text>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          )}

          <View style={WheelofLifeStyle.chartView}>
            <PieChart
              style={{width: size, height: size}}
              outerRadius={'100%'}
              innerRadius={0}
              data={data}
              padAngle={0}
              animate={true}
            />

            {/* Backgrounf of Pie */}
            <View style={WheelofLifeStyle.chartBackground}>
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
                                <View style={WheelofLifeStyle.dot} />
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

          {/* <View style={WheelofLifeStyle.lableSection}>
            {data13.map(x => (
              <View key={x.key} style={WheelofLifeStyle.lableView}>
                <View
                  style={[
                    {backgroundColor: x.svg.fill},
                    WheelofLifeStyle.colorView,
                  ]}
                />
                <Text style={WheelofLifeStyle.labelText}>{x.question}</Text>
              </View>
            ))}
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MoodTracker;

const WheelofLifeStyle = StyleSheet.create({
  chartView: {alignItems: 'center', marginVertical: '20%'},
  questionView: {marginTop: 20, alignItems: 'center'},
  questionText: {fontFamily: font.bold, fontSize: 24},
  answerButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  rateText: {
    fontFamily: font.medium,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#404040',
  },
  bordertext: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.background,
    includeFontPadding: false,
    paddingHorizontal: 5,
    color: Colors.gray07,
    fontSize: 12,
  },
  answerButton: {
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
  },
  answerButtonText: {fontSize: 18, fontFamily: font.regular},
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5 / 2,
    backgroundColor: Colors.gray04,
  },
  chartBackground: {
    height: size,
    width: size,
    position: 'absolute',
    zIndex: -1,
    borderRadius: size / 2,
    borderColor: Colors.gray04,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lableSection: {
    paddingBottom: 50,
  },
  lableView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  colorView: {
    height: 20,
    width: 20,
  },
  labelText: {
    fontSize: 16,
    fontFamily: font.medium,
    width: 120,
    marginLeft: 10,
    includeFontPadding: false,
  },
});

const data13 = [
  {
    key: 1,
    value: 100,
    svg: {fill: '#F5BF40'},
    arc: {outerRadius: '0%'},
    question: 'Happiness',
  },
  {
    key: 2,
    value: 100,
    svg: {fill: '#53DAFB'},
    arc: {outerRadius: '0%'},
    question: 'Trust',
  },
  {
    key: 3,
    value: 100,
    svg: {fill: '#6AD007'},
    arc: {outerRadius: '0%'},
    question: 'Excitement',
  },

  {
    key: 4,
    value: 100,
    svg: {fill: '#E97434'},
    arc: {outerRadius: '0%'},
    question: 'Surprised',
  },
  {
    key: 5,
    value: 100,
    svg: {fill: '#4775DC'},
    arc: {outerRadius: '0%'},
    question: 'Fear',
  },
  {
    key: 6,
    value: 100,
    svg: {fill: '#B83958'},
    arc: {outerRadius: '0%'},
    question: 'Sadness',
  },
  {
    key: 7,
    value: 100,
    svg: {fill: '#9C56CC'},
    arc: {outerRadius: '0%'},
    question: 'Disappointment',
  },
  {
    key: 8,
    value: 100,
    svg: {fill: '#E894EA'},
    arc: {outerRadius: '0%'},
    question: 'Anger',
  },
];

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
