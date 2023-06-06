import React from 'react';
import {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import SwipeableFlatList from 'react-native-swipeable-list';
import {CustomSimpleTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import CustomImage from '../../../Components/CustomImage';
import {mainStyles, FAB_style} from '../../../Utilities/styles';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import Loader from '../../../Components/Loader';
import LoginAlert from '../../../Components/LoginAlert';
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import formatTime from '../../../functions/formatTime';
import Collapsible from 'react-native-collapsible';
import play from '../../../Assets/Icons/play.png';
const ic_cross = require('../../../Assets/Icons/cross.png');
const ic_search = require('../../../Assets/Icons/search.png');
import ic_lock from '../../../Assets/Icons/locked.png';
import debounnce from '../../../functions/debounce';
import {isMoment} from 'moment';
import {isIphoneX} from 'react-native-iphone-x-helper';

const limit = 15;
let pageNumber = 0;
let canLoadMore = false;

const AddPlaylistTrackScreen = props => {
  const {params} = props.route;
  const win = Dimensions.get('window');
  const {Token, isMeditationPurchased} = useContext(Context);
  const [allTracks, setAllTracks] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const searchTextRef = useRef();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [addedtracks, setAddedTracks] = useState([]);

  useEffect(() => {
    pageNumber = 0;
    canLoadMore = false;
    callTrackListApi();
    checkPreviousTracks();
  }, []);

  const checkPreviousTracks = async () => {
    let tempArr = []
    if (params?.playlistTracks) {
      for (let i = 0; i < params?.playlistTracks.length; i++) {
        tempArr.push(params?.playlistTracks[i]._id);
        console.log(tempArr , "All previous tracks...")
      }
      await setAddedTracks([...tempArr]);

    } else {
      setAddedTracks([]);
    }
  };

  const callTrackListApi = () => {
    setisLoading(true);
    getAllTracksApi({
      playlist_id: params?.playListID,
      search: searchText.trim(),
      is_paid: isMeditationPurchased ? true : false,
    });
  };

  const chooseScreenOnPurchasesAndLockedTrack = trackLockedOrNot => {
    if (trackLockedOrNot == true && isMeditationPurchased == false) {
      return true;
    } else {
      return false;
    }
  };

  const renderTrackList = ({item, index}) => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 15,
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 20,
        }}>
        <View
          style={{
            height: 70,
            width: 70,
            borderRadius: 10,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: Colors.gray02,
          }}>
          <CustomImage
            source={{uri: fileURL + item?.images?.small}}
            style={{height: 70, width: 70}}
            indicatorProps={{color: Colors.primary}}
          />

          <View
            style={{
              position: 'absolute',
              height: 20,
              width: 20,
              backgroundColor: Colors.white,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 999,
              bottom: 5,
              right: 5,
            }}>
            <Image
              style={{height: 12, width: 12, tintColor: Colors.primary}}
              source={play}
            />
          </View>
        </View>
        <View style={{marginLeft: 15, flex: 1}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 14,
              includeFontPadding: false,
              color: Colors.black,
            }}>
            {item?.name}
          </Text>

          <View
            style={{
              marginTop: 3,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: font.medium,
                color: Colors.text,
                fontSize: 12,
              }}>
              {item.description}
            </Text>
          </View>

          <View
            style={{
              marginTop: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: font.medium,
                color: Colors.gray12,
                fontSize: 12,
              }}>
              {formatTime(item.duration)}
            </Text>

            <View style={{marginLeft: 5}}>
              {chooseScreenOnPurchasesAndLockedTrack(item.is_locked) && (
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 3,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={ic_lock}
                    style={{height: 10, width: 10, tintColor: Colors.white}}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <Pressable
          style={{
            height: 30,
            backgroundColor: 'transparent',
            marginLeft: 20,
          }}
          onPress={() => {
            item.already_added == false
              ? addTracks(item._id)
              : removeTracks(item._id);
          }}>
          <Image
            style={{
              height: 20,
              width: 20,
              tintColor:
                item.already_added == false ? Colors.primary : Colors.delete,
            }}
            source={
              item.already_added == false
                ? require('../../../Assets/Icons/add.png')
                : require('../../../Assets/Icons/minus.png')
            }
          />
        </Pressable>
      </View>
    );
  };

  const searchFromAPI = text => {
    setSearchText(text);
    performDebounce(text);
  };

  const performDebounce = debounnce(text => {
    getAllTracksApi({
      playlist_id: params?.playListID,
      search: searchText.trim(),
      is_paid: isMeditationPurchased ? true : false,
    });
  }, 300);

  const getAllTracksApi = async body => {
    let res = await invokeApi({
      path: `api/track/get_all_tracks_for_playlist?page=0&limit=${limit}`,
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        let tracks = res?.tracks;
        setAllTracks(tracks);
        pageNumber = 1;
        if (res.tracks.length < res.count) {
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const getMoreTracksApi = async body => {
    canLoadMore = false;
    let res = await invokeApi({
      path: `api/track/get_all_tracks_for_playlist?page=${pageNumber}&limit=${limit}`,
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoadingMore(false);
    if (res) {
      if (res.code == 200) {
        let total = allTracks.length + res.tracks.length;
        setAllTracks([...allTracks, ...res.tracks]);
        pageNumber++;
        if (total < res.count) {
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const addTracksToPlaylist = async () => {
    let allTracks = addedtracks;
    if (allTracks.length == 0) {
      showToast('Tracks list can not be empty', 'Alert');
    } else {
      await addTracksApi({
        playlist_id: params?.playListID,
        tracks: allTracks,
      });
    }
  };

  const addTracksApi = async body => {
    setisLoading(true);
    let res = await invokeApi({
      path: `api/playlist/add_tack_in_playlist`,
      method: 'PUT',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        props.navigation.goBack();
      } else {
        showToast(res.message);
      }
      setisLoading(false);
    }
  };

  const addTracks = async id => {
    await setAddedTracks([...addedtracks, id]);

    let tempArray = [...allTracks];
    let idx = tempArray.findIndex(x => x._id == id);
    if (idx != -1) {
      tempArray[idx].already_added = true;
      setAllTracks([...tempArray]);
    }

    console.log(addedtracks, 'added tracks...');
  };

  const removeTracks = async id => {
    let temp = [...addedtracks];
    let idx = temp.findIndex(x => x == id);
    temp.splice(idx, 1);
    await setAddedTracks([...temp]);

    let newArray = [...allTracks];
    let index = newArray.findIndex(x => x._id == id);
    if (index != -1) {
      newArray[index].already_added = false;
      setAllTracks([...newArray]);
    }

    console.log(addedtracks, 'removed tracks...');
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header
        navigation={props.navigation}
        title={'Add Tracks'}
        rightIcon={ic_search}
        rightIcononPress={() => {
          if (isSearchVisible) {
            setIsSearchVisible(false);
            searchTextRef?.current?.blur();
          } else {
            setIsSearchVisible(true);
            searchTextRef?.current?.focus();
          }
        }}
      />

      <ScrollView style={mainStyles.innerView}>
        {isLoading == false && (
          <View>
            <Collapsible collapsed={!isSearchVisible}>
              <View
                style={{
                  height: 50,
                  borderRadius: 30,
                  backgroundColor: Colors.gray01,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TextInput
                  ref={searchTextRef}
                  placeholder="Search..."
                  style={{flex: 1, height: '100%', fontSize: 16}}
                  onChangeText={searchFromAPI}
                  value={searchText}
                />
                <Pressable
                  onPress={() => {
                    setIsSearchVisible(false);
                    setSearchText('');
                    searchFromAPI('');
                  }}
                  style={{alignItems: 'center'}}>
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image source={ic_cross} style={{height: 20, width: 20}} />
                  </View>
                </Pressable>
              </View>
            </Collapsible>

            <View style={{marginTop: 10}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingVertical: 10}}
                data={allTracks}
                renderItem={renderTrackList}
                keyExtractor={item => {
                  return item._id;
                }}
                ListEmptyComponent={() =>
                  allTracks.length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        aspectRatio: 1,
                      }}>
                      <Image
                        source={require('../../../Assets/TrackPlayer/playlist.png')}
                        style={{
                          marginTop: 100,
                          width: 50,
                          height: 50,
                          tintColor: Colors.disable,
                        }}
                      />

                      <Text
                        style={{
                          marginTop: 18,
                          fontFamily: font.medium,
                          fontSize: 15,
                          color: Colors.text,
                        }}>
                        No Tracks Found
                      </Text>
                    </View>
                  )
                }
                onEndReached={() => {
                  if (canLoadMore) {
                    setisLoadingMore(true);
                    getMoreTracksApi({
                      search: searchText.trim(),
                      playlist_id: params?.playListID,
                      is_paid: isMeditationPurchased ? true : false,
                    });
                  }
                }}
                ListFooterComponent={
                  isLoadingMore && (
                    <View style={{height: 100, justifyContent: 'center'}}>
                      <ActivityIndicator color={Colors.primary} size="small" />
                    </View>
                  )
                }
              />
            </View>
          </View>
        )}
      </ScrollView>

      {
        <Pressable
          style={{
            height: 50,
            width: 300,
            borderRadius: 18,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? (isIphoneX() ? 30 : 20) : 20,
            elevation: 6,
          }}
          onPress={() => {
            addTracksToPlaylist();
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: 18,
              fontFamily: font.bold,
            }}>
            {'Add Tracks  '}
          </Text>
        </Pressable>
      }
      <Loader enable={isLoading} />
    </SafeAreaView>
  );
};

export default AddPlaylistTrackScreen;

const addTracksStyle = StyleSheet.create({
  lable: {
    fontSize: 12.5,
    fontFamily: font.regular,
    color: Colors.placeHolder,
  },

  description: {
    marginTop: 5,
    fontFamily: font.regular,
    lineHeight: 20.5,
    color: Colors.gray14,
  },

  detailText: {
    fontSize: 14,
    fontFamily: font.bold,
    marginTop: 5,
    color: Colors.black,
  },
});
