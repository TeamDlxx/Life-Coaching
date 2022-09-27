import React, {Component, useEffect, useState} from 'react';
import {TrackPlayer, useProgress} from 'react-native-track-player';
import {Text, View, StyleSheet} from 'react-native';
// import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';
import {font} from '../Utilities/font';
import Colors from '../Utilities/Colors';
var i = 0;
const TrackSlider = props => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(false);
  const [value, setValue] = useState('');

  const progress = useProgress();

  useEffect(() => {
    let duration = progress.duration;
    let position = progress.position;

    setDuration(parseInt(duration));
    setPosition(parseInt(position));
  }, [progress]);

  const formatTime = timeInSec => {
    if (
      duration !== 0 &&
      position !== 0 &&
      parseInt(duration) === parseInt(position)
    ) {
      // if (i === 0) {
      //   if (props.i === false) {
      props.resetPlayer();
      // }
      //   i++;
      // } else {
      //   i = 0;
      // }
    }

    let mins = parseInt(timeInSec / 60);
    let secs = parseInt(Math.round((timeInSec % 60) * 100) / 100);
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (secs < 10) {
      secs = '0' + secs;
    }
    console.log(mins + ':' + secs, 'progress o track player');
    return mins + ':' + secs;
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={
          // isSeeking ? position : position
          position
        }
        thumbTintColor={Colors.primary}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.lightPrimary}
        minimumValue={0}
        thumbStyle={{
          width: 15,
          height: 15,

          shadowOpacity: 0.9,
          shadowColor: 'silver',
          elevation: 1,
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        animationType="timing"
        maximumValue={duration}
        onValueChange={val => {
          // TrackPlayer.pause();
          setIsSeeking(true);
          setSeek(val);
        }}
        onSlidingComplete={val => {
          console.log('sldng complete callng');
          props.moveTo(val);
          setValue(val);
        }}
      />
      <View style={{width: '100%', flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={styles.position}>{formatTime(position)}</Text>
        </View>

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.duration}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // width:"%",
  },
  position: {
    marginTop: -4,
    fontFamily: font.bold,
    fontSize: 12,
    includeFontPadding: false,
    color: Colors.gray05,
  },
  duration: {
    marginTop: -4,
    fontFamily: font.bold,
    fontSize: 12,
    includeFontPadding: false,
    color: Colors.gray05,

    //  color: 'silver',
    //  fontSize: 12,
  },
  timeContainer: {
    alignItems: 'center',
    color: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  slider: {
    marginTop: 0,
    // marginLeft: 5,
    // marginRight: 5,
    width: '100%',
  },
});
export default TrackSlider;
