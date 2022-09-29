import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  AppState,
  ImageBackground,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import TrackPlayer from 'react-native-track-player';
import ProgressBar from '../../../Components/ProgreeBar';

//Icons

import favIcon from '../../../Assets/TrackPlayer/favIcon.png';
import nextTrack from '../../../Assets/TrackPlayer/nextTrack.png';
import previousTrack from '../../../Assets/TrackPlayer/previousTrack.png';
import pauseTrack from '../../../Assets/TrackPlayer/pauseTrack.png';
import playTrack from '../../../Assets/TrackPlayer/playTrack.png';
import randomTrack from '../../../Assets/TrackPlayer/randomTrack.png';

const TrackPlayerScreen = props => {
  const [trackItem, setTrackItem] = useState(props.route.params.item);
  const [isFav, setIsFav] = useState(false);
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

  //? Main render View............
  return (
    <View style={_styleTrackPlayer.rootView}>
      <View style={_styleTrackPlayer.posterView}>
        <ImageBackground
          style={_styleTrackPlayer.posterImageView}
          source={{uri: trackItem.image}}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'transparent'}
            translucent={true}
          />
          <SafeAreaView style={{flex: 1}}>
            <View
              style={{
                marginTop:
                  Platform.OS == 'android' ? StatusBar.currentHeight : 0,
              }}>
              <Pressable
                onPress={goBack}
                style={_styleTrackPlayer.backButtonView}>
                <Image
                  style={_styleTrackPlayer.backButtonIcon}
                  source={require('../../../Assets/Icons/back.png')}
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
      <View style={_styleTrackPlayer.controlsAndTextView}>
        <View style={_styleTrackPlayer.TextView}>
          <Pressable
            onPress={() => setIsFav(!isFav)}
            style={_styleTrackPlayer.favButtonView}>
            <Image
              style={[
                _styleTrackPlayer.favButtonIcon,
                {
                  tintColor: isFav ? Colors.primary : Colors.lightPrimary,
                },
              ]}
              source={favIcon}
            />
          </Pressable>
          <Text style={_styleTrackPlayer.trackName}>{trackItem.note}</Text>
          <Text style={_styleTrackPlayer.trackCategory}>
            {props.route.params?.category?.name}
          </Text>
          <Text style={_styleTrackPlayer.trackDescription}>
            {trackItem.description}
          </Text>
        </View>
        <View style={_styleTrackPlayer.controlView}>
          <ProgressBar
            resetPlayer={resetTheTrack}
            moveTo={val => {
              moveTo(val);
            }}
          />

          <View style={_styleTrackPlayer.playerButtonsView}>
            <View style={_styleTrackPlayer.previosAndNextButtonView}>
              <Image
                style={_styleTrackPlayer.previosAndNextButtonIcon}
                source={previousTrack}
              />
            </View>

            <View style={_styleTrackPlayer.playPauseButtonView}>
              <TouchableOpacity
                onPress={changeStatus}
                style={_styleTrackPlayer.playPauseButtonInnerView}>
                <Image
                  style={_styleTrackPlayer.playPauseButtonIcon}
                  source={playIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={_styleTrackPlayer.previosAndNextButtonView}>
              <Image
                style={_styleTrackPlayer.previosAndNextButtonIcon}
                source={nextTrack}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackPlayerScreen;

const _styleTrackPlayer = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  posterView: {
    flex: 0.5,
    width: '100%',
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
  },
  posterImageView: {
    flex: 1,
    transform: [{scaleX: 0.5}],
  },

  backButtonView: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 40 / 2,
    marginLeft: 10,
  },
  backButtonIcon: {height: 20, width: 20},
  controlsAndTextView: {
    flex: 0.5,
    justifyContent: 'space-between',
    marginBottom: '15%',
    marginTop: '10%',
  },
  TextView: {marginHorizontal: 35, marginTop: -20},
  favButtonView: {
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  favButtonIcon: {
    width: 20,
    height: 20,
  },
  trackName: {
    fontFamily: font.xbold,
    fontSize: 21,
    includeFontPadding: false,
    color: Colors.black,
    marginTop: 5,
  },
  trackCategory: {
    fontFamily: font.bold,
    fontSize: 18,
    includeFontPadding: false,
    color: Colors.gray12,
    marginTop: 5,
  },
  trackDescription: {
    fontFamily: font.bold,
    fontSize: 14,
    includeFontPadding: false,
    color: Colors.gray05,
    marginTop: 5,
  },
  controlView: {marginHorizontal: 35, marginTop: 10},
  playerButtonsView: {flexDirection: 'row', marginTop: 10},
  previosAndNextButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previosAndNextButtonIcon: {width: 22, height: 22, tintColor: Colors.primary},

  playPauseButtonView: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButtonInnerView: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightPrimary,
    borderWidth: 7,
  },
  playPauseButtonIcon: {width: 22, height: 22, tintColor: Colors.white},
});
