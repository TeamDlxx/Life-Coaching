import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  AppState,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import styles, {
  mainStyles,
  FAB_style,
  other_style,
} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';

import favIcon from '../../../Assets/TrackPlayer/favIcon.png';
import nextTrack from '../../../Assets/TrackPlayer/nextTrack.png';
import previousTrack from '../../../Assets/TrackPlayer/previousTrack.png';
import pauseTrack from '../../../Assets/TrackPlayer/pauseTrack.png';
import playTrack from '../../../Assets/TrackPlayer/playTrack.png';
import randomTrack from '../../../Assets/TrackPlayer/randomTrack.png';

import TrackPlayer from 'react-native-track-player';

import ProgressBar from '../../../Components/ProgreeBar';

const TrackPlayerScreen = props => {
  const [trackItem, setTrackItem] = useState(props.route.params.item);
  const [playIcon, setPlayIcon] = useState(playTrack);
  //? Views

  const moveTo = async val => {
    await TrackPlayer.seekTo(val);
    await TrackPlayer.play();
    let state = await TrackPlayer.getState();

    // this.setState({ icon: PauseIcon });
  };

  useEffect(() => {
    TrackPlayer.reset();
    TrackPlayer.add({
      id: '1',
      url: 'https://raw.githubusercontent.com/uit2712/RNPlaySound/develop/sounds/Tropic%20-%20Anno%20Domini%20Beats.mp3',

      title: 'name',
      artist: 'playlist',
      album: 'abc',
      genre: 'Progressive House, Electro House',
      artwork: 'this',
    });

    return function cleanup() {
      TrackPlayer.reset();
    };
  }, []);

  const changeStatus = async () => {
    if (playIcon == playTrack) {
      let state = await TrackPlayer.getState();
      await TrackPlayer.play();

      setPlayIcon(pauseTrack);
    } else {
      TrackPlayer.pause();
      let state = await TrackPlayer.getState();
      setPlayIcon(playTrack);
    }
  };

  const resetTheTrack = async () => {
    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: '1',
      url: 'https://raw.githubusercontent.com/uit2712/RNPlaySound/develop/sounds/Tropic%20-%20Anno%20Domini%20Beats.mp3',
      // url: Imagesdomain + this.state.audioFileUrl,
      title: 'name',
      artist: 'playlist',
      album: 'abc',
      genre: 'Progressive House, Electro House',
      artwork: 'this',
    });
    setPlayIcon(playTrack);
  };

  const goBack = () => {
    TrackPlayer.reset();
    props.navigation.goBack();
  };

  // Main render View............
  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      {/* <View
        style={{
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        }}>
      <View style={{height: 50, width: 50}}>
        
          <Pressable
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => goBack()}>
            <Image
              source={require('../../../Assets/Icons/back.png')}
              style={{height: 25, width: 25}}
            />
          </Pressable>
        
      </View>

      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.black,
            fontSize: 20,
            fontFamily: font.bold,
            textAlign:'center',
            // fontWeight: '700',
          }}>
          Player
        </Text>
      </View>
      <View style={{height: 50, width: 50}}>
      
    </View>
         </View> */}
      <Header navigation={props.navigation} title={'Player'} />
      <View style={[mainStyles.innerView, {paddingHorizontal: 0}]}>
        <View style={{flex: 1, marginHorizontal: 0}}>
          <View
            style={{
              flex: 9,
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
              marginTop: -20,
            }}>
            <View
              style={{
                flex: 0.3,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}></View>
            <View
              style={{
                flex: 6.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: '72%', height: '89%', borderRadius: 50}}
                source={{uri: trackItem.image}}></Image>
            </View>
            <View style={{marginHorizontal: 50, minHeight: 80}}>
              <Text
                style={{
                  fontFamily: font.xbold,
                  fontSize: 21,
                  includeFontPadding: false,
                  color: Colors.black,
                  marginTop: 5,
                }}>
                {trackItem.note}
              </Text>
              <Text
                style={{
                  fontFamily: font.bold,
                  fontSize: 14,
                  includeFontPadding: false,
                  color: Colors.gray05,
                  marginTop: 5,
                }}>
                {trackItem.title}
              </Text>
            </View>
            <View style={{flex: 2.0, marginHorizontal: 35}}>
              <ProgressBar
                resetPlayer={resetTheTrack}
                moveTo={val => {
                  moveTo(val);
                }}
              />

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View
                  style={{
                    flex: 0.8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: Colors.lightPrimary,
                    }}
                    source={randomTrack}></Image>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{width: 22, height: 22, tintColor: Colors.primary}}
                    source={previousTrack}></Image>
                </View>
                <View
                  style={{
                    flex: 1.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={changeStatus}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: Colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: Colors.lightPrimary,
                      borderWidth: 7,
                    }}>
                    <Image
                      style={{width: 22, height: 22, tintColor: Colors.white}}
                      source={playIcon}></Image>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{width: 22, height: 22, tintColor: Colors.primary}}
                    source={nextTrack}></Image>
                </View>
                <View
                  style={{
                    flex: 0.8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: Colors.lightPrimary,
                    }}
                    source={favIcon}></Image>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrackPlayerScreen;
