import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import Slider from '@react-native-community/slider';
import {useWindowDimensions} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import ImageZoomer from '../../../Components/ImageZoomer';
import Context from '../../../Context';
// fro API calling

import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';

let audioRecorderPlayer = new AudioRecorderPlayer();

const ic_pallete = require('../../../Assets/Icons/palette.png');
const ic_cross = require('../../../Assets/Icons/cross.png');
const ic_save = require('../../../Assets/Icons/tick.png');
const ic_image = require('../../../Assets/Icons/h_placeholder1.png');

const ic_mic = require('../../../Assets/Icons/microphone-black-shape.png');
const ic_gallery = require('../../../Assets/Icons/gallery.png');
const ic_camera = require('../../../Assets/Icons/camera.png');
const ic_play = require('../../../Assets/TrackPlayer/playTrack.png');
const ic_stop = require('../../../Assets/TrackPlayer/stop.png');
const ic_pause = require('../../../Assets/TrackPlayer/pauseTrack.png');
const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');
import ic_download from '../../../Assets/Icons/download.png';
// import ic_cross from '../../../Assets/Icons/cross.png';
import ic_trash from '../../../Assets/Icons/trash.png';
import {isIphoneX} from 'react-native-iphone-x-helper';
import CustomImage from '../../../Components/CustomImage';
import {fileURL} from '../../../Utilities/domains';
const NoteDetail = props => {
  const {navigation} = props;
  const {downloadAudioNote, Token} = useContext(Context);
  const [note, setNote] = useState(props.route?.params?.note);
  const EditMenu = useRef();
  const [Audio, setAudio] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('stopped');
  const [playerTime, setPlayerTime] = useState({
    duration: 0,
    curTimeInSeconds: 0,
    curTime: '00:00',
  });

  const {width} = useWindowDimensions();

  const dropDownMenu = () => {
    return (
      <Menu
        style={{
          backgroundColor: Colors.white,
        }}
        ref={EditMenu}
        onRequestClose={() => EditMenu?.current.hide()}
        anchor={
          <TouchableHighlight
            onPress={() => EditMenu?.current.show()}
            underlayColor={Colors.lightPrimary}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
            }}>
            <Image
              source={require('../../../Assets/Icons/threeDots.png')}
              style={{height: 15, width: 15, tintColor: Colors.black}}
            />
          </TouchableHighlight>
        }>
        <MenuItem
          onPress={() => {
            EditMenu?.current.hide();
            navigation.navigate(screens.noteEditor, {
              note,
              updateNote: props.route.params?.updateNote,
            });
          }}>
          <Text style={{fontFamily: font.bold}}>Edit</Text>
        </MenuItem>

        <MenuDivider />

        <MenuItem
          onPress={() => {
            EditMenu?.current.hide();
            Alert.alert(
              'Delete Note',
              'Are you sure you want to delete this Note',
              [
                {text: 'No'},
                {text: 'Yes', onPress: () => api_deleteNote(note._id)},
              ],
            );
          }}>
          <Text style={{fontFamily: font.bold}}>Delete</Text>
        </MenuItem>
      </Menu>
    );
  };

  //? ImageZommer

  const showImageModal = image => {
    setModalImage(image);
  };

  const hideImageModal = () => {
    setModalImage(null);
  };

  //? player
  const playerPlayPause = async () => {
    // if (playerStatus == 'playing') {
    //   setPlayerStatus('paused');
    // } else {
    //   setPlayerStatus('playing');
    // }
    // return;
    console.log('playerStatus', playerStatus);
    console.log('playerTime.curTime', playerTime.curTimeInSeconds);
    console.log('playerTime.duration', playerTime.duration);
    if (playerStatus == 'stopped') {
      onStartPlay();
    }
    //  else if (
    //   playerStatus == 'stopped' &&
    //   playerTime.curTimeInSeconds != 0 &&
    //   playerTime.duration != 0 &&
    //   Math.floor(playerTime.curTimeInSeconds) == Math.floor(playerTime.duration)
    // ) {
    //   onRestartPlay();
    // }
    else if (playerStatus == 'paused') {
      onResumePlay();
    } else {
      onPausePlay();
    }
  };

  const onRestartPlay = async () => {
    console.log('onRestartPlay');
    await audioRecorderPlayer.seekToPlayer(0);
    await audioRecorderPlayer.resumePlayer();
    setPlayerStatus('playing');
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    setPlayerStatus('playing');
    console.log('Audio', Audio);
    const msg = await audioRecorderPlayer.startPlayer(Audio);
    audioRecorderPlayer.addPlayBackListener(async e => {
      console.log(e, 'event...');
      let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
      let duration = audioRecorderPlayer.mmssss(Math.floor(e.duration));
      let recordingTime = time.slice(0, -3).toString();
      setPlayerTime({
        duration: e.duration,
        curTimeInSeconds: e.currentPosition,
        curTime: recordingTime,
      });

      if (e.currentPosition == e.duration) {
        console.log('TIme up');
        onStopPlay();
        setPlayerTime({
          duration: e.duration,
          curTimeInSeconds: 0,
          curTime: '00:00',
        });
      }
      return;
    });
  };

  const onPausePlay = async () => {
    setPlayerStatus('paused');
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    console.log('onResumePlay');
    setPlayerStatus('playing');
    await audioRecorderPlayer.resumePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    setPlayerStatus('stopped');
    // audioRecorderPlayer.seekToPlayer(0);
    setPlayerTime({
      duration: playerTime.duration,
      curTimeInSeconds: 0,
      curTime: '00:00',
    });
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onSeek = async time => {
    if (playerStatus == 'stopped') {
      setPlayerStatus('paused');
      const msg = await audioRecorderPlayer.startPlayer(fileURL + note?.audio);
      await audioRecorderPlayer.seekToPlayer(time);
      await audioRecorderPlayer.pausePlayer();
      audioRecorderPlayer.addPlayBackListener(async e => {
        let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
        let duration = audioRecorderPlayer.mmssss(Math.floor(e.duration));
        let recordingTime = time.slice(0, -3).toString();
        setPlayerTime({
          duration: e.duration,
          curTimeInSeconds: e.currentPosition,
          curTime: recordingTime,
        });

        if (e.currentPosition == e.duration) {
          console.log('TIme up');
          onStopPlay();
          setPlayerTime({
            duration: playerTime.duration,
            curTimeInSeconds: 0,
            curTime: '00:00',
          });
        }
        return;
      });
    } else {
      await audioRecorderPlayer.seekToPlayer(time);
    }
  };

  const getRemainingTime = () => {
    console.log(playerTime.duration);
    console.log(playerTime.curTimeInSeconds);
    let timeLeftInSeconds = playerTime.duration - playerTime.curTimeInSeconds;
    console.log('timeLeftInSeconds', timeLeftInSeconds);
    let timeLeftInFormat = audioRecorderPlayer.mmssss(
      Math.floor(timeLeftInSeconds),
    );
    // let duration = audioRecorderPlayer.mmssss(Math.floor(e.duration));
    // let recordingTime = time.slice(0, -3).toString();
    console.log(timeLeftInFormat);
    // let timeLeft = duration - curTime;
    return '- ' + timeLeftInFormat.slice(0, -3);
  };

  const download = async () => {
    try {
      setAudio('downloading');
      let AudioPath = await downloadAudioNote(note?.audio);
      setAudio('file://' + AudioPath);
    } catch (e) {
      setAudio('error');
    }
  };

  const api_deleteNote = async NoteID => {
    setisLoading(true);
    let res = await invokeApi({
      path: `api/note/delete_note/${NoteID}`,
      method: 'DELETE',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        setisLoading(false);
        navigation.navigate(screens.notesList, {
          deleteId: NoteID,
        });
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  useEffect(() => {
    if (!!props.route.params?.editedNote) {
      setNote(props.route.params?.editedNote);
      console.log('Props...', props.route.params);
      // props.route.params?.updateNote(props.route.params?.editedNote);
      if (!!props.route.params?.editedNote?.audio) {
        download();
      }
    }
  }, [props.route]);

  useEffect(() => {
    if (!!note?.audio) {
      download();
    }
  }, [note?.audio]);

  const flatListHeader = () => {
    return (
      <View style={{marginBottom: 30}}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray01,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.bold,
              paddingBottom: 3,
            }}>
            {note?.title}
          </Text>
        </View>
        {!!note?.description && (
          <View style={{marginTop: 10, paddingHorizontal: 20}}>
            <AutoHeightWebView
              overScrollMode="never"
              style={{
                width: Dimensions.get('window').width - 15,
                minHeight: 1,
                opacity: 0.99,
                // marginTop: 35,
                // backgroundColor: 'red',
              }}
              source={{html: note?.description}}
              onSizeUpdated={res => {
                console.log('res', res);
              }}
              // scalesPageToFit={true}
              viewportContent={'width=device-width, user-scalable=no'}
              customStyle={`
          * {
            font-family: 'Verdana', sans-serif;
            font-size: 14px;
          }
         
        `}
            />
          </View>
        )}
        {!!note.audio && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
                elevation: 1,
                padding: 15,
                marginHorizontal: 20,
                marginTop: 20,
              }}>
              <Pressable
                onPress={() => {
                  if (Audio == null || Audio == 'error') {
                    downloadAudioNote();
                  } else if (Audio == 'downloading') {
                  } else {
                    playerPlayPause();
                  }
                }}
                style={{
                  backgroundColor: Colors.lightPrimary2,
                  height: 40,
                  width: 40,
                  borderRadius: 50 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {Audio == null || Audio == 'error' ? (
                  <Image
                    source={ic_download}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: Colors.primary,
                    }}
                  />
                ) : Audio == 'downloading' ? (
                  <ActivityIndicator />
                ) : (
                  <Image
                    source={playerStatus == 'playing' ? ic_pause : ic_play}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: Colors.primary,
                    }}
                  />
                )}
              </Pressable>

              <View
                style={{
                  flex: 1,
                  // marginRight: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1, marginHorizontal: 15}}>
                  <Slider
                    style={{}}
                    value={playerTime.curTimeInSeconds}
                    thumbTintColor={'transparent'}
                    // thumbImage={undefined}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.gray01}
                    minimumValue={0}
                    // tapToSeek={true}

                    animationType="timing"
                    maximumValue={playerTime.duration}
                    onValueChange={val => {
                      // setIsSeeking(true);
                      // setSeek(val);
                    }}
                    onSlidingComplete={onSeek}
                  />
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      fontFamily: font.medium,
                      fontSize: 14,
                      color: Colors.gray08,
                    }}>
                    {getRemainingTime()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          backgroundColor: note?.color.light,
        },
      ]}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={note?.color.light}
      />
      <Header
        titleAlignLeft
        navigation={navigation}
        title={'Note'}
        menu={dropDownMenu}
      />
      {!!note && (
        <View
          style={{
            // marginTop: 20,
            flex: 1,
          }}>
          <FlatList
            ListHeaderComponent={flatListHeader()}
            numColumns={3}
            data={note?.images}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              console.log('note?.images', item);
              return (
                <Pressable
                  onPress={() => showImageModal(item?.large)}
                  style={{
                    flex: 1 / 3,
                    aspectRatio: 1,
                    backgroundColor: note?.color.light,
                    margin: 1,
                    // borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <CustomImage
                    source={{uri: fileURL + item?.medium}}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                    imageStyle={
                      {
                        // borderRadius: 20,
                      }
                    }
                    indicatorProps={{color: Colors.primary}}
                  />
                </Pressable>
              );
            }}
          />
        </View>
      )}
      <ImageZoomer
        closeModal={hideImageModal}
        visible={!!modalImage}
        url={modalImage}
        color={note?.color.light}
        // noUrl
      />
      <Loader enable={isLoading} />
    </SafeAreaView>
  );
};

export default NoteDetail;
