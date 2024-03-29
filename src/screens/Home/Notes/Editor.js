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
  Alert,
  PermissionsAndroid,
  ScrollView,
  LogBox,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from '../../../Components/Header';
import Colors, { notesColors } from '../../../Utilities/Colors';
import { mainStyles, stat_styles } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import Modal from 'react-native-modal';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Collapsible from 'react-native-collapsible';
import ImagePicker from 'react-native-image-crop-picker';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import ImageZoomer from '../../../Components/ImageZoomer';

// fro API calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import analytics from '@react-native-firebase/analytics';
import Dialog from 'react-native-dialog';

let audioRecorderPlayer = new AudioRecorderPlayer();

//icons
const ic_pallete = require('../../../Assets/Icons/palette.png');
const ic_cross = require('../../../Assets/Icons/cross.png');
const ic_save = require('../../../Assets/Icons/tick1.png');
const ic_image = require('../../../Assets/Icons/h_placeholder1.png');

const ic_mic = require('../../../Assets/Icons/microphone-black-shape.png');
const ic_gallery = require('../../../Assets/Icons/gallery.png');
const ic_camera = require('../../../Assets/Icons/camera.png');
const ic_play = require('../../../Assets/TrackPlayer/playTrack.png');
const ic_stop = require('../../../Assets/TrackPlayer/stop.png');
const ic_pause = require('../../../Assets/TrackPlayer/pauseTrack.png');
const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');
const ic_colorPicker = require('../../../Assets/Icons/pickColor.png');
import ic_download from '../../../Assets/Icons/download.png';

// import ic_cross from '../../../Assets/Icons/cross.png';
import ic_trash from '../../../Assets/Icons/trash.png';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { fileURL } from '../../../Utilities/domains';
import { not } from 'expect';
const screen = Dimensions.get('screen');

import { RESULTS, request, PERMISSIONS } from 'react-native-permissions';


const Editor = props => {
  const oldnote1 = props?.route?.params?.note;
  const { navigation } = props;
  const RichText = React.useRef();
  const scrollRef = React.useRef();
  const { Token, downloadAudioNote, dashboardData, setDashBoardData } = useContext(Context);

  const [isLoading, setisLoading] = useState(false);
  const [LinkModal, setLinkModal] = useState({
    showDialog: false,
    link: '',
  });
  const [modalImage, setModalImage] = useState(null);
  const [edit, setEdit] = useState(oldnote1 ? true : false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isbackgroundColorModalVisible, setBackgroundColorModalVisiblity] =
    useState(false);
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
    title: oldnote1 ? oldnote1.title : '',
    note: oldnote1 ? oldnote1.description : '',
    images: [],
    // audio: oldnote1 ? oldnote1.audio : '',
    audio: '',
    colors: oldnote1 ? oldnote1.color : notesColors[0],
    oldImages: oldnote1 ? oldnote1.images : [],
    removeImage: [],
  });
  const setRecorder = val => updateRecorder({ ...recorder, ...val });
  const setNotes = val => updateNotes({ ...notes, ...val });

  const [colorPickerModal, updateColorPickerModal] = useState({
    visibility: false,
    currentColor: '#000000',
  });

  const download = async () => {
    console.log('download');
    try {
      setNotes({ audio: 'downloading' });
      let AudioPath = await downloadAudioNote(oldnote1?.audio);
      setNotes({ audio: { uri: 'file://' + AudioPath } });
    } catch (e) {
      setNotes({ audio: 'error' });
    }
  };

  //? Link MOdal

  const openDialogue = () => {
    setLinkModal({ showDialog: true, link: '' });
  };
  const closeDialogue = () => {
    setLinkModal({ showDialog: false, link: '' });
  };

  const LinkDialog = () => {
    return (
      <View>
        <Dialog.Container
          visible={LinkModal.showDialog}
          onBackdropPress={() => closeDialogue()}>
          <Dialog.Title style={{ color: Colors.black, fontFamily: font.semi }}>
            Insert Link
          </Dialog.Title>
          <Dialog.Description
            style={{ color: Colors.black, fontFamily: font.medium }}>
            Please enter the link
          </Dialog.Description>
          <Dialog.Input
            style={{ color: Colors.black, fontFamily: font.medium }}
            onChangeText={link => setLinkModal({ ...LinkModal, link: link })}
          />
          <Dialog.Button label="Cancel" onPress={() => closeDialogue()} />
          <Dialog.Button
            label="Add "
            onPress={() => {
              let link = LinkModal.link;
              if (!link.includes('http')) {
                link = 'http://' + link;
              }
              RichText.current?.insertLink(null, link);
              closeDialogue();
            }}
          />
        </Dialog.Container>
      </View>
    );
  };

  //? ImageZommer

  const showImageModal = image => {
    setModalImage(image);
  };

  const hideImageModal = () => {
    setModalImage(null);
  };

  const setColorPickerModal = val =>
    updateColorPickerModal({ ...colorPickerModal, ...val });

  //? backgroundColorModal

  const backgroundColorModal = () => {
    return (
      <Modal
        isVisible={isbackgroundColorModalVisible}
        onBackButtonPress={() => setBackgroundColorModalVisiblity(false)}
        onBackdropPress={() => setBackgroundColorModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        style={{ marginTop: 'auto', margin: 0 }}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
          }}>
          <View
            style={{
              marginTop: -20,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              height: 50,
            }}>
            <View style={{ width: 25 }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: font.bold, fontSize: 16 }}>
                Select Note Color
              </Text>
            </View>
            <Pressable
              style={{ width: 25 }}
              // disabled={recorder.recorderStatus == 'playing'}
              onPress={() => setBackgroundColorModalVisiblity(false)}>
              <Image source={ic_cross} style={{ height: 25, width: 25 }} />
            </Pressable>
          </View>
          <FlatList
            data={notesColors}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  style={{ flex: 1 / 2 }}
                  onPress={() => toggleSelect(item)}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: Colors.white,
                      // margin: 5,
                      // marginLeft: index % 2 == 0 ? 5 : 5 / 2,
                      // marginRight: index % 2 != 0 ? 5 : 5 / 2,
                      margin: 5,
                      padding: 10,
                      borderRadius: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: Colors.gray02,
                    }}>
                    {item._id == 'none' ? (
                      <View style={{ height: 30, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: font.medium }}>None</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          backgroundColor: item.dark,
                          borderRadius: 999,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            height: '80%',
                            width: '80%',
                            backgroundColor: item.dark,
                            borderRadius: 999,
                          }}
                        />
                      </View>
                    )}
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Image
                        source={
                          item._id == notes.colors._id ? checked : unChecked
                        }
                        style={[
                          stat_styles.filterButtonIcon,
                          // {tintColor: Colors.placeHolder},
                        ]}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    );
  };

  const toggleSelect = item => {
    setNotes({ colors: item });
    setBackgroundColorModalVisiblity(false);
  };

  const checkPermissionsAndroid = async () => {
    if (Platform.OS === 'android') {
      try {
        const OsVer = Platform.constants['Release'];
        console.log(OsVer, "OS Version")

        if (OsVer >= 13) {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          console.log('write external stroage', grants);
          if (
            grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Permissions granted');
            return true;
          } else {
            console.log('All required permissions not granted');
            return false;
          }
        } else {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          console.log('write external stroage', grants);
          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Permissions granted');
            return true;
          } else {
            console.log('All required permissions not granted');
            return false;
          }
        }

      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const granted = await request(PERMISSIONS.IOS.MICROPHONE);
      if (granted == RESULTS.GRANTED) {
        console.log('The permission is granted');
        return true
      } else {
        return false
      }
    }
  };
  //? Audio modal

  const onMicPress = async () => {
    let granted;
    // if (Platform.OS == 'android') {
    granted = await checkPermissionsAndroid();
    // }
    if (granted) {
      setRecorder({ isAudioModalVisible: true });
    } else {
      showToast('Please grant permission from settings first.', 'Permission denied');
    }
  };

  const AudioRecoderModal = () => {
    return (
      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={recorder.isAudioModalVisible}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}>
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
            <View style={{ width: 25 }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: font.bold, fontSize: 16 }}>
                Voice Note
              </Text>
            </View>
            <Pressable
              style={{ width: 25 }}
              // disabled={recorder.recorderStatus == 'playing'}
              onPress={() => closeModal()}>
              <Image source={ic_cross} style={{ height: 25, width: 25 }} />
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
                  style={{ height: 20, width: 20, tintColor: Colors.white }}
                />
              </Pressable>
            </View>

            <View style={{ marginLeft: 30 }}>
              <View style={{}}>
                <Text style={{ fontFamily: font.medium, fontSize: 18 }}>
                  {recordingTime}
                </Text>
              </View>
              {recorder.recorderStatus == 'playing' && (
                <View style={{ minHeight: 20, marginTop: 10 }}>
                  <Text style={{ fontFamily: font.regular, fontSize: 16 }}>
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

  const recorderPlayPause = async () => {
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
    await analytics().logEvent('AUDIO_RECORDED_BY_USER_EVENT');
    const result = await audioRecorderPlayer.stopRecorder();
    console.log('onModalHide', result);
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
    setNotes({ audio: audioObj });

    await onStopPlay();
    const msg = await audioRecorderPlayer.startPlayer(result);
    let firstTime = true;
    audioRecorderPlayer.addPlayBackListener(async e => {
      console.log('event', e);
      if (firstTime) {
        firstTime = false;
        setPlayerStatus('paused');
        await audioRecorderPlayer.pausePlayer();
      }
      let time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
      let recordingTime1 = time.slice(0, -3).toString();
      setPlayerTime({
        duration: e.duration,
        curTimeInSeconds: e.currentPosition,
        curTime: recordingTime1,
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
    console.log('onModalHide', result);
  };

  const onStartRecord = async () => {
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
    setRecorder({ recorderStatus: 'paused' });
    const result = await audioRecorderPlayer.pauseRecorder();
    console.log('result: ' + result);
  };

  const onResumeRecord = async () => {
    const result = await audioRecorderPlayer.resumeRecorder();
    setRecorder({ recorderStatus: 'playing' });
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
          setNotes({ images: [objImge, ...notes.images] });
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
            setNotes({ images: [objImge, ...notes.images] });
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
        style={{ marginTop: 'auto', margin: 0 }}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                Select Image
              </Text>
            </View>

            {/* <Pressable
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
            </Pressable> */}
            <Pressable
              style={{ width: 25 }}
              // disabled={recorder.recorderStatus == 'playing'}
              onPress={() => setModalVisibility(false)}>
              <Image source={ic_cross} style={{ height: 25, width: 25 }} />
            </Pressable>
          </View>
          <View
            style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={openCamera} style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_camera} style={{ height: 20, width: 20 }} />
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
              style={{ alignItems: 'center', marginLeft: 30 }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_gallery} style={{ height: 20, width: 20 }} />
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
    Alert.alert('Remove Image', 'Are you sure you want to remove this image', [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        onPress: () => {
          let temp = [...notes.images];
          temp.splice(i, 1);
          setNotes({ images: [...temp] });
        },
      },
    ], { cancelable: true });
  };

  const ColorPickerModal = () => {
    return (
      <Modal
        isVisible={colorPickerModal.visibility}
        onBackdropPress={() => setColorPickerModal({ visibility: false })}
        onBackButtonPress={() => setColorPickerModal({ visibility: false })}
        useNativeDriverForBackdrop={true}
        style={{}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#fff',
            borderRadius: 15,
            marginHorizontal: -10,
          }}>
          {/* <Pressable
            onPress={() => setColorPickerModal({visibility: false})}
            style={{
              alignSelf: 'flex-end',
              padding: 5,
              backgroundColor: Colors.gray01,
              borderRadius: 999,
              margin: 10,
            }}>
            <Image source={ic_cross} style={{height: 25, width: 25}} />
          </Pressable> */}
          <Pressable
            style={{
              width: 50,
              height: 50,
              alignSelf: 'flex-end',
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // disabled={recorder.recorderStatus == 'playing'}
            onPress={() => setColorPickerModal({ visibility: false })}>
            <Image source={ic_cross} style={{ height: 25, width: 25 }} />
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            {myColors.map((item, index) => (
              <Pressable
                key={index.toString()}
                style={{
                  height: 35,
                  width: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}
                onPress={() => {
                  RichText?.current.sendAction('foreColor', 'result', item);
                  // RichText?.current.setTextColor(item)
                  setColorPickerModal({ currentColor: item, visibility: false });
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

    let granted = true;
    if (Platform.OS == 'android') {
      granted = await checkPermissionsAndroid();
    }
    if (granted) {
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
    } else {
      showToast('Please grant permission', 'permission denied');
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
    const msg = await audioRecorderPlayer.startPlayer(notes?.audio?.uri);
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
      const msg = await audioRecorderPlayer.startPlayer(notes?.audio?.uri);
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

  const removeAudio = () => {
    Alert.alert('Delete Audio', 'Are you sure you want to delete this audio?', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: () => {
          setNotes({
            audio: '',
          });
          onStopPlay();
        },
      },
    ], { cancelable: true });
  };

  // Add in Remove Array
  const addInRemoveArray = obj => {
    let newArray = [...notes.oldImages];
    let index = newArray.findIndex(x => x.small == obj.small);
    let arr = [obj.small, obj.medium, obj.large];
    console.log(arr, 'arr...');
    let uniqArr = [...new Set(arr)];
    console.log(uniqArr, 'uniqArr...');
    if (index != -1) {
      newArray.splice(index, 1);
      setNotes({
        oldImages: [...newArray],
        removeImage: [...notes.removeImage, ...uniqArr],
      });
    }
  };

  // useEffect(() => {
  //   console.log(notes, 'notes...');
  // }, [notes]);

  //? Save Button
  const btn_save = () => {
    if (notes.title.trim() == '') {
      showToast('Please enter a Title', 'Alert');
    } else {
      let fd_note = new FormData();
      fd_note.append('title', notes.title.trim());
      fd_note.append('description', notes.note);
      notes.images.forEach(image => fd_note.append('image', image));
      fd_note.append('color', JSON.stringify(notes.colors));
      if (notes.audio != '') {
        fd_note.append('audio', notes.audio);
      }
      api_addNote(fd_note);
      console.log(fd_note, 'fd_note...');
    }
  };

  const btn_edit = () => {
    if (notes.title.trim() == '') {
      showToast('Please enter a Title', 'Alert');
    } else {
      let fd_note = new FormData();
      fd_note.append('title', notes.title.trim());
      fd_note.append('description', notes.note);
      notes.images.forEach(image => fd_note.append('image', image));
      fd_note.append('remove_images', JSON.stringify(notes.removeImage));
      fd_note.append('old_images', JSON.stringify(notes.oldImages));
      fd_note.append('color', JSON.stringify(notes.colors));
      if (notes?.audio?.uri?.includes('cache')) {
        fd_note.append('audio', notes.audio);
      }
      if (!!oldnote1?.audio == true && !!notes?.audio == false) {
        fd_note.append('delete_audio', true);
      } else {
        fd_note.append('delete_audio', false);
      }
      api_editNote(fd_note);
      console.log(fd_note, 'fd_note...');
    }
  };

  //todo /////////////// API's

  const api_addNote = async fdata => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/note/add_note',
      method: 'POST',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',

        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        await analytics().logEvent('NOTE_CREATED_BY_USER_EVENT');
        navigation.navigate({
          name: screens.notesList,
          params: {
            addNew: res.Note,
          },
          merge: false,
        });
        let tempObj = [...dashboardData.notes]
        tempObj[1] = tempObj[0]
        tempObj[0] = res.Note,
          dashboardData.notes = [...tempObj];
        await setDashBoardData({ ...dashboardData })
      } else {
        showToast(res.message);
      }
    }
  };

  const api_editNote = async fdata => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/note/edit_note/' + oldnote1._id,
      method: 'PUT',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        if (!!props.route.params?.updateNote) {
          props.route.params?.updateNote(res.note);
        }
        navigation.navigate(screens.notesDetail, {
          editedNote: res.note,
        });
        await updateDashBoardNote(res.note);
      } else {
        showToast(res.message);
      }
    }
  };

  const updateDashBoardNote = async (note) => {
    let tempArr = [...dashboardData.notes]
    let idx = tempArr.findIndex(x => x._id == note._id)
    if (idx != -1) {
      tempArr[idx] = note;
    }
    await setDashBoardData({
      ...dashboardData,
      notes: [...tempArr]
    })
  }

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    analytics().logEvent(props?.route?.name);
    return () => {
      onStopPlay();
      closeModal();
    };
  }, []);

  useEffect(() => {
    if (!!props?.route?.params?.note?.audio) {
      console.log('hi');
      download();
    }
    //   if (!!props?.route?.params?.note) {
    //     let oldNote = props?.route?.params?.note;
    //     console.log(oldNote, 'oldNote..');
    //     edit = true;
    //     setNotes({
    //       title: oldNote.title,
    //       note: oldNote.description,
    //       oldImages: oldNote?.images,
    //       audio: oldNote?.audio,
    //       // colors: oldNote.color,
    //     });
    //     if (!!oldNote?.audio) {
    //       download();§
    //     }
    //   } else {
    //     edit = false;
    //   }
    return () => { };
  }, []);

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          backgroundColor: notes.colors.light,
        },
      ]}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={notes.colors.light}
      />
      <Header
        titleAlignLeft
        navigation={navigation}
        title={edit ? 'Edit Note' : 'Add Note'}
        rightIcon2View={
          <Pressable
            disabled={isLoading}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              width: 60,
              justifyContent: 'center',
              backgroundColor: Colors.white,
              borderRadius: 20,
              marginRight: 10,
              borderColor: Colors.gray02,
              borderWidth: 1 / 2,
            }}
            onPress={() => setBackgroundColorModalVisiblity(prev => !prev)}>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: notes.colors.dark,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
            </View>
            <View
              style={{
                marginLeft: 5,
              }}>
              <Image
                source={require('../../../Assets/Icons/down-arrow.png')}
                style={{ height: 12, width: 12, tintColor: Colors.black }}
              />
            </View>
          </Pressable>
        }
        rightIconView={
          <Pressable
            onPress={!!oldnote1 ? btn_edit : btn_save}
            disabled={isLoading}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              width: 70,
              justifyContent: 'center',
              backgroundColor: Colors.white,
              borderRadius: 20,
              marginRight: 10,
              borderColor: Colors.gray02,
              borderWidth: 1 / 2,
            }}>
            <Text style={{ fontFamily: font.medium }}>Save</Text>
            <View
              style={{
                marginLeft: 5,
              }}>
              <Image
                source={ic_save}
                style={{ height: 12, width: 12, tintColor: Colors.black }}
              />
            </View>
          </Pressable>
        }
        rightIcon2onPress={() => { }}
      />

      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? (isIphoneX() ? 97 : 70) : 0
          }
          enabled={true}
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingTop: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.gray01,
                  paddingHorizontal: 20,
                }}>
                <TextInput
                  style={{
                    fontSize: 16,
                    fontFamily: font.bold,
                    paddingBottom: 3,
                  }}
                  autoCorrect={false}
                  autoComplete={'off'}
                  onChangeText={text => setNotes({ title: text })}
                  placeholder="Title"
                  value={notes.title}
                  selectionColor={Colors.primary}
                  onFocus={() => setIsFocused(false)}
                  autoFocus={true}
                />
              </View>

              <ScrollView
                scrollEventThrottle={20}
                ref={scrollRef}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    borderRadius: 10,
                    marginTop: 20,
                    minHeight: 150,
                    // flex: 1,
                  }}>
                  <View style={{ minHeight: 150, paddingHorizontal: 20 }}>
                    <RichEditor
                      ref={RichText}
                      style={{
                        borderRadius: 10,
                      }}
                      onCursorPosition={scrollY => {
                        scrollRef?.current.scrollTo({
                          y: scrollY - 30,
                          animated: true,
                        });
                      }}
                      onContentSizeChange={res => { }}
                      initialHeight={150}
                      initialContentHTML={notes.note}
                      editorStyle={{
                        backgroundColor: notes.colors.light,
                        contentCSSText:
                          ' * {font-family: "Verdana", sans-serif;}',
                      }}
                      onInput={res => { }}
                      pasteAsPlainText={true}
                      placeholder={"What's in your mind"}
                      onChange={text => {
                        setNotes({ note: text });
                      }}
                      onPaste={() => {
                        scrollRef?.current.scrollToEnd({
                          animated: true,
                        });
                      }}
                      // setBuiltInZoomControls={true}
                      androidLayerType="hardware"
                      // androidHardwareAccelerationDisabled
                      onBlur={() => {
                        setIsFocused(false);
                      }}
                      onFocus={() => {
                        setIsFocused(true);
                      }}
                    />
                  </View>
                  {notes.audio != '' && (
                    <View
                      style={{
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
                        paddingBottom: 15,
                        paddingHorizontal: 15,
                        marginHorizontal: 20,
                      }}>
                      <Pressable
                        onPress={removeAudio}
                        style={{
                          alignSelf: 'flex-end',
                          height: 25,
                          width: 25,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: -10,
                          marginTop: 10,
                          borderRadius: 25 / 2,
                          backgroundColor: Colors.logout,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 1.41,

                          elevation: 2,
                        }}>
                        <Image
                          source={ic_cross}
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: Colors.white,
                          }}
                        />
                      </Pressable>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Pressable
                          onPress={() => {
                            if (notes.audio == null || notes.audio == 'error') {
                              downloadAudioNote();
                            } else if (notes.audio == 'downloading') {
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
                          {/* <Image
                              source={
                                playerStatus == 'playing' ? ic_pause : ic_play
                              }
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: Colors.primary,
                              }}
                            /> */}
                          {notes.audio == null || notes.audio == 'error' ? (
                            <Image
                              source={ic_download}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: Colors.primary,
                              }}
                            />
                          ) : notes.audio == 'downloading' ? (
                            <ActivityIndicator />
                          ) : (
                            <Image
                              source={
                                playerStatus == 'playing' ? ic_pause : ic_play
                              }
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
                            // marginHorizontal: 5,
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
                              {/* {playerTime.curTime} */}
                              {getRemainingTime()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      // marginHorizontal: -10,
                      flex: 1,
                      // width: '100%',
                      // width: screen.width,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <FlatList
                      // horizontal={true}
                      // showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      numColumns={3}
                      scrollEnabled={false}
                      data={[...notes?.images, ...notes?.oldImages]}
                      renderItem={({ item, index }) => {
                        if (!!item?.uri) {
                          return (
                            <Pressable
                              onPress={() => showImageModal(item?.uri)}
                              style={{
                                flex: 1 / 3,
                                aspectRatio: 1,
                                backgroundColor: notes?.colors.light,
                                margin: 1,
                              }}>
                              <CustomImage
                                source={{ uri: item.uri }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                indicatorProps={{ color: Colors.primary }}
                              />
                              <Pressable
                                onPress={() => removeImage(index)}
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  height: 30,
                                  width: 30,
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
                                  style={{ height: 15, width: 15 }}
                                />
                              </Pressable>
                            </Pressable>
                            // <View
                            //   style={{
                            //     height: 120,
                            //     width: 120,
                            //     borderRadius: 20,
                            //     marginRight: 10,
                            //     shadowColor: '#000',
                            //     shadowOffset: {
                            //       width: 0,
                            //       height: 1,
                            //     },
                            //     shadowOpacity: 0.22,
                            //     shadowRadius: 2.22,

                            //     elevation: 3,
                            //     // borderWidth: 1,
                            //     // borderColor: Colors.placeHolder,
                            //   }}>
                            //   <Image
                            //     source={{uri: item?.uri}}
                            //     style={{
                            //       height: '98%',
                            //       width: '98%',
                            //       borderRadius: 20,
                            //     }}
                            //   />
                            //   <Pressable
                            //     onPress={() => removeImage(index)}
                            //     style={{
                            //       position: 'absolute',
                            //       top: 10,
                            //       right: 10,
                            //       height: 25,
                            //       width: 25,
                            //       borderRadius: 15,
                            //       backgroundColor: Colors.white,
                            //       borderColor: Colors.placeHolder,
                            //       borderWidth: 1,
                            //       alignItems: 'center',
                            //       justifyContent: 'center',
                            //       shadowColor: '#000',
                            //       shadowOffset: {
                            //         width: 0,
                            //         height: 1,
                            //       },
                            //       shadowOpacity: 0.22,
                            //       shadowRadius: 2.22,

                            //       elevation: 3,
                            //     }}>
                            //     <Image
                            //       source={ic_cross}
                            //       style={{height: 10, width: 10}}
                            //     />
                            //   </Pressable>
                            // </View>
                          );
                        } else {
                          return (
                            <Pressable
                              onPress={() =>
                                showImageModal(fileURL + item?.large)
                              }
                              style={{
                                flex: 1 / 3,
                                aspectRatio: 1,
                                backgroundColor: notes?.colors.light,
                                margin: 1,
                              }}>
                              <CustomImage
                                source={{ uri: fileURL + item.medium }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                }}
                                indicatorProps={{ color: Colors.primary }}
                              />
                              <Pressable
                                onPress={() => addInRemoveArray(item)}
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  height: 30,
                                  width: 30,
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
                                  style={{ height: 15, width: 15 }}
                                />
                              </Pressable>
                            </Pressable>
                            // <View
                            //   style={{
                            //     height: 120,
                            //     width: 120,
                            //     borderRadius: 20,
                            //     marginRight: 10,
                            //     shadowColor: '#000',
                            //     shadowOffset: {
                            //       width: 0,
                            //       height: 1,
                            //     },
                            //     shadowOpacity: 0.22,
                            //     shadowRadius: 2.22,

                            //     elevation: 3,
                            //     // borderWidth: 1,
                            //     // borderColor: Colors.placeHolder,
                            //   }}>
                            //   <Image
                            //     source={{uri: item?.uri}}
                            //     style={{
                            //       height: '98%',
                            //       width: '98%',
                            //       borderRadius: 20,
                            //     }}
                            //   />
                            //   <Pressable
                            //     onPress={() => removeImage(index)}
                            //     style={{
                            //       position: 'absolute',
                            //       top: 10,
                            //       right: 10,
                            //       height: 25,
                            //       width: 25,
                            //       borderRadius: 15,
                            //       backgroundColor: Colors.white,
                            //       borderColor: Colors.placeHolder,
                            //       borderWidth: 1,
                            //       alignItems: 'center',
                            //       justifyContent: 'center',
                            //       shadowColor: '#000',
                            //       shadowOffset: {
                            //         width: 0,
                            //         height: 1,
                            //       },
                            //       shadowOpacity: 0.22,
                            //       shadowRadius: 2.22,

                            //       elevation: 3,
                            //     }}>
                            //     <Image
                            //       source={ic_cross}
                            //       style={{height: 10, width: 10}}
                            //     />
                            //   </Pressable>
                            // </View>
                          );
                        }
                      }}
                    />
                  </View>
                </View>
              </ScrollView>

            </View>

            {isFocused && <View
              style={{ paddingBottom: 10, marginHorizontal: 20 }}
            >
              <RichToolbar
                editor={RichText}
                onInsertLink={() => openDialogue()}
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
                  actions.insertLink,
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
                  images: ({ tintColor }) => (
                    <Pressable
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
                    </Pressable>
                  ),
                  [actions.foreColor]: ({ tintColor }) => (
                    <Pressable
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setColorPickerModal({ visibility: true })}>
                      <Image
                        source={ic_pallete}
                        style={{
                          height: 18,
                          width: 18,
                          tintColor: Colors.placeHolder,
                        }}
                      />
                    </Pressable>
                  ),

                  audio: ({ tintColor }) => (
                    <Pressable
                      onPress={onMicPress}
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
                    </Pressable>
                  ),
                  [actions.heading1]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H1
                    </Text>
                  ),
                  [actions.heading2]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H2
                    </Text>
                  ),
                  [actions.heading3]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H3
                    </Text>
                  ),
                  [actions.heading4]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H4
                    </Text>
                  ),
                  [actions.heading5]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H5
                    </Text>
                  ),
                  [actions.heading6]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>
                      H6
                    </Text>
                  ),
                  [actions.setParagraph]: ({ tintColor }) => (
                    <Text style={{ color: tintColor, fontWeight: '700' }}>P</Text>
                  ),
                }}
                selectedIconTint={Colors.primary}
              />
            </View>}
          </>
        </KeyboardAvoidingView>

        {ColorPickerModal()}
        {ImagePickerOptionsModal()}
        {AudioRecoderModal()}
        {backgroundColorModal()}
        {LinkDialog()}

        <ImageZoomer
          closeModal={hideImageModal}
          visible={!!modalImage}
          url={modalImage}
          color={notes?.colors.light}
          noUrl
        />
        <Loader enable={isLoading} />
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
