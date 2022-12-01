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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import CustomImage from '../../../Components/CustomImage';
import Share from 'react-native-share';
import axios from 'axios';
import _ from 'buffer';
import kFormatter from '../../../functions/kFormatter';
import ImageZoomer from '../../../Components/ImageZoomer';
import analytics from '@react-native-firebase/analytics';
// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import AutoHeightImage from '../../../Components/AutoHeightImage';
//ICONS

import liked from '../../../Assets/Icons/liked.png';
import notliked from '../../../Assets/Icons/notliked.png';
import Fav from '../../../Assets/Icons/fav.png';
import notFav from '../../../Assets/Icons/notfav.png';
import qouteSign from '../../../Assets/Icons/quote.png';
import favList from '../../../Assets/Icons/favList.png';
import ic_share from '../../../Assets/Icons/share.png';
import ic_download from '../../../Assets/Icons/ic_download.png';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
const limit = 10;
const FavQuoteList = props => {
  const {params} = props?.route;
  const {Token, downloadQuote} = useContext(Context);
  const [QuoteList, setQuoteList] = useState([]);
  const [loading, setisLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSharing, setIsSharing] = useState(null);
  const [PGN, updatePGN] = useState({
    pageNumber: 0,
    isLoadingMore: false,
    canLoadMore: false,
  });
  const {pageNumber, isLoadingMore, canLoadMore} = PGN;
  const setPGN = val => updatePGN({...PGN, ...val});

  const shareQuote = async item => {
    setIsSharing(item._id);
    try {
      let image = item?.images?.large;
      let description = item?.description;
      let res = await GetBase64(fileURL + image);
      let ext = await image.split('.')[image.split('.').length - 1];
      if (ext == 'jpg') {
        ext = 'jpeg';
      }
      let file = `data:image/${ext};base64,${res}`;
      setIsSharing(null);
      await Share.open({
        title: 'Life Mate | Quotes',
        message: description,
        url: file,
      })
        .then(async res => {
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
    setPGN({isLoadingMore: false});
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
      setPGN({isLoadingMore: true, canLoadMore: false});
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
      } else {
        toggleLike(!val, id);
        if (!!params?.toggleBackScreenLike) {
          params?.toggleBackScreenLike(!val, item._id);
        }
        showToast(res.message);
      }
    }
  };

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
            resizeMode={'cover'}
            source={{uri: fileURL + item?.images?.large}}
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

        <View style={{paddingHorizontal: 5, paddingVertical: 10}}>
          <Text style={{fontSize: 14, fontFamily: font.regular}}>
            {item?.description}
          </Text>
        </View>

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
            onPress={async () => {
              await downloadQuote(item?.images?.large, item?._id);
              await analytics().logEvent('QUOTE_DOWLOAD_EVENT');
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            <Image
              source={ic_download}
              style={{height: 20, width: 20, tintColor: Colors.placeHolder}}
            />
          </TouchableOpacity>

          <TouchableOpacity
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
        backgroundColor={!!modalImage ? Colors.black : Colors.background}
      />
      <Header
        titleAlignLeft
        navigation={props.navigation}
        title={'Favourite Quotes'}
      />
      <View style={{flex: 1}}>
        <Loader enable={loading} />
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{marginTop: 10, marginBottom: 10}}
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
      <ImageZoomer
        closeModal={hideImageModal}
        visible={!!modalImage}
        url={modalImage}
      />
    </SafeAreaView>
  );
};

export default FavQuoteList;
