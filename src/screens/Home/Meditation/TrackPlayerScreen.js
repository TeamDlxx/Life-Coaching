import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  Text,
  Pressable,
  ImageBackground,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import TrackPlayer from 'react-native-track-player';
import ProgressBar from '../../../Components/ProgreeBar';
import {State} from 'react-native-track-player';

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import Toast from 'react-native-simple-toast';

//Icons

import favIcon from '../../../Assets/TrackPlayer/favIcon.png';
import nextTrack from '../../../Assets/TrackPlayer/nextTrack.png';
import previousTrack from '../../../Assets/TrackPlayer/previousTrack.png';
import pauseTrack from '../../../Assets/TrackPlayer/pauseTrack.png';
import playTrack from '../../../Assets/TrackPlayer/playTrack.png';
import ic_repeat from '../../../Assets/TrackPlayer/repeat.png';
import ic_download from '../../../Assets/TrackPlayer/ic_download3.png';
import ic_share from '../../../Assets/TrackPlayer/share.png';
import {_styleTrackPlayer} from '../../../Utilities/styles';

const TrackPlayerScreen = props => {
  const {navigation} = props;
  const {params} = props?.route;
  const {Token} = useContext(Context);
  const [tracksList, setTrackList] = useState(params?.list);
  const [trackItem, setTrackItem] = useState(params?.item);
  const [playIcon, setPlayIcon] = useState(pauseTrack);
  const [repeat, setRepeat] = useState(false);
  const [DefaultImage, setDefaultImage] = useState(false);
  const [loading, setloading] = useState(true);
  const [isfav, setIsfav] = useState(params?.item?.is_favourite);
  //? Views

  const moveTo = async val => {
    TrackPlayer.seekTo(val);
    setPlayIcon(pauseTrack);
    // await TrackPlayer.play();
  };

  const changeTrack = action => {
    let curIndex = tracksList.findIndex(x => x._id == trackItem._id);
    if (curIndex > -1) {
      let newIndex = curIndex + action;
      if (tracksList[newIndex]) {
        setTrackItem(tracksList[newIndex]);
        setIsfav(tracksList[newIndex]?.is_favourite);
        setloading(true);
      }
    }
  };

  const toggleRepeat = () => {
    let val = !repeat;
    setRepeat(val);
  };

  const LoadtheTrack = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: trackItem._id,
      url: fileURL + trackItem?.audio,
      title: trackItem?.name,
      artist: params?.category,
      album: '',
      genre: '',
      artwork: fileURL + trackItem?.images?.small,
      duration: Math.ceil(trackItem?.duration),
    });
    // await TrackPlayer.updateOptions({
    //   stoppingAppPausesPlayback: true,

    // });
    await TrackPlayer.play();
    // setPlayIcon(pauseTrack);
  };

  const checkNextAndPreviosAvailable = (id, type) => {
    let curIndex = tracksList.findIndex(x => x._id == id);

    if (curIndex != -1) {
      if (type == 'next') {
        if (tracksList[curIndex + 1]) {
          return true;
        } else {
          return false;
        }
      }
      if (type == 'prev') {
        if (tracksList[curIndex - 1]) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  useEffect(() => {
    LoadtheTrack();
  }, [trackItem]);

  useEffect(() => {
    console.log('state', State);
    TrackPlayer.addEventListener('playback-state', ({state}) => {
      console.log('state: ', state);
      if (state == 'ready' || state == 'playing' || state == 2) {
        setloading(false);
      }
    });
    return () => {
      console.log('return');
      TrackPlayer.reset();
    };
  }, []);

  const changeStatus = async () => {
    if (playIcon == playTrack) {
      TrackPlayer.play();
      setPlayIcon(pauseTrack);
    } else {
      TrackPlayer.pause();
      setPlayIcon(playTrack);
    }
  };

  const resetTheTrack = async () => {
    await TrackPlayer.seekTo(0);
    if (repeat) {
      await TrackPlayer.play();
      setPlayIcon(pauseTrack);
    } else {
      await TrackPlayer.pause();
      setPlayIcon(playTrack);
    }
  };

  const goBack = () => {
    TrackPlayer.reset();
    props.navigation.goBack();
  };

  const togglelike = async (id, val) => {
    setIsfav(val);
    let newArray = [...tracksList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      let obj = {
        ...newArray[index],
        is_favourite: val,
      };
      newArray.splice(index, 1, obj);
      setTrackList([...newArray]);
    }
  };

  const api_likeUnLike = async (val, id) => {
    if (!!params?.likeUnLikeFunc) {
      params?.likeUnLikeFunc(id, val);
    }

    if (!!params?.unLike && val == false) {
      params?.unLike(id);
    }
    togglelike(id, val);
    let res = await invokeApi({
      path: 'api/track/favourite_track/' + id,
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: {
        favourite: val,
      },
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        console.log('response', res);
      } else {
        console.log('blah blah');
        if (!!params?.likeUnLikeFunc) {
          params?.likeUnLikeFunc(id, !val);
        }
        togglelike(id, !val);
        showToast(res.message);
      }
    }
  };

  //? Main render View............
  return (
    <View style={_styleTrackPlayer.rootView}>
      <View style={_styleTrackPlayer.posterView}>
        <ImageBackground
          onLoadStart={() => {
            setDefaultImage(true);
          }}
          onLoad={end => {
            setDefaultImage(false);
          }}
          onError={e => {
            console.log('Error', e);
          }}
          style={_styleTrackPlayer.posterImageView}
          resizeMode="stretch"
          source={{uri: fileURL + trackItem?.images?.large}}>
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
            {DefaultImage && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: -40,
                  zIndex: -1,
                }}>
                <Image
                  style={{height: 100, width: 100, tintColor: Colors.gray05}}
                  source={require('../../../Assets/Icons/ic_music.png')}
                />
              </View>
            )}
          </SafeAreaView>
        </ImageBackground>
      </View>
      <View style={_styleTrackPlayer.controlsAndTextView}>
        <View style={_styleTrackPlayer.TextView}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginRight: -20,
            }}>
            <Pressable style={_styleTrackPlayer.favButtonView}>
              <Image
                style={[
                  _styleTrackPlayer.favButtonIcon,
                  {
                    tintColor: Colors.primary,
                  },
                ]}
                source={ic_download}
              />
            </Pressable>
            <Pressable style={_styleTrackPlayer.favButtonView}>
              <Image
                style={[
                  _styleTrackPlayer.favButtonIcon,
                  {
                    tintColor: Colors.primary,
                  },
                ]}
                source={ic_share}
              />
            </Pressable>
          </View>
          <Text style={_styleTrackPlayer.trackName}>{trackItem.name}</Text>
          <Text style={_styleTrackPlayer.trackCategory}>
            {params?.from == 'fav'
              ? trackItem?.category_id[0]?._id?.name
              : params?.category}
          </Text>
          <Text numberOfLines={4} style={_styleTrackPlayer.trackDescription}>
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
            <Pressable
              onPress={toggleRepeat}
              style={_styleTrackPlayer.sideButtons}>
              <Image
                style={[
                  _styleTrackPlayer.previosAndNextButtonIcon,
                  {tintColor: repeat ? Colors.primary : Colors.gray05},
                ]}
                source={ic_repeat}
              />
            </Pressable>
            <Pressable
              disabled={!checkNextAndPreviosAvailable(trackItem._id, 'prev')}
              onPress={() => changeTrack(-1)}
              style={_styleTrackPlayer.previosAndNextButtonView}>
              <Image
                style={[
                  _styleTrackPlayer.previosAndNextButtonIcon,
                  !checkNextAndPreviosAvailable(trackItem._id, 'prev') && {
                    tintColor: Colors.gray05,
                  },
                ]}
                source={previousTrack}
              />
            </Pressable>

            <View style={_styleTrackPlayer.playPauseButtonView}>
              <Pressable
                disabled={loading}
                onPress={changeStatus}
                style={_styleTrackPlayer.playPauseButtonInnerView}>
                {loading ? (
                  <ActivityIndicator color={'#fff'} size={'small'} />
                ) : (
                  <Image
                    style={_styleTrackPlayer.playPauseButtonIcon}
                    source={playIcon}
                  />
                )}
              </Pressable>
            </View>

            <Pressable
              disabled={!checkNextAndPreviosAvailable(trackItem._id, 'next')}
              onPress={() => changeTrack(+1)}
              style={_styleTrackPlayer.previosAndNextButtonView}>
              <Image
                style={[
                  _styleTrackPlayer.previosAndNextButtonIcon,
                  !checkNextAndPreviosAvailable(trackItem._id, 'next') && {
                    tintColor: Colors.gray05,
                  },
                ]}
                source={nextTrack}
              />
            </Pressable>
            <Pressable
              onPress={() => api_likeUnLike(!isfav, trackItem?._id)}
              style={_styleTrackPlayer.sideButtons}>
              <Image
                style={[
                  _styleTrackPlayer.favButtonIcon,
                  {
                    tintColor: isfav ? Colors.primary : Colors.gray05,
                  },
                ]}
                source={favIcon}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackPlayerScreen;
