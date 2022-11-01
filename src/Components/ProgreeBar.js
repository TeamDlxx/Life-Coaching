import React, {useEffect, useState} from 'react';
import {useProgress} from 'react-native-track-player';
import {Text, View, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {font} from '../Utilities/font';
import Colors from '../Utilities/Colors';

const TrackSlider = props => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const progress = useProgress();

  useEffect(() => {
    let duration = progress.duration;
    let position = progress.position;
    setDuration(parseInt(duration));
    setPosition(parseInt(position));
  }, [progress]);

  const formatTime = timeInSec => {
    if (
      (duration != 0 || props?.time != 0) &&
      position !== 0 &&
      (parseInt(duration) == parseInt(position) ||
        parseInt(props?.time) == parseInt(position))
    ) {
      props.resetPlayer();
    }

    let mins = parseInt(timeInSec / 60);
    let secs = parseInt(Math.ceil((timeInSec % 60) * 100) / 100);
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (secs < 10) {
      secs = '0' + secs;
    }

    return mins + ':' + secs;
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={position}
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
        tapToSeek={true}
        animationType="timing"
        maximumValue={props?.time}
        onValueChange={val => {
          // setIsSeeking(true);
          // setSeek(val);
        }}
        onSlidingComplete={val => {
          props.moveTo(val);
          // setValue(val);
        }}
      />
      <View style={{width: '100%', flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={styles.position}>{formatTime(position)}</Text>
        </View>

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.duration}>{formatTime(props?.time)}</Text>
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
    // backgroundColor: 'pink',
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
