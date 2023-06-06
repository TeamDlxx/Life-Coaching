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
} from 'react-native';
import CustomImage from '../../../Components/CustomImage';
import CustomAlert from '../../../Components/CusromAlert';
import {mainStyles} from '../../../Utilities/styles';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import showToast from '../../../functions/showToast';
import {fileURL} from '../../../Utilities/domains';
import formatTime from '../../../functions/formatTime';
import {useContext} from 'react';
import Context from '../../../Context';
import invokeApi from '../../../functions/invokeAPI';
import play from '../../../Assets/Icons/play.png';
import Loader from '../../../Components/Loader';
import ic_lock from '../../../Assets/Icons/locked.png';


const PlaylistDetailScreen = props => {
  const {params} = props.route;
  const {Token} = useContext(Context);
  const screen = Dimensions.get('screen');
  const EditMenu = useRef();
  const [playlist , setPlaylist] = useState({
    title: '',
    tracks: [],
    id: ''
  })
  const [isLoading, setisLoading] = useState(false);
  const [alertVisibility, setAlertVisibility] = useState(false);


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (Token) {
        getPlaylistDetailApi();
      }
    });
    return () => {
      unsubscribe;
    };
  }, [Token, props.navigation]);


  const backdropPressed = () => {
    setAlertVisibility(false);
  }

  const goToAddTracksScreen = () => {
    props.navigation.navigate(screens.addPlaylistTracks, {
      playListID: playlist?.id,
      playlistTracks: playlist?.tracks,
    });
  } 

  const getPlaylistDetailApi = async () => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/playlist/playlist_detail_with_tracks/' + params?.playlist?._id,
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        await setPlaylist({
          title: res?.playlists?.title,
          tracks: res?.playlists?.tracks,
          id: res?.playlists?._id,
        })
        if(params?.updateTracks){
          params?.updateTracks(params?.playlist , res?.playlists?.tracks)
        }
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

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
           goToAddTracksScreen();
          }}>
          <Text style={{fontFamily: font.bold}}>Add Songs</Text>
        </MenuItem>
      </Menu>
    );
  };

  const chooseScreenOnPurchasesAndLockedTrack = trackLockedOrNot => {
    if (trackLockedOrNot == true && isMeditationPurchased == false) {
      return true;
    } else {
      return false;
    }
  };

  const gotoTrackPlayer = (item, index) => {
    if (!chooseScreenOnPurchasesAndLockedTrack(item.is_locked)) {
      let list = [];
      list = playlist.tracks;
  
      props.navigation.navigate(screens.trackPlayer, {
        item: item,
        isComingFrom: 'playlist',
        list: list,
        // likeUnLikeFunc: likeUnLikeLocally,
      });
    }
    else {
      setAlertVisibility(true)
    }
  };

  const buyOfferScreen = async () => {
    await setAlertVisibility(false)
    props.navigation.navigate(screens.allPackages, {
      from: 'meditation',
    });
  }

  const renderTrackList = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
            gotoTrackPlayer(item, index);
        }}
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
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header navigation={props.navigation} menu={dropDownMenu} />

      <ScrollView style={mainStyles.innerView}>
        <View style={{flex: 1}}>
         {!isLoading && <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Colors.gray02,
              padding: 15,
              marginTop: '25%',
              marginHorizontal: 10,
            }}>
            <View
              style={{
                width: screen.width / 3,
                aspectRatio: 1,
                borderRadius: 20,
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                borderWidth: 1,
                borderColor: Colors.gray02,
                elevation: 5,
                marginTop: -screen.width / 5,
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../Assets/TrackPlayer/playlist.png')}
                style={{
                  width: 50,
                  height: 50,
                  aspectRatio: 1,
                  tintColor: Colors.disable,
                }}
                resizeMode="cover"
              />
            </View>

            <View style={{marginTop: 25}}>
              <Text style={playlistDetailsStyle.lable}>Title </Text>
              <Text style={[playlistDetailsStyle.detailText, {fontSize: 18}]}>
                {playlist?.title}
              </Text>
            </View>

            <View style={{marginTop: 10}}>
              <Text style={playlistDetailsStyle.lable}>Tracks </Text>
              <Text style={playlistDetailsStyle.description}>
                {playlist?.tracks.length}
                <Text>{' Tracks '}</Text>
              </Text>
            </View>

            <View style={{marginTop: 10}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingVertical: 10}}
                data={playlist.tracks}
                renderItem={renderTrackList}
                keyExtractor={item => {
                  return item._id;
                }}
                ListEmptyComponent={() =>
                  playlist.tracks.length == 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        aspectRatio: 1,
                      }}>
                      <Image
                        source={require('../../../Assets/TrackPlayer/track.png')}
                        style={{
                          marginTop: 30,
                          width: 60,
                          height: 60,
                          tintColor: Colors.primary3,
                        }}
                      />

                      <Text
                        style={{
                          marginTop: 10,
                          fontFamily: font.medium,
                          fontSize: 13,
                          color: Colors.text,
                        }}>
                        No results
                      </Text>

                      <Pressable
                        onPress={() => {goToAddTracksScreen()}}>
                        <Text
                          style={{
                            marginTop: 10,
                            color: Colors.primary,
                            fontFamily: font.bold,
                            fontSize: 15,
                            letterSpacing: 0.7,
                          }}>
                          Add Tracks{'  '}
                        </Text>
                      </Pressable>
                    </View>
                  )
                }
              />
            </View>
          </View>}

          <View>
          <CustomAlert
            visible={alertVisibility}
            backdropPressed={backdropPressed}
            buyOfferScreen={buyOfferScreen}
            // showAd={showAd}
          />
        </View>

        </View>
      </ScrollView>

      <Loader enable={isLoading} />
    </SafeAreaView>
  );
};

export default PlaylistDetailScreen;

const playlistDetailsStyle = StyleSheet.create({
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
