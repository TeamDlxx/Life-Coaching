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
  Linking,
  Platform,
} from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import Slider from '@react-native-community/slider';
import { useWindowDimensions } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import ImageZoomer from '../../../Components/ImageZoomer';
import Context from '../../../Context';
import analytics from '@react-native-firebase/analytics';
// fro API calling
import RenderHtml from 'react-native-render-html';


import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';

let audioRecorderPlayer = new AudioRecorderPlayer();

const ic_play = require('../../../Assets/TrackPlayer/playTrack.png');
const ic_pause = require('../../../Assets/TrackPlayer/pauseTrack.png');
import ic_download from '../../../Assets/Icons/download.png';
import CustomImage from '../../../Components/CustomImage';
import { baseURL, fileURL } from '../../../Utilities/domains';
import moment from 'moment';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const jsCode = `!function(){var e=function(e,n,t){if(n=n.replace(/^on/g,""),"addEventListener"in window)e.addEventListener(n,t,!1);else if("attachEvent"in window)e.attachEvent("on"+n,t);else{var o=e["on"+n];e["on"+n]=o?function(e){o(e),t(e)}:t}return e},n=document.querySelectorAll("a[href]");if(n)for(var t in n)n.hasOwnProperty(t)&&e(n[t],"onclick",function(e){new RegExp("^https?://"+location.host,"gi").test(this.href)||(e.preventDefault(),window.postMessage(JSON.stringify({external_url_open:this.href})))})}();`;

let noteArr = []
const NoteDetail = props => {
  const { navigation } = props;
  const { downloadAudioNote, Token, notesList, setNotesList, dashboardData, setDashBoardData } = useContext(Context);
  const [note, setNote] = useState(props.route?.params?.note);
  const EditMenu = useRef();
  const ref_webView = useRef();
  const [Audio, setAudio] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('stopped');
  const [playerTime, setPlayerTime] = useState({
    duration: 0,
    curTimeInSeconds: 0,
    curTime: '00:00',
  });

  const { width } = useWindowDimensions();

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
              style={{ height: 15, width: 15, tintColor: Colors.black }}
            />
          </TouchableHighlight>
        }>
        <MenuItem
          onPress={() => {
            EditMenu?.current.hide();
            if (playerStatus == 'playing') {
              onStopPlay();
            }
            navigation.navigate(screens.noteEditor, {
              note,
              updateNote: props.route.params?.updateNote,
            });
          }}>
          <Text style={{ fontFamily: font.bold }}>Edit</Text>
        </MenuItem>

        <MenuDivider />

        <MenuItem
          onPress={() => {
            EditMenu?.current.hide();
            Alert.alert(
              'Delete Note',
              'Are you sure you want to delete this Note',
              [
                { text: 'No' },
                {
                  text: 'Yes',
                  onPress: () => {
                    if (playerStatus == 'playing') {
                      onStopPlay();
                    }
                    api_deleteNote(note._id);
                  },
                },
              ],
              { cancelable: true },
            );
          }}>
          <Text style={{ fontFamily: font.bold }}>Delete</Text>
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
      console.log(AudioPath, 'AudioPath');
      if (AudioPath == 'error') {
        setAudio('error');
      } else {
        setAudio('file://' + AudioPath);
      }
    } catch (e) {
      console.log(e, 'error');
      setAudio('error');
    }
  };

  console.log(props)

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
        if (props?.route?.params?.isComingFrom == "dashBoard") {
          console.log("yes , isComingFrom from dashboard.....")
          let arr = [...notesList];
          await deleteLocallyfromList(NoteID)
          props.navigation.goBack();
        } else {
          navigation.navigate(screens.notesList, {
            deleteId: NoteID,
          });
        }

      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  const deleteLocallyfromList = async noteID => {
    let arr = [...notesList];
    let index = arr.findIndex(x => x._id === noteID);
    if (index !== -1) {
      arr.splice(index, 1);
      await deleteDashBoardNotes(noteID, arr)
      setNotesList(arr);
    }

  };

  const deleteDashBoardNotes = async (id, arr) => {
    let tempArr = [...dashboardData.notes];
    console.log(tempArr, "jasdnajbdhj")
    if (tempArr.length != 0) {
      console.log('yess....hbhxbh')
      tempArr = [...dashboardData.notes]
    } else {
      tempArr = await AsyncStorage.getItem('@notes')
    }
    let idx = tempArr.findIndex(x => x._id == id)
    if (idx != -1) {
      tempArr = []

      if (arr[0] != undefined) {
        tempArr.push(arr[0])
      }
      if (arr[1] != undefined) {
        tempArr.push(arr[1])
      }
      console.log(tempArr, "new Arr......")
    }

    await setDashBoardData({
      ...dashboardData,
      notes: [...tempArr]
    })
  }


  const allNotesApi = async body => {
    let res = await invokeApi({
      path: `api/note/get_notes?page=0&limit=${10}`,
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        setNotesList(res.notes)
      } else {
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
    if (props?.route?.params?.isComingFrom == "dashBoard") {
      allNotesApi({
        search: '',
        date_from: '',
        date_to: '',
        color: JSON.stringify([]),
      })
    }
    if (!!note?.audio) {
      download();
    }
    return () => {
      onStopPlay();
    };
  }, [note?.audio]);

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  }, []);


  const renderersProps = {
    a: {
      onPress(event, url, htmlAttribs, target) {
        Linking.openURL(url);
      }
    }
  }


  const flatListHeader = () => {
    return (
      <View style={{ marginBottom: 30 }}>
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
          <View style={{ marginTop: 10, }}>
            <View style={{ padding: 20, }}>
              <RenderHtml
                contentWidth={width}
                style={{ fontSize: 14 }}
                source={{ html: note?.description + "  " }}
                renderersProps={renderersProps}

              />
            </View>




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
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                  <Slider
                    style={{ transform: [{ scaleY: 2 }] }}
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
      <View style={{ flex: 1 }}>
        <Header
          navigation={navigation}
          title={'Note'}
          menu={dropDownMenu}
        />
        {!!note && (
          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              ListHeaderComponent={flatListHeader()}
              numColumns={3}
              data={note?.images}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                console.log('note?.images', item);
                return (
                  <Pressable
                    onPress={() => showImageModal(item?.large)}
                    style={{
                      flex: 1 / 3,
                      aspectRatio: 1,
                      backgroundColor: note?.color.light,
                      margin: 1,
                      overflow: 'hidden',
                    }}>
                    <CustomImage
                      source={{ uri: fileURL + item?.medium }}
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                      imageStyle={
                        {
                          // borderRadius: 20,
                        }
                      }
                      indicatorProps={{ color: Colors.primary }}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        )}
        <View
          style={{
            paddingVertical: Platform.OS == 'android' || !isIphoneX() ? 10 : 0,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.placeHolder,
            }}>{`Last updated at ${moment(note?.updatedAt).format(
              'DD-MM-YYYY hh:mm A',
            )}`}</Text>
        </View>
        <ImageZoomer
          closeModal={hideImageModal}
          visible={!!modalImage}
          url={modalImage}
          color={note?.color.light}
        // noUrl
        />
        <Loader enable={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default NoteDetail;
