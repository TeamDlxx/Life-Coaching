import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {mainStyles} from '../../Utilities/styles';
import {font} from '../../Utilities/font';
import {screens} from '../../Navigation/Screens';
import CustomImage from '../../Components/CustomImage';
import formatTime from '../../functions/formatTime';
import favIcon from '../../Assets/TrackPlayer/favIcon.png';
import play from '../../Assets/Icons/play.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For API's calling
import {useContext} from 'react';
import Context from '../../Context';
import Loader from '../../Components/Loader';
import EmptyView from '../../Components/EmptyView';

const OfflineTracks = props => {
  const {params} = props.route;
  const [isLoading, setisLoading] = useState(false);
  const [trackList, setTrackList] = useState([]);

  //? Animatable

  //? Navigation Functions

  const gotoTrackPlayer = item => {
    props.navigation.navigate(screens.trackPlayer, {
      item: item,
      category: item?.category,
      list: trackList,
      from: 'down',
      localTracksRefresh: getDownloadedTracks,
    });
  };

  // todo /////// API's

  const call_DownloadedTracks = async () => {
    setisLoading(true);
    getDownloadedTracks();
  };

  const getDownloadedTracks = async () => {
    console.log('api_favTracksList');
    await AsyncStorage.getItem('@tracks')
      .then(val => {
        console.log('offlineTracks', JSON.parse(val));
        setisLoading(false);
        if (val != null) {
          setTrackList(JSON.parse(val));
        }
      })
      .catch(() => setisLoading(true));
  };

  //* UseEffect

  useEffect(() => {
    call_DownloadedTracks();
    return () => {
      setTrackList([]);
    };
  }, []);

  //? Views

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
              source={{uri: item?.images?.small}}
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
      <Header navigation={props.navigation} title={'Downloaded Meditations'} />
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
                <EmptyView title="No Downloaded Tracks" noSubtitle />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OfflineTracks;
