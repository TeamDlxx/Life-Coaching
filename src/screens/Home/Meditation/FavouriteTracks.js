import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import CustomImage from '../../../Components/CustomImage';
import formatTime from '../../../functions/formatTime';
import favIcon from '../../../Assets/TrackPlayer/favIcon.png';
import play from '../../../Assets/Icons/play.png';

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const FavouriteTracks = props => {
  const {params} = props.route;
  const {Token} = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [trackList, setTrackList] = useState([]);
  console.log('Params', params);
  //? Navigation Functions

  const gotoTrackPlayer = item => {
    props.navigation.navigate(screens.trackPlayer, {
      item: {
        ...item,
        is_favourite: true,
      },
      category: item?.category_id[0]?._id?.name,
      list: trackList,
      likeUnLikeFunc: params?.likeUnLikeFunc,
      unLike: unLike,
      from: 'fav',
    });
  };

  const unLike = id => {
    let newArray = [...trackList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      newArray.splice(index, 1);
      setTrackList(newArray);
    }
  };

  // todo /////// API's

  const call_favTarackListAPI = () => {
    setisLoading(true);
    api_favTracksList();
  };

  const api_favTracksList = async val => {
    let res = await invokeApi({
      path: 'api/track/get_favourite_tracks',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },

      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        let newArray = [];

        res?.track.map((x, i) => {
          newArray.push({
            ...x,
            is_favourite: true,
          });
        });

        setTrackList(newArray);
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
  };

  const api_likeUnLike = async (val, id) => {
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
        showToast(res.message);
      }
    }
  };

  //* UseEffect

  useEffect(() => {
    call_favTarackListAPI();
    return () => {
      setTrackList([]);
    };
  }, []);

  //? Views

  // const renderTrackList = ({item, index}) => {
  //   return (
  //     <Pressable
  //       onPress={() => {
  //         gotoTrackPlayer(item);
  //       }}
  //       style={{
  //         marginBottom: 20,
  //         alignItems: 'center',
  //         borderRadius: 20,
  //         paddingHorizontal: 10,
  //         flexDirection: 'row',
  //         marginHorizontal: 12,
  //         minHeight: 70,
  //       }}>
  //       <View
  //         style={{
  //           height: 70,
  //           width: 70,
  //           borderRadius: 26,
  //           overflow: 'hidden',
  //           borderWidth: 1,
  //           borderColor: Colors.gray02,
  //         }}>
  //         <CustomImage
  //           source={{uri: fileURL + item?.images?.small}}
  //           style={{height: 70, width: 70}}
  //           indicatorProps={{color: Colors.primary}}
  //         />
  //       </View>
  //       <View style={{marginLeft: 15, flex: 1}}>
  //         <Text
  //           style={{
  //             fontFamily: font.bold,
  //             fontSize: 16,
  //             includeFontPadding: false,
  //             color: Colors.black,
  //           }}>
  //           {item?.name}
  //         </Text>

  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             marginTop: 5,
  //           }}>
  //           <Text
  //             numberOfLines={1}
  //             style={{
  //               fontFamily: font.medium,
  //               color: Colors.text,
  //               fontSize: 12,
  //             }}>
  //             {item?.description}
  //           </Text>
  //         </View>
  //         <View style={{marginTop: 5}}>
  //           <Text
  //             style={{
  //               fontFamily: font.medium,
  //               color: Colors.gray12,
  //               fontSize: 12,
  //             }}>
  //             {formatTime(item.duration)}
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={{}}>
  //         <TouchableHighlight
  //           underlayColor={Colors.lightPrimary}
  //           onPress={() => {
  //             unLike(item?._id);
  //             params?.likeUnLikeFunc(item?._id, false);
  //             api_likeUnLike(false, item?._id);
  //           }}
  //           style={{
  //             width: 40,
  //             height: 40,
  //             backgroundColor: Colors.white,
  //             borderRadius: 10,
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             borderColor: Colors.gray02,
  //             borderWidth: 1,
  //           }}>
  //           <Image
  //             style={{
  //               height: 18,
  //               width: 18,
  //               tintColor: Colors.primary,
  //             }}
  //             source={favIcon}
  //           />
  //         </TouchableHighlight>
  //       </View>
  //     </Pressable>
  //   );
  // };

  const renderTrackList = React.useCallback(
    ({item, index}) => {
      return (
        <Pressable
          onPress={() => {
            gotoTrackPlayer(item, index);
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 20,
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
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  color: Colors.gray12,
                  fontSize: 12,
                }}>
                {formatTime(item.duration)}
              </Text>
            </View>
          </View>
          <View style={{}}>
            <TouchableHighlight
              underlayColor={Colors.lightPrimary}
              onPress={() => {
                unLike(item?._id);
                params?.likeUnLikeFunc(item?._id, false);
                api_likeUnLike(false, item?._id);
              }}
              style={{
                width: 35,
                height: 35,
                backgroundColor: Colors.white,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Colors.gray02,
                borderWidth: 1,
              }}>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  tintColor: Colors.primary,
                }}
                source={favIcon}
              />
            </TouchableHighlight>
          </View>
        </Pressable>
      );
    },
    [trackList],
  );
  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header navigation={props.navigation} title={'Favorite Tracks'} />
      <View style={mainStyles.innerView}>
        <Loader enable={isLoading} />
        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            data={trackList}
            renderItem={renderTrackList}
            keyExtractor={item => {
              return item._id;
            }}
            ListEmptyComponent={
              isLoading == false && (
                <EmptyView title="No Favourite Tracks" noSubtitle />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FavouriteTracks;
