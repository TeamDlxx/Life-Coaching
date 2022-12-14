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
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import CustomImage from '../../../Components/CustomImage';
import Share from 'react-native-share';
import axios from 'axios';
import _ from 'buffer';
import ReactNativeBlobUtil from 'react-native-blob-util';
import LoginAlert from '../../../Components/LoginAlert';
import RNFS from 'react-native-fs';
import kFormatter from '../../../functions/kFormatter';
import ImageZoomer from '../../../Components/ImageZoomer';
import analytics from '@react-native-firebase/analytics';
import debounnce from '../../../functions/debounce';

import Clipboard from '@react-native-clipboard/clipboard';

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL, deepLinkQuote} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
//ICONS

import Fav from '../../../Assets/Icons/fav.png';
import notFav from '../../../Assets/Icons/notfav.png';
import favList from '../../../Assets/Icons/favList.png';
import ic_share from '../../../Assets/Icons/share.png';
import ic_download from '../../../Assets/Icons/ic_download.png';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';

const limit = 10;
const win = Dimensions.get('window');

let firstTime = true;
const List = props => {
  const flatListRef = useRef();
  const {Token, downloadQuote, downloading} = useContext(Context);
  const [QuoteList, setQuoteList] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [isSharing, setIsSharing] = useState(null);
  const [loading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [PGN, updatePGN] = useState({
    pageNumber: 0,
    isLoadingMore: false,
    canLoadMore: false,
  });
  const {pageNumber, isLoadingMore, canLoadMore} = PGN;
  const setPGN = val => updatePGN({...PGN, ...val});

  const onFavList = () => {
    if (Token) {
      props.navigation.navigate(screens.favQuoteList, {
        toggleBackScreenLike: toggleLike,
      });
    } else {
      LoginAlert(props.navigation, props.route?.name);
    }
  };

  const shareQuote = async item => {
    setIsSharing(item._id);
    try {
      let image = item?.images?.large;
      let description = !!item?.description ? item?.description.trim() : '';
      let res = await GetBase64(fileURL + image);
      let ext = await image.split('.')[image.split('.').length - 1];
      if (ext == 'jpg') {
        ext = 'jpeg';
      }
      let file = `data:image/${ext};base64,${res}`;

      setIsSharing(null);
      let objShare = {
        title: 'Better.Me | Quotes',
        message: description + '\n' + deepLinkQuote,
        url: file,
      };
      console.log('objShare', objShare);
      await Share.open(objShare)
        .then(async res => {
          await analytics().logEvent('QUOTE_SHARE_EVENT');
          console.log('res', res);
        })
        .catch(err => {
          console.log('error', err);
        });
    } catch (e) {
      console.log('error1', e);
      setIsSharing(null);
    }
  };

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

  const favUnFavFunction = async (item, index) => {
    if (Token) {
      api_favOrUnfavQuote(!item?.is_favourite_by_me, item._id);
      toggleLike(!item?.is_favourite_by_me, item._id);
      if (!item?.is_favourite_by_me) {
        await analytics().logEvent(`LIKE_QUOTE_EVENT`);
      }
    } else {
      LoginAlert(props.navigation, props.route?.name);
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

  const download = item => {
    debounceDownload(item);
  };

  const debounceDownload = debounnce(async item => {
    console.log('download');
    await downloadQuote(item?.images?.large, item?._id);
    await analytics().logEvent('QUOTE_DOWLOAD_EVENT');
  }, 500);

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
    let res;
    if (Token) {
      res = await invokeApi({
        path: `api/quotes/get_active_quotes?page=${pageNumber}&limit=${limit}`,
        method: 'GET',
        headers: {
          'x-sh-auth': Token,
        },
        navigation: props.navigation,
      });
    } else {
      res = await invokeApi({
        path: `api/quotes/get_guest_active_quotes?page=${pageNumber}&limit=${limit}`,
        method: 'GET',

        navigation: props.navigation,
      });
    }

    if (res) {
      if (res.code == 200) {
        // let newArray = [];
        // await res?.quotes.forEach(async (element, index) => {
        //   await Image.getSize(
        //     fileURL + element?.images?.large,
        //     async (width, height) => {
        //       let newObj = await res?.quotes[index];
        //       // newObj.width = width;
        //       // newObj.height = height;
        //       newObj.ratio = width / height;
        //       // console.log('newObj', newObj);
        //       await newArray.push(newObj);
        //     },
        //   );
        // });

        let count = QuoteList?.length;
        // console.log('newArray', newArray);
        setQuoteList([...res?.quotes, ...QuoteList]);
        count = count + res?.quotes.length;
        // console.log('count', count);
        setPGN({
          pageNumber: pageNumber + 1,
          canLoadMore: count < res?.count ? true : false,
        });
      } else {
        showToast(res.message);
      }
    }
    setisLoading(false);
    setRefreshing(false);
    setPGN({isLoadingMore: false});
  };

  const onEndReached = () => {
    console.log('onEndReached');
    if (canLoadMore) {
      setPGN({isLoadingMore: true, canLoadMore: false});
      api_quoteList();
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
      } else {
        showToast(res.message);
        toggleLike(!val, id);
      }
    }
  };

  const showImageModal = image => {
    setModalImage(image);
  };

  const hideImageModal = () => {
    setModalImage(null);
  };

  const isDownloading = id => {
    return !!downloading.find(x => x == id);
  };
  const scrollToQuote = () => {
    let Id = props.route?.params?._id;
    console.log(Id, '_id');
    let index = QuoteList.findIndex(x => x._id == Id);
    console.log(index, 'index');
    if (index != -1) {
      setTimeout(() => {
        flatListRef?.current?.scrollToIndex({animated: true, index: index});
      }, 1000);
    }
  };

  useEffect(() => {
    if (QuoteList.length != 0) {
      if (firstTime == true && !!props.route?.params?._id == true) {
        firstTime = false;
        scrollToQuote();
      }
    }
  }, [QuoteList]);

  useEffect(() => {
    firstTime = true;
    call_quoteListAPI();
    console.log(props, 'routes');
    analytics().logEvent(props?.route?.name);
    return () => {
      setQuoteList([]);
    };
  }, []);

  const flatItemView = ({item, index}) => {
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
            source={{uri: fileURL + item?.images?.large}}
            style={{
              width: '100%',
              aspectRatio:
                item?.image_height != 0
                  ? item?.image_width / item?.image_height
                  : 1,
            }}
          />
        </Pressable>
        {!!item?.description && (
          <TouchableHighlight
            disabled={Platform.OS == 'ios'}
            onLongPress={() => copyText(item?.description.trim())}
            delayLongPress={500}
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
          <TouchableOpacity
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
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => download(item)}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            {/* {!checkQuoteDownloading(item._id) ? ( */}
            <Image
              source={ic_download}
              style={{height: 20, width: 20, tintColor: Colors.placeHolder}}
            />
            {/* ) : (
              <ActivityIndicator color={Colors.placeHolder} size="small" />
            )} */}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isSharing != null}
            onPress={async () => {
              await shareQuote(item);
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            {isSharing != item._id ? (
              <Image
                source={ic_share}
                style={{height: 20, width: 20, tintColor: Colors.placeHolder}}
              />
            ) : (
              <ActivityIndicator color={Colors.placeHolder} size="small" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
        translucent={!!modalImage ? true : false}
      />

      <Header
        titleAlignLeft
        rightIcon={favList}
        rightIcononPress={onFavList}
        rightIconStyle={{height: 25, width: 25}}
        navigation={props.navigation}
        title={'Quotes'}
      />
      <View style={{flex: 1}}>
        <Loader enable={loading} />
        <View style={{flex: 1}}>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{marginTop: 10, paddingBottom: 10}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            onScrollToIndexFailed={() => {
              console.log('scroll error');
              try {
                scrollToQuote();
              } catch (e) {
                console.log(e, 'scroll error');
              }
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
      <ImageZoomer
        closeModal={hideImageModal}
        visible={!!modalImage}
        url={modalImage}
      />
    </SafeAreaView>
  );
};

export default List;
