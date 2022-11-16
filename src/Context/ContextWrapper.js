import React, {useState, useEffect} from 'react';
import {ContextProvider} from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {fileURL} from '../Utilities/domains';
import RNFS from 'react-native-fs';
import showToast from '../functions/showToast';
import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import axios from 'axios';
import {Platform, PermissionsAndroid, DevSettings} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const ContextWrapper = props => {
  const [Token, setToken] = useState(null);
  const [habitList, setHabitList] = useState([]);
  const [progress, setProgress] = useState([]);

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
    let obj = {...track};
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

  const downloadQuote1 = async image => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download Photos',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        showToast('Storage Permission Not Granted', 'Permission Denied');
        return;
      }
    }
    let dir;
    if (Platform.OS == 'android') {
      dir = RNFS.PicturesDirectoryPath;
    } else {
      dir = RNFS.DocumentDirectoryPath;
    }

    // if (!(await RNFS.exists(dir + '/Lifecoaching/'))) {
    //   await RNFS.mkdir(dir + '/Lifecoaching/');
    // }

    let ext = await image.split('.').pop();
    let imagePath =
      // 'file://' +
      dir + '/quote_' + moment().valueOf() + '.' + ext;
    console.log('imagePath', imagePath);
    try {
      return RNFS.downloadFile({
        fromUrl: fileURL + image,
        toFile: imagePath,
      })
        .promise.then(async res1 => {
          console.log('imageDownloaded:', res1);
          showToast(
            'Quote has been saved to your storage',
            'Quote Downloaded',
            'success',
          );
        })
        .catch(e => {
          console.log('RNFS error', e);
          showToast('', 'Already Downloaded', 'success');
        });
    } catch (e) {
      showToast('No internet connection', 'Error');
    }
  };

  const downloadQuote2 = async image_URL => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download Photos',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        alert('Storage   Not Granted');
        return;
      }
    }
    const {config, fs} = ReactNativeBlobUtil;
    console.log('fs', fs);
    let ext = await image_URL.split('.')[image_URL.split('.').length - 1];
    let PictureDir = fs.dirs.DownloadDir;
    console.log(await fs.isDir(PictureDir), 'Before isDir');

    if (!(await fs.isDir(PictureDir))) {
      await fs.mkdir(PictureDir);
    }
    console.log(await fs.isDir(PictureDir), 'After isDir');
    console.log('ext', ext);
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: PictureDir + '/image_' + moment().valueOf() + '.' + ext,
        description: 'Image',
      },
    };
    let ext1;
    if (ext == 'jpg') {
      ext1 = 'jpeg';
    } else {
      ext1 = ext;
    }
    config(options)
      .fetch('GET', fileURL + image_URL)
      .then(res => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        showToast(
          'Quote has been saved to your storage',
          'Quote Downloaded',
          'success',
        );
      });
  };

  const downloadQuote = async image => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download Photos',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        alert('Storage   Not Granted');
        return;
      }
    }
    console.log('ReactNativeBlobUtil ==>', ReactNativeBlobUtil);
    let imgUrl = fileURL + image;
    console.log(imgUrl, 'imgUrl');
    let newImgUri = imgUrl.lastIndexOf('/');
    let ext = imgUrl.split('.').pop();
    let imageName = '/image_' + imgUrl.split('/').pop();
    console.log('ext', ext);
    console.log('newImgUri', newImgUri);
    console.log('imageName', imageName);
    let dirs = ReactNativeBlobUtil.fs.dirs;
    console.log('dirs ==>', dirs);
    let path =
      Platform.OS === 'ios'
        ? dirs['MainBundleDir'] + imageName
        : dirs.PictureDir + imageName;

    if (Platform.OS == 'android') {
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: ext,
        indicator: true,
        IOSBackgroundTask: true,
        path: path,

        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
          mediaScannable: true,
        },
      })
        .fetch('GET', imgUrl)
        .then(async res => {
          console.log(res, 'end downloaded');
          let pathnew =
            await ReactNativeBlobUtil.MediaCollection.createMediafile(
              {
                name: imageName,
                parentFolder: 'Pictures',
                mimeType: `image/${ext1}`,
              },
              'Download',
            );
          await ReactNativeBlobUtil.MediaCollection.writeToMediafile(
            pathnew,
            res.path(),
          );
          showToast(
            'Quote has been saved to your storage',
            'Quote Downloaded',
            'success',
          );
        });
    } else {
      CameraRoll.save(imgUrl);
      // alert('File saved into gallery.');
      showToast(
        'Quote has been saved to your storage',
        'Quote Downloaded',
        'success',
      );
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
    newProgress.push({_id: _id, progress: '0'});
    setProgress(newProgress);
  };

  useEffect(() => {
    return () => {
      setHabitList([]);
    };
  }, []);

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
  };

  return (
    <>
      <ContextProvider value={object}>{props.children}</ContextProvider>
    </>
  );
};

export default ContextWrapper;
