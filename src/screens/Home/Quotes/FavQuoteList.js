import {
  SafeAreaView,
  StatusBar,
  Dimensions,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles } from '../../../Utilities/styles';
import CustomImage from '../../../Components/CustomImage';
import Share from 'react-native-share';
import axios from 'axios';
import _ from 'buffer';
import kFormatter from '../../../functions/kFormatter';
import ImageZoomer from '../../../Components/ImageZoomer';
import analytics from '@react-native-firebase/analytics';
import debounnce from '../../../functions/debounce';
// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import { fileURL } from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';

import Clipboard from '@react-native-clipboard/clipboard';
import Modal from 'react-native-modal';
// import WallpaperManager, { TYPE } from "react-native-wallpaper-manage";


//ICONS

import liked from '../../../Assets/Icons/liked.png';
import notliked from '../../../Assets/Icons/notliked.png';
import Fav from '../../../Assets/Icons/fav.png';
import notFav from '../../../Assets/Icons/notfav.png';
import qouteSign from '../../../Assets/Icons/quote.png';
import favList from '../../../Assets/Icons/favList.png';
import ic_share from '../../../Assets/Icons/share.png';
import ic_download from '../../../Assets/Icons/ic_download.png';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';

import ic_wallPaper from '../../../Assets/Icons/wallpapers.png';
import ic_lock from '../../../Assets/Icons/ic_lock.png';
import ic_home from '../../../Assets/Icons/home.png';
import ic_home_lock from '../../../Assets/Icons/home-lock.png';
import ic_cross from '../../../Assets/Icons/cross.png';

const limit = 10;

let selectedQuote;
const FavQuoteList = props => {
  const { params } = props?.route;
  const { Token, checkPermissions, downloadQuote, dashboardData, setDashBoardData } = useContext(Context);
  const [QuoteList, setQuoteList] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSharing, setIsSharing] = useState(null);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);


  const [PGN, updatePGN] = useState({
    pageNumber: 0,
    isLoadingMore: false,
    canLoadMore: false,
  });
  const { pageNumber, isLoadingMore, canLoadMore } = PGN;
  const setPGN = val => updatePGN({ ...PGN, ...val });

  const shareQuote = async item => {
    setIsSharing(item._id);
    try {
      let image = item?.images?.large;
      let description = item?.description.trim();
      let res = await GetBase64(fileURL + image);
      let ext = await image.split('.')[image.split('.').length - 1];
      if (ext == 'jpg') {
        ext = 'jpeg';
      }
      let file = `data:image/${ext};base64,${res}`;
      setIsSharing(null);
      await Share.open({
        title: 'Better.Me | Quotes',
        message: description,
        url: file,
      })
        .then(async res => {
          shareQuoteApi(item._id);
          console.log('res', res);
          await analytics().logEvent('QUOTE_SHARE_EVENT');
        })
        .catch(err => {
          console.log('error', err);
        });
    } catch (e) {
      setIsSharing(null);
    }
  };

  const shareQuoteApi = async (id) => {
    let res = await invokeApi({
      path: 'api/quotes/increament_quote_share/' + id,
      method: 'PUT',
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        if (!!params?.shareBackScreenQuote) {
          params?.countShareQuote(item?._id);
        }
        await countShareQuote(id)
        shareQuoteOfTheDay(id)
      }
      else {
        showToast(res.message);
      }
    }

  }

  const countShareQuote = async (id) => {
    let newArray = [...QuoteList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      let newObj = newArray[index];
      newObj.share = newObj.share + 1;
      newArray.splice(index, 1, newObj);
      await setQuoteList([...newArray]);
    }
  }

  const shareQuoteOfTheDay = async (id) => {
    let newObj = dashboardData.quoteOfTheDay;
    if (id == newObj._id) {
      newObj.share = newObj.share + 1;
    }
    dashboardData.quoteOfTheDay = newObj;
    await setDashBoardData({
      ...dashboardData,
    })
  }

  const GetBase64 = async url => {
    return await axios
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then(response =>
        _.Buffer.from(response.data, 'binary').toString('base64'),
      )
      .catch(err => console.log('Error', err));
  };

  const favUnFavFunction = (item, index) => {
    let val = !item?.is_favourite_by_me;
    api_favOrUnfavQuote(val, item._id);
    removeLiked(item?._id);
    if (!!params?.toggleBackScreenLike) {
      params?.toggleBackScreenLike(val, item._id);
    }
  };

  const copyText = async text => {
    try {
      await Clipboard.setString(text);
      ToastAndroid.show('Text Copied', ToastAndroid.SHORT);
    } catch (e) {
      console.log(e, 'copyText...');
    }
  };

  //todo API's

  const call_quoteListAPI = () => {
    setisLoading(true);
    api_quoteList();
  };

  const refresh_quoteListAPI = () => {
    setRefreshing(true);
    api_quoteList();
  };

  const api_quoteList = async () => {
    let res = await invokeApi({
      path: `api/quotes/get_favourite_quotes?page=${pageNumber}&limit=${limit}`,
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    setPGN({ isLoadingMore: false });
    if (res) {
      if (res.code == 200) {
        let count = QuoteList?.length;
        setQuoteList([...QuoteList, ...res?.quotes]);
        count = count + res?.quotes.length;
        setPGN({
          pageNumber: pageNumber + 1,
          canLoadMore: count < res?.count ? true : false,
        });
      } else {
        showToast(res.message);
      }
    }
  };

  const onEndReached = () => {
    console.log('onEndReached');
    if (canLoadMore) {
      setPGN({ isLoadingMore: true, canLoadMore: false });
      api_quoteList();
    }
  };

  const toggleLike = (val, id) => {
    let newArray = [...QuoteList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      let newObj = newArray[index];

      newObj.is_favourite_by_me = val;
      if (newObj.is_favourite_by_me) {
        newObj.favourite = newObj.favourite + 1;
      } else {
        newObj.favourite = newObj.favourite - 1;
      }
      newArray.splice(index, 1, newObj);
      setQuoteList([...newArray]);
    }
  };

  const removeLiked = id => {
    let newArray = [...QuoteList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      newArray.splice(index, 1);
      setQuoteList([...newArray]);
    }
  };

  const api_favOrUnfavQuote = async (val, id) => {
    let res = await invokeApi({
      path: 'api/quotes/favourite_quotes/' + id,
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
        favQuotesOfTheDay(val, id)
      } else {
        toggleLike(!val, id);
        favQuotesOfTheDay(!val, id)
        if (!!params?.toggleBackScreenLike) {
          params?.toggleBackScreenLike(!val, item._id);
        }
        showToast(res.message);
      }
    }
  };

  const favQuotesOfTheDay = async (val, id) => {
    let newObj = dashboardData.quoteOfTheDay;
    if (id == newObj._id) {
      newObj.is_favourite_by_me = val;

      if (newObj.is_favourite_by_me) {
        newObj.favourite = newObj.favourite + 1;
      } else {
        newObj.favourite = newObj.favourite - 1;
      }
    }
    dashboardData.quoteOfTheDay = newObj;
    await setDashBoardData({
      ...dashboardData,
    })
  }

  const download = item => {
    setIsDownloading(item._id);
    debounceDownload(item);
  };

  const debounceDownload = debounnce(async item => {
    console.log('download');
    let granted = await checkPermissions();
    if (!granted) {
      setIsDownloading(null);
      showToast(
        'Please allow permission from settings first.',
        'Permission denied',
      );
      return;
    }
    let res = await invokeApi({
      path: 'api/quotes/increament_quote_downloads/' + item?._id,
      method: 'PUT',
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        await downloadQuote(item?.images?.large, item?._id);
        if (!!params?.toggleBackScreenLike) {
          params?.downloadBackScreenQuote(item?._id);
        }
        downloadQuoteOfTheDay(item?._id)
        setTimeout(() => {
          downloadCounts(item?._id)
          setIsDownloading(null)
        },500);
      }
      else {
        setIsDownloading(null)
        showToast(res.message);
      }
    }
    await analytics().logEvent('QUOTE_DOWLOAD_EVENT');
  }, 500);

  const downloadCounts = async (id) => {
    let newArray = [...QuoteList];
    let index = newArray.findIndex(x => x._id == id);
    if (index > -1) {
      let newObj = newArray[index];
      newObj.downloads = newObj.downloads + 1;
      newArray.splice(index, 1, newObj);
      await setQuoteList([...newArray]);
    }
  };

  const downloadQuoteOfTheDay = async (id) => {
    let newObj = dashboardData.quoteOfTheDay;
    if (id == newObj._id) {
      newObj.downloads = newObj.downloads + 1;
    }
    dashboardData.quoteOfTheDay = newObj;
    await setDashBoardData({
      ...dashboardData,
    })
  }

  useEffect(() => {
    call_quoteListAPI();

    analytics().logEvent(props?.route?.name);

    return () => {
      setQuoteList([]);
    };
  }, []);

  const showImageModal = image => {
    setModalImage(image);
  };

  const hideImageModal = () => {
    setModalImage(null);
  };

  const flatItemView = ({ item, index }) => {
    return (
      <View
        style={{
          margin: 10,
          borderRadius: 15,
          overflow: 'hidden',
          borderColor: Colors.gray02,
          borderWidth: 1,
          backgroundColor: Colors.white,
        }}>
        <Pressable onPress={() => showImageModal(item?.images?.large)}>
          <CustomImage
            resizeMode={'cover'}
            source={{ uri: fileURL + item?.images?.large }}
            style={{
              width: '100%',
              aspectRatio:
                item?.image_height != 0
                  ? item?.image_width / item?.image_height
                  : 1,
            }}
          />
          {/* <AutoHeightImage url={item?.images?.large} /> */}
        </Pressable>

        {/* <View style={{paddingHorizontal: 5, paddingVertical: 10}}>
          <Text style={{fontSize: 14, fontFamily: font.regular}}>
            {item?.description}
          </Text>
        </View> */}
        {!!item?.description && (
          <TouchableHighlight
            disabled={Platform.OS == 'ios'}
            onPress={() => copyText(item?.description.trim())}
            // delayLongPress={500}
            underlayColor={Colors.gray01}
            style={{}}>
            <Text
              selectable={Platform.OS == 'ios' ? true : false}
              style={{
                fontSize: 14,
                fontFamily: font.regular,
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}>
              {item?.description.trim()}
            </Text>
          </TouchableHighlight>
        )}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFF',
          }}>
          <Pressable
            onPress={() => favUnFavFunction(item, index)}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={item?.is_favourite_by_me ? Fav : notFav}
              style={{
                height: 20,
                width: 20,
                tintColor: item?.is_favourite_by_me
                  ? Colors.primary
                  : Colors.placeHolder,
              }}
            />
            <Text
              style={{
                marginLeft: 5,
                fontFamily: font.medium,
                color: Colors.placeHolder,
                letterSpacing: 1,
                includeFontPadding: false,
              }}>
              {kFormatter(item?.favourite)}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => download(item)}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
           
            {isDownloading != item._id ? (
              <Image
              source={ic_download}
              style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
            />
            ) : (
              <ActivityIndicator color={Colors.placeHolder} size="small" />
            )}
             <Text
              style={{
                marginLeft: 5,
                fontFamily: font.medium,
                color: Colors.placeHolder,
                letterSpacing: 1,
                includeFontPadding: false,
              }}>
              {kFormatter(item?.downloads)}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await shareQuote(item);
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            {isSharing != item._id ? (
              <Image
                source={ic_share}
                style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
              />
            ) : (
              <ActivityIndicator color={Colors.placeHolder} size="small" />
            )}
             <Text
              style={{
                marginLeft: 5,
                fontFamily: font.medium,
                color: Colors.placeHolder,
                letterSpacing: 1,
                includeFontPadding: false,
              }}>
              {kFormatter(item?.share)}
            </Text>
          </Pressable>

          {/* <Pressable
            onPress={() => {setModalVisibility(true) 
              selectedQuote = item
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            <Image
              source={ic_wallPaper}
              style={{ height: 18.5, width: 18.5, tintColor: Colors.placeHolder }}
            />
          </Pressable> */}
        </View>
      </View>
    );
  };

  const wallpaperOptionsModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
        onBackdropPress={() => setModalVisibility(false)}
        useNativeDriverForBackdrop={true}
        style={{
          flex: 1,
          justifyContent: 'flex-end'
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            borderRadius: 10,
            padding: 20,
          }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                Set as wallpaper
              </Text>
            </View>

            <Pressable
              onPress={() => setModalVisibility(false)}
              style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_cross} style={{ height: 10, width: 10 }} />
              </View>
            </Pressable>
          </View>

          <View
            style={{ marginTop: 20, }}>
            <Pressable onPress={setHomeScreenWallpaper} style={{ alignItems: 'center', flexDirection: 'row', }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <Image source={ic_home} style={{ height: 19, width: 19 }} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginLeft: 10
                }}>
                Home screen
              </Text>
            </Pressable>

            <Pressable
              onPress={setLockScreenWallpaper}
              style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <Image source={ic_lock} style={{ height: 20, width: 20 }} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginLeft: 10
                }}>
                Lock screen
              </Text>
            </Pressable>


            <Pressable
              onPress={setHomeAndLockScreenWallpaper}
              style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <Image source={ic_home_lock} style={{ height: 23, width: 23 }} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginLeft: 10
                }}>
                Home & Lock screens
              </Text>
            </Pressable>


          </View>

        </View>
      </Modal>
    );
  };

  const setHomeScreenWallpaper = async () => {
    let image = selectedQuote?.images?.large
    WallpaperManager.setWallpaper(
      fileURL + `${image}`,
      TYPE.FLAG_SYSTEM
    )
    await ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
    setModalVisibility(false)
  };

  const setLockScreenWallpaper = async () => {
    let image = selectedQuote?.images?.large
    WallpaperManager.setWallpaper(
      fileURL + `${image}`,
      TYPE.FLAG_LOCK
    )
    ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
    await setModalVisibility(false)
  };

  const setHomeAndLockScreenWallpaper = async () => {
    let image = selectedQuote?.images?.large
    WallpaperManager.setWallpaper(
      fileURL + `${image}`,
      TYPE.FLAG_SYSTEM
    )
    WallpaperManager.setWallpaper(
      fileURL + `${image}`,
      TYPE.FLAG_LOCK
    )
    ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
    await setModalVisibility(false)
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={!!modalImage ? Colors.black : Colors.background}
      />
      <Header
        navigation={props.navigation}
        title={'Favourite Quotes'}
      />
      <View style={{ flex: 1 }}>
        <Loader enable={loading} />
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{ marginTop: 10, marginBottom: 10 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            data={QuoteList}
            renderItem={flatItemView}
            onEndReached={onEndReached}
            ListEmptyComponent={
              loading == false && <EmptyView title="No Quotes" />
            }
            ListFooterComponent={
              isLoadingMore && (
                <ActivityIndicator size={'small'} color={Colors.primary} />
              )
            }
          />
        </View>
      </View>
      {/* {isModalVisible && wallpaperOptionsModal()} */}
      <ImageZoomer
        closeModal={hideImageModal}
        visible={!!modalImage}
        url={modalImage}
      />

    </SafeAreaView>
  );
};

export default FavQuoteList;
