import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import Modal from 'react-native-modal';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import Collapsible from 'react-native-collapsible';
import ImagePicker from 'react-native-image-crop-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';

let audioRecorderPlayer = new AudioRecorderPlayer();

//icons
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
// import ic_cross from '../../../Assets/Icons/cross.png';
import ic_trash from '../../../Assets/Icons/trash.png';
import {isIphoneX} from 'react-native-iphone-x-helper';
const Editor = props => {
  const {navigation} = props;
  const RichText = React.useRef();
  const colorPicker = React.useRef();

  const [isModalVisible, setModalVisibility] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recorder, updateRecorder] = useState({
    isAudioModalVisible: false,
    recorderStatus: 'stopped',
    tempAudio: null,
  });
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [playerStatus, setPlayerStatus] = useState('stopped');
  const [playerTime, setPlayerTime] = useState({
    duration: 0,
    curTimeInSeconds: 0,
    curTime: '00:00',
  });

  const [notes, updateNotes] = useState({
    title: '',
    note: '',
    images: [],
    audio: [],
  });
  const setRecorder = val => updateRecorder({...recorder, ...val});
  const setNotes = val => updateNotes({...notes, ...val});

  const [colorPickerModal, updateColorPickerModal] = useState({
    visibility: false,
    currentColor: '#000000',
  });

  const setColorPickerModal = val =>
    updateColorPickerModal({...colorPickerModal, ...val});

  //? Audio modal

  const AudioRecoderModal = () => {
    return (
      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={recorder.isAudioModalVisible}
        useNativeDriverForBackdrop={true}
        style={{margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
            // alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 40,
          }}>
          <View
            style={{
              marginTop: -20,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              height: 25,
            }}>
            <View style={{width: 25}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontFamily: font.bold, fontSize: 16}}>
                Voice Note
              </Text>
            </View>
            <Pressable
              style={{width: 25}}
              // disabled={recorder.recorderStatus == 'playing'}
              onPress={() => closeModal()}>
              <Image source={ic_cross} style={{height: 25, width: 25}} />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 130,
                width: 130,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {recorder.recorderStatus == 'playing' && (
                <>
                  <Animatable.View
                    iterationCount="infinite"
                    animation={
                      recorder.recorderStatus == 'playing' ? myZoom1x : ''
                    }
                    direction="alternate"
                    duration={1500}
                    style={{
                      backgroundColor: Colors.lightPrimary2,
                      height: 100,
                      width: 100,
                      borderRadius: 100 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      zIndex: -2,
                    }}></Animatable.View>
                  <Animatable.View
                    iterationCount="infinite"
                    animation={
                      recorder.recorderStatus == 'playing' ? myZoom2x : ''
                    }
                    direction="alternate"
                    duration={1500}
                    style={{
                      backgroundColor: Colors.lightPrimary1,
                      height: 70,
                      width: 70,
                      borderRadius: 70 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      zIndex: -1,
                    }}></Animatable.View>
                </>
              )}
              <Pressable
                onPress={recorderPlayPause}
                style={{
                  backgroundColor: Colors.primary,
                  height: 50,
                  width: 50,
                  borderRadius: 50 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={
                    recorder.recorderStatus == 'playing' ? ic_pause : ic_play
                  }
                  style={{height: 20, width: 20, tintColor: Colors.white}}
                />
              </Pressable>
            </View>

            <View style={{marginLeft: 30}}>
              <View style={{}}>
                <Text style={{fontFamily: font.medium, fontSize: 18}}>
                  {recordingTime}
                </Text>
              </View>
              {recorder.recorderStatus == 'playing' && (
                <View style={{minHeight: 20, marginTop: 10}}>
                  <Text style={{fontFamily: font.regular, fontSize: 16}}>
                    Listening...
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Pressable
            onPress={btn_addAudioModal}
            disable={recorder.tempAudio == null}
            style={{
              backgroundColor:
                recorder.tempAudio != null
                  ? Colors.lightPrimary
                  : Colors.gray01,
              alignSelf: 'flex-end',
              height: 45,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginBottom: -20,
            }}>
            <Text
              style={{
                fontFamily: font.bold,
                color:
                  recorder.tempAudio != null
                    ? Colors.primary
                    : Colors.placeHolder,
                fontSize: 16,
              }}>
              Add
            </Text>
          </Pressable>
        </View>
      </Modal>
    );
  };

  const recorderPlayPause = () => {
    console.log('recorder.recorderStatus', recorder.recorderStatus);
    if (recorder.recorderStatus == 'playing') {
      onPauseRecord();
    } else if (recorder.recorderStatus == 'stopped') {
      onStartRecord();
    } else {
      onResumeRecord();
    }
  };

  const closeModal = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecorder({
      isAudioModalVisible: false,
      recorderStatus: 'stopped',
      tempAudio: null,
    });
    setRecordingTime('00:00');
    console.log('onModalHide', result);
  };

  const btn_addAudioModal = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecorder({
      isAudioModalVisible: false,
      recorderStatus: 'stopped',
      tempAudio: null,
    });
    setRecordingTime('00:00');
    let audioObj = {
      uri: result,
      name: result.split('/').pop(),
      type: 'audio/' + result.split('.').pop(),
    };
    setNotes({audio: [audioObj]});
    console.log('onModalHide', result);
  };

  const onStartRecord = async () => {
    console.log('Hello');
    const result = await audioRecorderPlayer.startRecorder();
    let audioObj = {
      uri: result,
      name: result.split('/').pop(),
      type: 'audio/' + result.split('.').pop(),
    };
    console.log(result);
    // setRecorder({});
    setRecorder({
      recorderStatus: 'playing',
      tempAudio: audioObj,
    });
    audioRecorderPlayer.addRecordBackListener(e => {
      let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
      let recordingTime = time.slice(0, -3).toString();
      setRecordingTime(recordingTime);
      return;
    });
  };

  const onPauseRecord = async () => {
    setRecorder({recorderStatus: 'paused'});
    const result = await audioRecorderPlayer.pauseRecorder();
    console.log('result: ' + result);
  };

  const onResumeRecord = async () => {
    const result = await audioRecorderPlayer.resumeRecorder();
    setRecorder({recorderStatus: 'playing'});
    console.log('result: ' + result);
  };

  //? Image Picker

  const openGallery = async () => {
    setModalVisibility(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        mediaType: 'photo',
        cropperStatusBarColor: Colors.background,
        cropperToolbarColor: Colors.background,
      })
        .then(image => {
          console.log('Image', image);
          // setUser({imageURI: image.sourceURL});

          let objImge;
          if (Platform.OS == 'android') {
            let name = image.path.split('/');
            objImge = {
              uri: image.path,
              name: name[name.length - 1],
              type: image.mime,
            };
          } else if (Platform.OS == 'ios') {
            objImge = {
              uri: image.path,
              name: image.filename,
              type: image.mime,
            };
          }
          setNotes({images: [objImge, ...notes.images]});
        })
        .catch(e => {
          console.log('Error', e);
          console.log('HI', JSON.stringify(e));
          if (e.code == 'E_NO_LIBRARY_PERMISSION') {
            showToast(
              'Please allow permssion in settings first',
              'Permission denied',
            );
          }
        });
    }, 500);
  };

  const openCamera = async () => {
    setModalVisibility(false);
    let granted;
    if (Platform.OS == 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      granted = true;
    }

    if (granted) {
      setTimeout(() => {
        ImagePicker.openCamera({
          width: 800,
          height: 800,
          cropping: true,
          mediaType: 'photo',
          cropperStatusBarColor: Colors.background,
          cropperToolbarColor: Colors.background,
        })
          .then(image => {
            console.log('Image', image);
            let objImge;
            if (Platform.OS == 'android') {
              let name = image.path.split('/');
              objImge = {
                uri: image.path,
                name: name[name.length - 1],
                type: image.mime,
              };
            } else if (Platform.OS == 'ios') {
              let name = image.path.split('/');
              objImge = {
                uri: image.path,
                name: !!image.filename ? image.filename : name[name.length - 1],
                type: image.mime,
              };
            }
            setNotes({images: [objImge, ...notes.images]});
          })
          .catch(e => {
            console.log('Error', e);
            if (e?.code == 'E_NO_CAMERA_PERMISSION') {
              showToast(e.message, 'Permission not granted');
            }
          });
      }, 500);
    }
  };

  const ImagePickerOptionsModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
        onBackdropPress={() => setModalVisibility(false)}
        useNativeDriverForBackdrop={true}
        style={{marginTop: 'auto', margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                Select Image
              </Text>
            </View>

            <Pressable
              onPress={() => setModalVisibility(false)}
              style={{alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_cross} style={{height: 10, width: 10}} />
              </View>
            </Pressable>
          </View>
          <View
            style={{marginTop: 25, flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={openCamera} style={{alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_camera} style={{height: 20, width: 20}} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}>
                Camera
              </Text>
            </Pressable>

            <Pressable
              onPress={openGallery}
              style={{alignItems: 'center', marginLeft: 30}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_gallery} style={{height: 20, width: 20}} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}>
                Gallery
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const removeImage = i => {
    let temp = [...notes.images];
    temp.splice(i, 1);
    setNotes({images: [...temp]});
  };

  const ColorPickerModal = () => {
    return (
      <Modal
        isVisible={colorPickerModal.visibility}
        onBackdropPress={() => setColorPickerModal({visibility: false})}
        onBackButtonPress={() => setColorPickerModal({visibility: false})}
        style={{}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#fff',
            borderRadius: 15,
            marginHorizontal: -10,
          }}>
          <Pressable
            onPress={() => setColorPickerModal({visibility: false})}
            style={{
              alignSelf: 'flex-end',
              padding: 5,
              backgroundColor: Colors.gray01,
              borderRadius: 999,
              margin: 10,
            }}>
            <Image source={ic_cross} style={{height: 25, width: 25}} />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            {myColors.map(item => (
              <Pressable
                style={{
                  height: 35,
                  width: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}
                onPress={() => {
                  RichText?.current.sendAction('foreColor', 'result', item);
                  setColorPickerModal({currentColor: item});
                }}>
                <View
                  style={{
                    backgroundColor: item,
                    height: colorPickerModal.currentColor === item ? 35 : 30,
                    width: colorPickerModal.currentColor === item ? 35 : 30,
                    borderRadius: 999,
                    borderColor:
                      colorPickerModal.currentColor === item
                        ? Colors.primary
                        : Colors.gray08,
                    borderWidth: 1.5,
                  }}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  //? player
  const playerPlayPause = async () => {
    console.log('playerStatus', playerStatus);
    console.log('playerTime.curTime', playerTime.curTimeInSeconds);
    console.log('playerTime.duration', playerTime.duration);
    if (playerStatus == 'stopped') {
      onStartPlay();
    } else if (
      playerStatus == 'stopped' &&
      playerTime.curTimeInSeconds != 0 &&
      playerTime.duration != 0 &&
      Math.floor(playerTime.curTimeInSeconds) == Math.floor(playerTime.duration)
    ) {
      onRestartPlay();
    } else if (playerStatus == 'paused') {
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
    const msg = await audioRecorderPlayer.startPlayer(notes?.audio[0]?.uri);
    console.log(msg);

    audioRecorderPlayer.addPlayBackListener(e => {
      console.log('player event', e);
      // setState({
      //   currentPositionSec: e.currentPosition,
      //   currentDurationSec: e.duration,
      //   playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      //   duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      // });

      let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
      let duration = audioRecorderPlayer.mmssss(Math.floor(e.duration));
      let recordingTime = time.slice(0, -3).toString();
      setPlayerTime({
        duration: e.duration,
        curTimeInSeconds: e.currentPosition,
        curTime: recordingTime,
      });
      if (e.currentPosition == e.duration) {
        onStopPlay();
      }
      return;
    });
  };

  const onPausePlay = async () => {
    setPlayerStatus('paused');
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    setPlayerStatus('playing');
    await audioRecorderPlayer.resumePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    setPlayerStatus('stopped');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const onSeek = async time => {
    console.log('onSeek', time);
    // if (playerStatus == 'stopped') {
    //   await onStartPlay();
    //   await audioRecorderPlayer.seekToPlayer(time);
    // } else {
    let stime = audioRecorderPlayer.mmssss(Math.floor(time));
    let curTime = stime.slice(0, -3).toString();
    setPlayerTime({
      duration: playerTime.duration,
      curTimeInSeconds: time,
      curTime: curTime,
    });
    await audioRecorderPlayer.seekToPlayer(time);
    // }
    // setPlayerStatus('stopped');
    // audioRecorderPlayer.stopPlayer();
    // audioRecorderPlayer.removePlayBackListener();
  };

  useEffect(() => {
    console.log(notes.audio, 'notes.audio');
    if (!!notes.audio?.uri) {
    }
  }, [notes.audio]);

  useEffect(() => {
    return () => {
      onStopPlay();
    };
  }, []);

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header
        titleAlignLeft
        navigation={navigation}
        title={'Add Note'}
        rightIcon={ic_save}
        rightIcononPress={() =>
          props.navigation.navigate({
            name: screens.notesList,
            params: {
              updated: true,
            },
            merge: true,
          })
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? (isIphoneX() ? 97 : 50) : 0
          }
          enabled={true}
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <>
            <View style={{flex: 1}}>
              <View
                style={{
                  paddingTop: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.gray01,
                }}>
                <TextInput
                  style={{
                    fontSize: 16,
                    fontFamily: font.bold,
                    paddingBottom: 3,
                  }}
                  autoCorrect={false}
                  autoComplete={false}
                  onChangeText={text => setNotes({title: text})}
                  placeholder="Title"
                  selectionColor={Colors.primary}
                  onFocus={() => setIsFocused(false)}
                />
              </View>

              <Pressable
                onPress={() => {
                  console.log(RichText?.current._focus);
                  if (RichText?.current._focus == false) {
                    console.log('==>true');
                    RichText?.current?.focusContentEditor();
                    setIsFocused(true);
                  }
                }}
                style={{
                  borderRadius: 10,
                  marginTop: 20,
                  minHeight: 150,
                  marginHorizontal: -10,
                  flex: 1,
                }}>
                <View style={{minHeight: 150}}>
                  <RichEditor
                    ref={RichText}
                    style={{
                      borderRadius: 10,
                    }}
                    initialHeight={150}
                    editorStyle={{
                      // backgroundColor: Colors.gray01,
                      // caretColor: Colors.primary,
                      contentCSSText:
                        '@font-face {font-family: myFirstFont;src: url(Pangram-Bold.otf); }, * {font-family: myFirstFont;}',
                    }}
                    setDisplayZoomControls={true}
                    initialContentHTML={notes.note}
                    useContainer={true}
                    placeholder={"What's in your mind"}
                    onChange={text => setNotes({note: text})}
                    androidLayerType="software"
                    androidHardwareAccelerationDisabled
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    onFocus={() => {
                      console.log('focused');
                      setIsFocused(true);
                    }}
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: -10,
                    marginTop: 20,
                  }}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 10,
                      paddingVertical: 10,
                    }}
                    data={notes?.images}
                    renderItem={({item, index}) => {
                      console.log('notes?.images', item);
                      return (
                        <View
                          style={{
                            height: 120,
                            width: 120,
                            borderRadius: 20,
                            marginRight: 10,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,

                            elevation: 3,
                            // borderWidth: 1,
                            // borderColor: Colors.placeHolder,
                          }}>
                          <Image
                            source={{uri: item?.uri}}
                            style={{
                              height: '98%',
                              width: '98%',
                              borderRadius: 20,
                            }}
                          />
                          <Pressable
                            onPress={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              height: 25,
                              width: 25,
                              borderRadius: 15,
                              backgroundColor: Colors.white,
                              borderColor: Colors.placeHolder,
                              borderWidth: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              shadowColor: '#000',
                              shadowOffset: {
                                width: 0,
                                height: 1,
                              },
                              shadowOpacity: 0.22,
                              shadowRadius: 2.22,

                              elevation: 3,
                            }}>
                            <Image
                              source={ic_cross}
                              style={{height: 10, width: 10}}
                            />
                          </Pressable>
                        </View>
                      );
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.background,
                      borderRadius: 20,
                    }}>
                    <View
                      style={{
                        height: 105,
                        width: 105,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* {playerStatus == 'playing' && (
                      <>
                        <Animatable.View
                          iterationCount="infinite"
                          // animation={
                          //   playerStatus == 'playing' ? myZoom1x : ''
                          // }
                          animation={"pulse"}
                          // direction="alternate"
                          duration={500}
                          style={{
                            // backgroundColor: Colors.lightPrimary1,
                            height: 90,
                            width: 90,
                            borderRadius: 90 / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            zIndex: -2,
                          }}></Animatable.View>
                        <Animatable.View
                          iterationCount="infinite"
                          // animation={
                          //   playerStatus == 'playing' ? myZoom2x : ''
                          // }
                          animation={"pulse"}
                          // animation={myZoom2x}
                          // direction="alternate"
                          duration={500}
                          style={{
                            // backgroundColor: Colors.lightPrimary2,
                            height: 70,
                            width: 70,
                            borderRadius: 70 / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            zIndex: -1,
                          }}></Animatable.View>
                      </>
                      )} */}
                      <Pressable
                        onPress={playerPlayPause}
                        style={{
                          backgroundColor: Colors.primary,
                          height: 50,
                          width: 50,
                          borderRadius: 50 / 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={
                            playerStatus == 'playing' ? ic_pause : ic_play
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: Colors.white,
                          }}
                        />
                      </Pressable>
                    </View>

                    <View
                      style={{marginHorizontal: 5, flex: 1, marginRight: 20}}>
                      <View>
                        <Slider
                          style={{
                            slider: {
                              marginTop: 0,
                              width: '100%',
                            },
                          }}
                          value={playerTime.curTimeInSeconds}
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
                          maximumValue={playerTime.duration}
                          onValueChange={val => {
                            // setIsSeeking(true);
                            // setSeek(val);
                          }}
                          onSlidingComplete={onSeek}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={{fontFamily: font.medium, fontSize: 14}}>
                          {playerTime.curTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>

            <Collapsible collapsed={!isFocused}>
              <RichToolbar
                editor={RichText}
                actions={[
                  actions.keyboard,
                  ['images'],
                  ['audio'],
                  actions.undo,
                  actions.redo,
                  actions.foreColor,
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.removeFormat,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                ]}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 10,
                }}
                iconTint={Colors.placeHolder}
                iconMap={{
                  images: ({tintColor}) => (
                    <TouchableOpacity
                      onPress={() => setModalVisibility(true)}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        key={'image'}
                        source={ic_image}
                        style={{
                          height: 18,
                          width: 18,
                          tintColor: Colors.placeHolder,
                        }}
                      />
                    </TouchableOpacity>
                  ),
                  [actions.foreColor]: ({tintColor}) => (
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setColorPickerModal({visibility: true})}>
                      <Image
                        source={ic_pallete}
                        style={{
                          height: 18,
                          width: 18,
                          tintColor: Colors.placeHolder,
                        }}
                      />
                    </TouchableOpacity>
                  ),

                  audio: ({tintColor}) => (
                    <TouchableOpacity
                      onPress={() => setRecorder({isAudioModalVisible: true})}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        key={'audio'}
                        source={ic_mic}
                        style={{
                          height: 18,
                          width: 18,
                          tintColor: Colors.placeHolder,
                        }}
                      />
                    </TouchableOpacity>
                  ),
                }}
                selectedIconTint={Colors.primary}
              />
            </Collapsible>
          </>
        </KeyboardAvoidingView>
        {ColorPickerModal()}
        {ImagePickerOptionsModal()}
        {AudioRecoderModal()}
      </View>
    </SafeAreaView>
  );
};

export default Editor;

const myColors = [
  '#FFFFFF',
  '#000000',
  '#C0C0C0',
  '#808080',
  '#008000',
  '#00FF00',
  '#800000',
  '#FF0000',
  '#000080',
  '#0000FF',
  '#008080',
  '#00FFFF',
  '#FF00FF',
  '#800080',
  '#FFFF00',
];

const myZoom1x = {
  0: {
    opacity: 0,
    scale: 0,
  },
  0.5: {
    opacity: 0,
    scale: 0.5,
  },

  0.7: {
    opacity: 0,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const myZoom2x = {
  0: {
    opacity: 0,
    scale: 0,
  },
  0.5: {
    opacity: 1,
    scale: 0.3,
  },

  1: {
    opacity: 1,
    scale: 1,
  },
};
