import React, {useState} from 'react';
import {ContextProvider} from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {fileURL} from '../Utilities/domains';
import RNFS from 'react-native-fs';
import showToast from '../functions/showToast';
const ContextWrapper = props => {
  const [Token, setToken] = useState(null);
  const [habitList, setHabitList] = useState([]);
  const [progress, setProgress] = useState([]);

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

  const object = {
    Token,
    setToken,
    habitList,
    downloadTrack,
    progress,
    deleteTrack,
    setHabitList,
  };

  return (
    <>
      <ContextProvider value={object}>{props.children}</ContextProvider>
    </>
  );
};

export default ContextWrapper;
