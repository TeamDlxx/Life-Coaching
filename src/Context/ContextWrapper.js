import React, { useState, useEffect } from 'react';
import { ContextProvider } from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { baseURL, fileURL } from '../Utilities/domains';
import RNFS from 'react-native-fs';
import showToast from '../functions/showToast';
import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as RNIap from 'react-native-iap';
import { Platform, PermissionsAndroid, DevSettings } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import invokeApi from '../functions/invokeAPI';

import messaging from '@react-native-firebase/messaging';

// Icon

const ContextWrapper = props => {
  const [Token, setToken] = useState(null);
  const [adminURLsAndEmail, setAdminURLsAndEmail] = useState(null);
  const [habitList, setHabitList] = useState([]);
  const [progress, setProgress] = useState([]);
  const [quotesDownloading, setQuotesDownloading] = useState([]);
  const [progressAudioNote, setProgressAudioNote] = useState([]);
  const [purchases, setPurchases] = useState({
    habit: false,
    meditation: false,
    skus: [],
  });

  const [gratitudesList, setGratitudesList] = useState([]);
  const updateGratitudeList = updation => setGratitudesList([updation, ...gratitudesList]);
  const [gratitudeExist, setGratitudeExist] = useState();
  const [allGratitudesList, setAllGratitudesList] = useState([]);


  const [allMoodJournals, setAllMoodJournals] = useState([]);
  const updateAllMoodJournals = updation => setAllMoodJournals([updation, ...allMoodJournals]);


  const [dashboardData, setDashBoardData] = useState({
    meditationOfTheDay: {},
    quoteOfTheDay: {},
    habitStats: {},
    notes: [],
  })

  const [notesList, setNotesList] = useState([]);

  const [badgeCount, setBadgeCount] = useState(0);

  const checkPermissions = async () => {
    let granted;

    if (Platform.OS == 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //   title: 'Storage Permissions',
        //   message: 'App needs access to access your storage ',
        //   buttonNeutral: 'Ask Me Later',
        //   buttonNegative: 'Cancel',
        //   buttonPositive: 'OK',
        // },
      );
      if (granted == 'granted') {
        return true;
      } else {
        showToast(
          'Please allow storage permission from settings',
          'Permission denied',
        );
        return false;
      }
    } else {
      return true;
    }
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //   {
    //     title: 'Storage Permission Required',
    //     message: 'App needs access to your storage to download Photos',
    //   },
    // );
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   // Once user grant the permission start downloading
    //   return true;
    // } else {
    //   showToast('Storage Permission Not Granted', 'Alert');
    //   return false;
    // }
  };

  const findProgress = item => {
    let freq = [];
    item.frequency.filter((x, i) => {
      if (x.status == true) {
        freq.push(x.day);
      }
    });
    let count = 0;
    item.notes.map((x, i) => {
      if (freq.includes(moment(x.date).format('dddd').toLowerCase())) {
        count = count + 1;
      }
    });
    return count;
  };

  let completed = 0;
  habitList.map((x, i) => {
    if (x.total_days != 0) {
      if (findProgress(x) / x.total_days == 1) {
        completed = completed + 1;
      }
    }
  });

  // Tracks download functions
  const downloadTrack = async (track, cat) => {
    let granted = await checkPermissions();
    if (!granted) {
      return;
    }
    let obj = { ...track };
    addInProgress(obj._id);
    try {
      if (!(await RNFS.exists(RNFS.DocumentDirectoryPath + '/tracks/'))) {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/tracks/');
      }

      let splitfile = await obj?.audio.split('/');
      let path =
        RNFS.DocumentDirectoryPath +
        '/tracks/' +
        splitfile[splitfile.length - 1];
      console.log('path: ' + path);
      try {
        return RNFS.downloadFile({
          fromUrl: fileURL + obj?.audio,
          toFile: path,
        })
          .promise.then(async res => {
            console.log('audioDownloaded:', res);

            if (!(await RNFS.exists(RNFS.DocumentDirectoryPath + '/images/'))) {
              await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/images/');
            }
            let imageSplit = await obj?.audio.split('/');
            let imagePath =
              RNFS.DocumentDirectoryPath +
              '/images/' +
              imageSplit[imageSplit.length - 1];

            try {
              return RNFS.downloadFile({
                fromUrl: fileURL + obj?.images?.large,
                toFile: imagePath,
              })
                .promise.then(async res1 => {
                  console.log('imageDownloaded:', res1);
                  return await AsyncStorage.getItem('@tracks')
                    .then(async val => {
                      let newObj = {
                        ...obj,
                        mp3: 'file://' + path,
                        category: cat,
                        images: {
                          large: 'file://' + imagePath,
                          medium: 'file://' + imagePath,
                          small: 'file://' + imagePath,
                        },
                      };

                      if (val != null) {
                        let array = JSON.parse(val);
                        array.unshift(newObj);
                        await AsyncStorage.setItem(
                          '@tracks',
                          JSON.stringify(array),
                        );
                      } else {
                        let array = [];
                        array.push(newObj);
                        await AsyncStorage.setItem(
                          '@tracks',
                          JSON.stringify(array),
                        );
                      }
                      removeFromProgress(obj._id);
                      PushNotification.localNotification({
                        channelId: '6007',
                        title: 'Download Complete',
                        message: 'Your track has been successfully downloaded',
                        userInfo: {
                          id: obj._id,
                          type: 'track_download',
                        },
                        smallIcon: 'ic_stat_name',
                      });

                      return true;
                    })
                    .catch(e => {
                      removeFromProgress(obj._id);
                      console.log('async', e);
                    });
                })
                .catch(e => {
                  removeFromProgress(obj._id);
                  console.log('Axios error', e);
                });
            } catch (e) {
              removeFromProgress(obj._id);
              showToast('No internet connection', 'Error');
            }
          })
          .catch(e => {
            removeFromProgress(obj._id);
            console.log('Axios error', e);
          });
      } catch (e) {
        removeFromProgress(obj._id);
        showToast('No internet connection', 'Error');
      }
    } catch (e) {
      removeFromProgress(obj._id);
    }
  };

  const checkAudioNoteStatus = async audio => {
    let splitfile = audio.split('/');
    if (
      await RNFS.exists(
        RNFS.DocumentDirectoryPath +
        '/Audio Note/' +
        splitfile[splitfile.length - 1],
      )
    ) {
      return 0;
    } else if (progressAudioNote.includes(splitfile[splitfile.length - 1])) {
      return 1;
    } else {
      return 2;
    }
  };

  const downloadAudioNote = async audio => {
    let granted = await checkPermissions();
    console.log(granted, 'granted');
    if (!granted) {
      return 'error';
    }
    try {
      let splitfile = await audio.split('/');
      if (
        await RNFS.exists(
          RNFS.DocumentDirectoryPath +
          '/Note/' +
          splitfile[splitfile.length - 1],
        )
      ) {
        return (
          RNFS.DocumentDirectoryPath +
          '/Note/' +
          splitfile[splitfile.length - 1]
        );
      }
      setProgressAudioNote(splitfile[splitfile.length - 1]);
      if (
        !(await RNFS.exists(
          RNFS.DocumentDirectoryPath +
          '/Note/' +
          splitfile[splitfile.length - 1],
        ))
      ) {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Note/');
      }

      let path =
        RNFS.DocumentDirectoryPath + '/Note/' + splitfile[splitfile.length - 1];
      console.log('path: ' + path);
      return RNFS.downloadFile({
        fromUrl: fileURL + audio,
        toFile: path,
      })
        .promise.then(async res => {
          removeFromProgressAudioNote(splitfile[splitfile.length - 1]);
          console.log('audioDownloaded:', res);
          return (
            RNFS.DocumentDirectoryPath +
            '/Note/' +
            splitfile[splitfile.length - 1]
          );
        })
        .catch(e => {
          removeFromProgressAudioNote(splitfile[splitfile.length - 1]);
          console.log('Axios error', e);
        });
    } catch (e) {
      removeFromProgressAudioNote(splitfile[splitfile.length - 1]);
    }
  };

  const downloadQuote = async (image, id) => {
    let granted = await checkPermissions();
    if (!granted) {
      return;
    }
    let imgUrl = fileURL + image;
    let ext = imgUrl.split('.').pop();
    let imageName = '/image-' + moment().valueOf();
    let dirs = ReactNativeBlobUtil.fs.dirs;
    let ext1 = ext;
    if (ext1 == 'jpg') {
      ext1 = 'jpeg';
    }
    console.log(dirs, 'directories...');
    // return;
    let path = dirs.CacheDir + imageName + '.' + ext1;

    if (Platform.OS == 'android') {
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: ext1,
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
      })
        .fetch('GET', imgUrl)
        .then(async res => {
          console.log(res.path(), 'end downloaded');

          // if (!!dirs.LegacyDownloadDir == false) {
          //   let pathnew =
          //     await ReactNativeBlobUtil.MediaCollection.createMediafile(
          //       {
          //         name: imageName,
          //         parentFolder: 'Better.Me',
          //         mimeType: `image/${ext1}`,
          //       },
          //       'Download',
          //     );
          //   console.log('pathnew', pathnew);
          //   let res1 =
          //     await ReactNativeBlobUtil.MediaCollection.writeToMediafile(
          //       pathnew,
          //       res.path(),
          //     );
          //   let ok = await ReactNativeBlobUtil.fs.unlink(path);
          //   // console.log('ok', ok);
          // }
          try {
            await CameraRoll.save('file://' + res.path(), {
              type: 'photo',
              album: 'Better.Me',
            });
          } catch (e) {
            console.log(e, 'camera roll failed');
          }
          showToast(
            'Quote has been saved to your storage',
            'Quote Downloaded',
            'success',
          );
        })
        .catch(e => {
          console.log('download failed', e);

          showToast('Quote downloading failed', 'Something went wrong');
        });
    } else {
      try {
        CameraRoll.save(imgUrl);

        showToast(
          'Quote has been saved to your storage',
          'Quote Downloaded',
          'success',
        );
      } catch (e) {
        showToast('Quote downloading failed', 'Something went wrong');
      }
    }
  };

  const deleteTrack = async id => {
    try {
      let res = await AsyncStorage.getItem('@tracks');
      if (res != null) {
        let list = JSON.parse(res);
        let track = await list.find(x => x._id == id);
        if (!!track) {
          let trackPathArr = track?.mp3.split('file://');
          let trackPath = trackPathArr[trackPathArr.length - 1];
          let imgPathArr = track?.images?.large.split('file://');
          let imgPath = imgPathArr[imgPathArr.length - 1];

          try {
            await RNFS.unlink(trackPath);
            await RNFS.unlink(imgPath);
            let index = await list.findIndex(x => x._id == id);
            console.log('index', index);
            if (index > -1) {
              list.splice(index, 1);
              await AsyncStorage.setItem('@tracks', JSON.stringify(list));
              console.log('unlink sucess');
              return false;
            }
            return true;
          } catch (e) {
            let index = await list.findIndex(x => x._id == id);
            console.log('index', index);
            if (index > -1) {
              list.splice(index, 1);
              try {
                await AsyncStorage.setItem('@tracks', JSON.stringify(list));

                return false;
              } catch (e) {
                return true;
              }
            }
            return true;
          }
        }
      }
    } catch (e) {
      console.log('track delete', e);
      showToast('Something went wrong', 'Error');
    }
  };

  const removeFromProgress = _id => {
    let newProgress = [...progress];
    let index = newProgress.findIndex(x => x._id == _id);
    newProgress.splice(index, 1);
    setProgress(newProgress);
  };

  const addInProgress = _id => {
    let newProgress = [...progress];
    newProgress.push({ _id: _id, progress: '0' });
    setProgress(newProgress);
  };

  const removeFromProgressAudioNote = name => {
    let newProgress = [...progress];
    let index = newProgress.findIndex(x => x == name);
    newProgress.splice(index, 1);
    setProgress(newProgress);
  };

  const addInProgressAudioNote = name => {
    let newProgress = [...progress];
    newProgress.push(name);
    setProgress(newProgress);
  };

  const api_getAdminURLAndEmail = async () => {
    let res = await invokeApi({
      path: 'api/website_setting/get_user_website_setting',
    });
    if (res) {
      if (res.code == 200) {
        setAdminURLsAndEmail(res.setting);
      }
    }
  };

  const CheckPurchases = async () => {
    let p = await RNIap.getAvailablePurchases();
    console.log('getAvailablePurchases', p);
    let arr = [];
    let habit_flag = false;
    let meditation_flag = false;
    p.forEach(x => {
      arr.push(x.productId);
      if (
        x.productId == 'habits.monthly.subscription' ||
        x.productId == 'all_in_one.monthly.subscription' ||
        x.productId == 'lifetime.purchase'
      ) {
        habit_flag = true;
      }
      if (
        x.productId == 'meditation.monthly.subscription' ||
        x.productId == 'all_in_one.monthly.subscription' ||
        x.productId == 'lifetime.purchase'
      ) {
        meditation_flag = true;
      }
    });

    setPurchases({
      habit: habit_flag,
      meditation: meditation_flag,
      skus: arr,
    });
    return;
  };

  const resetPurchase = () => {
    setPurchases({
      habit: false,
      meditation: false,
      skus: [],
    });
  };

  useEffect(() => {
    if (Token) {
      console.log('CheckPurchases');
      CheckPurchases();
    } else {
      console.log('resetPurchase');
      resetPurchase();
    }
    return () => { };
  }, [Token]);

  useEffect(() => {
    getNotificationCount()
    api_getAdminURLAndEmail();
    return () => {
      setHabitList([]);
    };
  }, []);

  const getNotificationCount = async () => {
    return await AsyncStorage.getItem('@badgeCount').then(val => {
      if (val !== null) {
        console.log(val, "bell icon BadgeCount ...")
        setBadgeCount(val);
      }
    })
  }

  const getBadgeCount = async (data) => {
    if (data.type == "quotes") {
      console.log("notification in context...")
      let count = parseInt(await AsyncStorage.getItem('@badgeCount'))
      if (count != null) {
        count = count + 1;
        setBadgeCount(count)
        await AsyncStorage.setItem('@badgeCount', JSON.stringify(count));
      } else {
        setBadgeCount(1)
        await AsyncStorage.setItem('@badgeCount', '1');
      }
    }
  }

  const onMessageReceived = async remoteMessage => {
    console.log(remoteMessage, 'message recieve ...');
    getBadgeCount(remoteMessage.data)
  }

  messaging().onMessage(onMessageReceived);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage, 'onMessage Background state...');
    getBadgeCount(remoteMessage.data)
  });

  const object = {
    Token,
    setToken,
    habitList,
    downloadTrack,
    progress,
    deleteTrack,
    setHabitList,
    completed,
    downloadQuote,
    isMeditationPurchased: purchases?.meditation,
    isHabitPurchased: purchases?.habit,
    purchasedSKUs: purchases?.skus,
    CheckPurchases,
    adminURLsAndEmail,
    resetPurchase,
    downloadAudioNote,
    checkAudioNoteStatus,
    gratitudesList,
    setGratitudesList,
    updateGratitudeList,
    gratitudeExist,
    setGratitudeExist,
    allMoodJournals,
    setAllMoodJournals,
    updateAllMoodJournals,
    allGratitudesList,
    setAllGratitudesList,
    dashboardData,
    setDashBoardData,
    badgeCount, setBadgeCount,
    notesList, setNotesList
  };

  return (
    <>
      <ContextProvider value={object}>{props.children}</ContextProvider>
    </>
  );
};

export default ContextWrapper;
