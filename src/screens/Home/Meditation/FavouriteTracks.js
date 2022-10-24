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

import favIcon from '../../../Assets/TrackPlayer/favIcon.png';

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

  const renderTrackList = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          gotoTrackPlayer(item);
        }}
        style={{
          marginBottom: 20,
          alignItems: 'center',
          borderRadius: 20,
          paddingHorizontal: 10,
          flexDirection: 'row',
          marginHorizontal: 12,
          minHeight: 70,
        }}>
        <View
          style={{
            height: 70,
            width: 70,
            borderRadius: 26,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: Colors.gray02,
          }}>
          <CustomImage
            source={{uri: fileURL + item?.images?.small}}
            style={{height: 70, width: 70}}
            indicatorProps={{color: Colors.primary}}
          />
        </View>
        <View style={{marginLeft: 15, flex: 1}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 16,
              includeFontPadding: false,
              color: Colors.black,
            }}>
            {item?.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: font.medium,
                color: Colors.text,
                fontSize: 12,
              }}>
              {item?.description}
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
              width: 40,
              height: 40,
              backgroundColor: Colors.white,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: Colors.gray02,
              borderWidth: 1,
            }}>
            <Image
              style={{
                height: 18,
                width: 18,
                tintColor: Colors.primary,
              }}
              source={favIcon}
            />
          </TouchableHighlight>
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

const tracksList = [
  {
    _id: '1',
    title: 'Relax',
    note: 'Release the tention',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '2',
    title: 'Breathe',
    note: 'Nature',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '3',
    title: 'Sleep',
    note: 'deep sleep',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },

  {
    _id: '4',
    title: 'Relax',
    note: 'Release the tention',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
  },

  {
    _id: '5',
    title: 'Breathe',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    note: 'Nature',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
  },

  {
    _id: '6',
    title: 'Sleep',
    note: 'deep sleep',
    isFav: true,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
  },
];
