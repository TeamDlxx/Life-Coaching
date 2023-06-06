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
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import SwipeableFlatList from 'react-native-swipeable-list';
import {CustomSimpleTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
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

let loadMoreURL = '';
let canLoadMore = false;

const PlaylistScreen = props => {
  const win = Dimensions.get('window');
  const {Token, isMeditationPurchased} = useContext(Context);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [addTracks, setAddTracks] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [listItem, setItem] = useState({
    name: '',
    id: '',
  });
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [isLoadingMore, setisLoadingMore] = useState(false);

  useEffect(() => {
    if (Token) {
      getAllPlaylistApi();
    } else {
      setAllPlaylists([]);
    }
  }, []);

  const createPlaylist = async () => {
      if (allPlaylists.length < 2  || isMeditationPurchased == true) {
        setError(false);
        setTitle('');
        setItem({name: '', id: ''});
        setModalVisibility(true);
      } else {
        props.navigation.navigate(screens.allPackages, {
          from: 'meditation',
        });
      }
  };

  const getAllPlaylistApi = async () => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/playlist/get_playlists',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        let playlists = res?.playlists;
        await setAllPlaylists(playlists);
        let count = allPlaylists.length + res?.playlists.length;
        if (res.count > count) {
          loadMoreURL = res.load_more_url;
          canLoadMore = true;
          console.log(loadMoreURL, 'LoadMoreURL ...');
        } else {
          canLoadMore = false;
        }
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

  const loadMorePlaylistApi = async () => {
    setisLoadingMore(true);
    let res = await invokeApi({
      path: 'api' + loadMoreURL,
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        let playlists = res?.playlists;
        await setAllPlaylists([...allPlaylists, ...playlists]);
        let count = allPlaylists.length + res?.playlists.length;
        if (res.count > count) {
          loadMoreURL = res.load_more_url;
          canLoadMore = true;
          console.log(loadMoreURL, 'LoadMoreURL ...');
        } else {
          canLoadMore = false;
        }
      }
    } else {
      showToast(res.message);
    }
    setisLoadingMore(false);
  };

  const deletePlaylistApi = async id => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/playlist/delete_playlist/' + id,
      method: 'DELETE',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        await removePlaylistFromList(id);
        showToast(
          'Playlist has been deleted successfully',
          'Playlist deleted',
          'success',
        );
      } else {
        showToast(res.message);
      }
    }
  };

  const removePlaylistFromList = async id => {
    let newArray = [...allPlaylists];
    let index = newArray.findIndex(x => x._id == id);
    newArray.splice(index, 1);
    await setAllPlaylists(newArray);
  };

  const addPlaylistApi = async fdata => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/playlist/add_playlist',
      method: 'POST',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        await setAllPlaylists([res?.playlist, ...allPlaylists]);
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

  const addToPlaylist = async () => {
    let name = title.trim();
    if (name == '') {
      setError(true);
    } else {
      let fdPlaylist = new FormData();
      fdPlaylist.append('title', name);
      setError(false);
      setModalVisibility(false);
      addPlaylistApi(fdPlaylist);
    }
  };

  const editPlaylist = async id => {
    let name = title.trim();
    if (name == '') {
      setError(true);
    } else {
      let fdPlaylist = new FormData();
      fdPlaylist.append('title', name);
      setError(false);
      setModalVisibility(false);
      editPlaylistApi(fdPlaylist, id);
    }
  };

  const editPlaylistApi = async (fdata, id) => {
    setisLoading(true);
    console.log(id, 'hgfhj....');
    let res = await invokeApi({
      path: 'api/playlist/edit_playlist/' + id,
      method: 'PUT',
      postData: fdata,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        updatePlaylist(res?.playlist);
        showToast(
          'Playlist has been updated successfully',
          'Playlist Updated',
          'success',
        );
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

  const updatePlaylist = async item => {
    let newArray = [...allPlaylists];
    let index = newArray.findIndex(x => x._id == item._id);
    if (index != -1) {
      newArray.splice(index, 1, item);
      await setAllPlaylists(newArray);
    }
  };

  const updatePlayListTracks = async (listItem , list) => {
    let tempArray = [];
    for(let i=0; i< list.length ; i++){
      tempArray.push(list[i]._id)
    }

    let newArray = [...allPlaylists];
    let idx = newArray.findIndex(item => item == listItem)
    if(idx != -1){
      allPlaylists[idx].tracks = tempArray
      await setAllPlaylists([...allPlaylists])
    }

  }

  const renderAllPlatlist = ({item, index}) => {
    return (
      <View>
        <Pressable
          onPress={() => {
            props.navigation.navigate(screens.playlistsDetails, {
              playlist: item,
              updateTracks: updatePlayListTracks
            });
          }}
          style={{
            overflow: 'hidden',
            borderColor: Colors.gray02,
            borderWidth: 1,
            backgroundColor: Colors.white,
            borderRadius: 18,
            paddingHorizontal: 10,
            paddingVertical: 9,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: Colors.primary,
            }}>
            <Image
              source={require('../../../Assets/TrackPlayer/playlist.png')}
              style={{height: 16, width: 16, tintColor: Colors.white}}
            />
          </View>

          <View style={{marginLeft: 12.5, flex: 1}}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                color: Colors.black,
                fontFamily: font.bold,
                letterSpacing: 0.5,
                fontSize: 13,
              }}>
              {item.title}
            </Text>

            <Text
              style={{
                fontFamily: font.medium,
                color: Colors.text,
                fontSize: 12,
                lineHeight: 18,
              }}>
              {item.tracks.length}
              <Text>{' Tracks '}</Text>
            </Text>
          </View>

          <Pressable
            onPress={() => {}}
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: 10,
            }}>
            <Image
              source={require('../../../Assets/Icons/right_arrow.png')}
              style={{height: 12, width: 12, tintColor: Colors.text}}
            />
          </Pressable>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header navigation={props.navigation} title={'Playlists'} />

      <View style={mainStyles.innerView}>
        <View style={{flex: 1}}>
          <SwipeableFlatList
            contentContainerStyle={{paddingVertical: 10}}
            showsVerticalScrollIndicator={false}
            data={allPlaylists}
            renderItem={renderAllPlatlist}
            shouldBounceOnMount={true}
            maxSwipeDistance={120}
            keyExtractor={item => {
              return item._id;
            }}
            renderQuickActions={({item, index}) => {
              return (
                <View
                  style={[playlistStyle.hiddenView, {flexDirection: 'row'}]}>
                  <Pressable
                    style={{
                      width: 65,
                      height: '100%',
                      backgroundColor: '#ffa700',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setTitle(item?.title);
                      setItem({name: item?.title, id: item?._id});
                      setModalVisibility(true);
                    }}>
                    <Image
                      source={require('../../../Assets/Icons/edit.png')}
                      style={playlistStyle.hiddenIcon}
                    />
                  </Pressable>

                  <Pressable
                    style={{
                      width: 55,
                      height: '100%',
                      backgroundColor: Colors.delete,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      Alert.alert(
                        'Delete Playlist',
                        'Are you sure you want to delete this Playlist?',
                        [
                          {text: 'No'},
                          {
                            text: 'Yes',
                            onPress: () => {
                              deletePlaylistApi(item._id);
                            },
                          },
                        ],
                        {cancelable: true},
                      )
                    }>
                    <Image
                      source={require('../../../Assets/Icons/trash.png')}
                      style={playlistStyle.hiddenIcon}
                    />
                  </Pressable>
                </View>
              );
            }}
            ListEmptyComponent={() =>
              isLoading == false &&
              allPlaylists.length == 0 && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={require('../../../Assets/TrackPlayer/playlist-empty.png')}
                    style={{
                      marginTop: 30,
                      width: win.width * 0.85,
                      height: win.width * 0.65,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: font.xbold,
                      fontSize: 23,
                      marginTop: 30,
                    }}>
                    No Playlists
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: 15,
                      marginTop: 10,
                      color: Colors.placeHolder,
                      width: '80%',
                      textAlign: 'center',
                    }}>
                    Create a playlist according to your taste and mood!
                  </Text>

                  <View style={{justifyContent: 'center', marginTop: 40}}>
                    <Pressable
                      onPress={createPlaylist}
                      style={[
                        FAB_style.View,
                        {
                          position: 'relative',
                          right: 0,
                          height: 55,
                          width: 55,
                          borderRadius: 55 / 2,
                        },
                      ]}>
                      <Image
                        source={require('../../../Assets/Icons/plus.png')}
                        style={FAB_style.image}
                      />
                    </Pressable>
                  </View>
                </View>
              )
            }
            onEndReached={canLoadMore && loadMorePlaylistApi}
            ListFooterComponent={
              isLoadingMore && (
                <View style={{height: 100, justifyContent: 'center'}}>
                  <ActivityIndicator color={Colors.primary} size="small" />
                </View>
              )
            }
          />
        </View>

        {isLoading == false && allPlaylists.length > 0 && (
          <Pressable style={FAB_style.View} onPress={createPlaylist}>
            <Image
              source={require('../../../Assets/Icons/plus.png')}
              style={FAB_style.image}
            />
          </Pressable>
        )}

        <Modal
          isVisible={isModalVisible}
          onBackButtonPress={() => setModalVisibility(false)}
          onBackdropPress={() => setModalVisibility(false)}
          useNativeDriverForBackdrop={true}>
          <View
            style={{
              backgroundColor: '#fff',
              marginHorizontal: 10,
              borderRadius: 10,
              padding: 20,
            }}>
            <CustomSimpleTextInput
              height={45}
              maxLength={40}
              lable={listItem.name ? 'Update playlist' : 'Create new playlist'}
              labelFontSize={15}
              lableColor={Colors.black}
              autoCapitalize={true}
              lableBold={true}
              placeholder={'Enter playlist name'}
              value={title}
              onChangeText={text => setTitle(text)}
            />

            {isError && (
              <>
                <Text
                  style={{
                    marginTop: 10,
                    marginLeft: 5,
                    fontSize: 12,
                    color: 'red',
                  }}>
                  Please enter a playlist name{' '}
                </Text>
              </>
            )}

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View style={{flex: 1}}>
                <CustomButton
                  onPress={() => {
                    setModalVisibility(false);
                  }}
                  title={'Cancel '}
                  textSize={15}
                  textColor={Colors.black}
                  height={40}
                  backgroundColor={Colors.gray02}
                />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <CustomButton
                  onPress={() => {
                    listItem.name ? editPlaylist(listItem.id) : addToPlaylist();
                  }}
                  textSize={15}
                  title={listItem.name ? 'Update ' : 'Add '}
                  height={40}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <Loader enable={isLoading} />
    </SafeAreaView>
  );
};

export default PlaylistScreen;

const playlistStyle = StyleSheet.create({
  hiddenView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    marginHorizontal: 12,
    backgroundColor: Colors.gray03,
    borderRadius: 20,
    marginBottom: 13,
    flex: 1,
    borderColor: Colors.background,
    borderWidth: 1,
  },
  hiddenIcon: {height: 22, width: 22, tintColor: Colors.white},
});
