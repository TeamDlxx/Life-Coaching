import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomImage from '../../../Components/CustomImage';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import formatTime from '../../../functions/formatTime';
import LoginAlert from '../../../Components/LoginAlert';
import analytics from '@react-native-firebase/analytics';
import debounce from '../../../functions/debounce';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import Admob_Ids from '../../../Utilities/AdmobIds';
// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';

//Icons
import play from '../../../Assets/Icons/play.png';
import favList from '../../../Assets/Icons/favList.png';
import ic_default from '../../../Assets/Icons/all.png';
import ic_lock from '../../../Assets/Icons/locked.png';

const Meditation = props => {
  const {Token, isMeditationPurchased} = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [adError, setAdError] = useState(false);

  console.log('Token', Token);
  console.log('isMeditationPurchased', isMeditationPurchased);
  //? Navigation Functions

  const gotoTrackPlayer = (item, index) => {
    if (!chooseScreenOnPurchasesAndLockedTrack(item.is_locked)) {
      let list = [];
      // if (!!Token == false || !!isMeditationPurchased == false) {
      //   list = selectedCategory?.category_track.filter(
      //     x => x.is_locked == false,
      //   );
      // } else {
      list = selectedCategory?.category_track;
      // }

      props.navigation.navigate(screens.trackPlayer, {
        item: item,
        category: selectedCategory?.name,
        list: list,
        likeUnLikeFunc: likeUnLikeLocally,
      });
    } else if (Token) {
      props.navigation.navigate(screens.allPackages, {
        from: 'meditation',
      });
      // Alert.alert(
      //   'Subscription',
      //   'Are you sure you want to buy subscription?',
      //   [
      //     {text: 'No'},
      //     {
      //       text: 'Yes',
      //       onPress: () => {
      //         props.navigation.navigate(screens.allPackages, {
      //           from: 'meditation',
      //         });
      //       },
      //     },
      //   ],
      // );
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  const findCategoryName = id => {
    categoryList.find(x => x.categoryList);
  };

  const chooseScreenOnPurchasesAndLockedTrack = trackLockedOrNot => {
    if (trackLockedOrNot == true && isMeditationPurchased == false) {
      return true;
    } else {
      return false;
    }
  };
  //todo /////// API's

  const call_categoryAPI = () => {
    setisLoading(true);
    if (Token) {
      api_CategoryWithTracksList();
    } else {
      api_GuestCategoryWithTracksList();
    }
  };

  const refresh_categoryAPI = () => {
    setRefreshing(true);
    if (Token) {
      api_CategoryWithTracksList();
    } else {
      api_GuestCategoryWithTracksList();
    }
  };

  const api_GuestCategoryWithTracksList = async () => {
    let res = await invokeApi({
      path: 'api/category/get_guest_active_categories',
      method: 'GET',
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    handleResponse(res);
  };

  const api_CategoryWithTracksList = async () => {
    let res = await invokeApi({
      path: 'api/category/get_active_categories',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    handleResponse(res);
  };

  const handleResponse = res => {
    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        setCategoryList([res?.top_20_tracks, ...res?.category]);
        if (selectedCategory == null && res?.category.length > 0) {
          setSelectedCategory(res?.top_20_tracks);
        } else {
          let obj = res?.category.find(x => x._id == selectedCategory._id);
          if (!!obj) {
            setSelectedCategory(obj);
          }
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const _debounce = debounce(() => api_loadMoreTracks(), 200);

  const api_loadMoreTracks = async () => {
    let scategory = selectedCategory;
    console.log(scategory, 'scategory');
    console.log(
      'chcek',
      scategory?.total_tracks > scategory?.category_track.length,
    );
    console.log('chcek2', scategory?.total_tracks);
    console.log('check 3 ', scategory?.category_track.length);
    if (
      scategory?.total_tracks > scategory?.category_track.length &&
      isLoadingMore == false
    ) {
      setIsLoadingMore(true);
      let res;
      if (Token) {
        res = await invokeApi({
          path: 'api' + selectedCategory?.load_more_url,
          method: 'GET',
          headers: {
            'x-sh-auth': Token,
          },
          navigation: props.navigation,
        });
      } else {
        res = await invokeApi({
          path: 'api' + selectedCategory?.load_more_url,
          method: 'GET',
          navigation: props.navigation,
        });
      }

      if (res) {
        if (res.code == 200) {
          if (res?.tracks?.category_id == selectedCategory?._id) {
            setSelectedCategory({
              ...selectedCategory,
              category_track: [
                ...selectedCategory?.category_track,
                ...res?.tracks?.track,
              ],
              load_more_url: res?.tracks?.load_more_url,
              total_tracks: res?.tracks?.total_tracks,
            });
          }

          let newArray = [...categoryList];
          let index = newArray.findIndex(
            x => x._id == res?.tracks?.category_id,
          );
          if (index != -1) {
            let newObj = {
              ...newArray[index],
              category_track: [
                ...newArray[index]?.category_track,
                ...res?.tracks?.track,
              ],
              load_more_url: res?.tracks?.load_more_url,
            };
            newArray.splice(index, 1, newObj);
            setCategoryList([...newArray]);
          }
        }
      } else {
        showToast(res.message);
      }
      setIsLoadingMore(false);
    }
  };

  const likeUnLikeLocally = (id, val) => {
    let list = [...categoryList];
    list.map(obj => {
      let index = obj?.category_track.findIndex(x => x._id == id);
      if (index > -1) {
        let newObj = {
          ...obj.category_track[index],
          is_favourite: val,
        };
        obj?.category_track.splice(index, 1, newObj);
      }
    });

    let index1 = selectedCategory?.category_track.findIndex(x => x._id == id);
    if (index1 > -1) {
      let newList = [...selectedCategory?.category_track];
      let newObj = {...newList[index1], is_favourite: val};
      newList.splice(index1, 1, newObj);
      setSelectedCategory({
        ...selectedCategory,
        category_track: newList,
      });
    }
    setCategoryList(list);
  };

  //* UseEffect

  useEffect(() => {
    call_categoryAPI();
    analytics().logEvent(props?.route?.name);
  }, []);

  //? Views

  const renderCategories = ({item, index}) => {
    return (
      <View>
        <Pressable
          onPress={() => setSelectedCategory(item)}
          style={{
            margin: 6,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            borderColor: Colors.gray07,
            borderWidth: 0.8,
            backgroundColor:
              item?._id == selectedCategory?._id
                ? Colors.lightPrimary1
                : Colors.white,
            paddingHorizontal: 15,
            height: 60,
            width: 60,
          }}>
          <View>
            <CustomImage
              style={
                item._id == selectedCategory?._id
                  ? {width: 30, height: 30, tintColor: Colors.primary}
                  : {width: 30, height: 30}
              }
              source={
                item?._id == 'all'
                  ? ic_default
                  : {uri: fileURL + item?.images?.small}
              }
              indicatorProps={{color: Colors.primary}}
            />
          </View>
        </Pressable>
        <Text
          style={{
            fontFamily: font.medium,
            color: Colors.black,
            textAlign: 'center',
            fontSize: 12,
            textTransform: item?._id == 'all' ? 'capitalize' : 'none',
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  const renderTrackList = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          gotoTrackPlayer(item, index);
        }}
        style={{
          marginTop: 20,
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
          {/* {chooseScreenOnPurchasesAndLockedTrack(item.is_locked) ? (
            <View
              style={{
                position: 'absolute',
                height: 70,
                width: 70,
                borderRadius: 10,
                backgroundColor: '#FFFFFF66',
                // justifyContent: 'center',
                // alignItems: 'center',
                zIndex: 2,
              }}>
              <View
                // opacity={0.7}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 30 / 2,
                  backgroundColor: Colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                }}>
                <Image
                  style={{height: 12, width: 12, tintColor: Colors.white}}
                  source={ic_lock}
                />
              </View>
            </View>
          ) : ( */}
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
          {/* )} */}
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

  const flatListHeader = () => {
    return (
      <View style={{backgroundColor: Colors.background}}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 15}}
          showsHorizontalScrollIndicator={false}
          data={categoryList}
          horizontal={true}
          renderItem={renderCategories}
        />
      </View>
    );
  };

  const onFavList = () => {
    if (Token) {
      props.navigation.navigate(screens.favTracks, {
        likeUnLikeFunc: likeUnLikeLocally,
      });
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />

      <Header
        navigation={props.navigation}
        title={'Meditation'}
        rightIcon={favList}
        rightIconStyle={{height: 25, width: 25}}
        rightIcononPress={onFavList}
      />
      <View style={mainStyles.innerView}>
        <Loader enable={isLoading} />

        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={flatListHeader()}
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            onEndReached={_debounce}
            data={
              !!selectedCategory?.category_track
                ? selectedCategory?.category_track
                : []
            }
            renderItem={renderTrackList}
            keyExtractor={item => {
              return item._id;
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh_categoryAPI}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.white}
                progressViewOffset={-1}
              />
            }
            ListEmptyComponent={
              isLoading == false && <EmptyView title="No Tracks" />
            }
            onEndReachedThreshold={0.25}
            ListFooterComponent={
              isLoadingMore == true && (
                <View
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator color={Colors.primary} size="small" />
                </View>
              )
            }
          />
        </View>
        {isMeditationPurchased == false && adError == false && (
          <View
            style={{
              width: '100%',
              // height: 100,
              alignItems: 'center',
              paddingVertical: 5,
              // backgroundColor:'pink',
              justifyContent: 'center',
              marginBottom: -15,
            }}>
            <BannerAd
              size={BannerAdSize.BANNER}
              unitId={Admob_Ids.banner}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdFailedToLoad={err => {
                console.log(err, 'Banner Ad Error...');
                setAdError(true);
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Meditation;
