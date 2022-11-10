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
import ReactNativeBlobUtil from 'react-native-blob-util';
import LoginAlert from '../../../Components/LoginAlert';
import RNFS from 'react-native-fs';
// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
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

const List = props => {
  const {Token, downloadQuote} = useContext(Context);
  const [QuoteList, setQuoteList] = useState([]);
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
      let description = item?.description;
      let res = await GetBase64(fileURL + image);
      let ext = await image.split('.')[image.split('.').length - 1];
      if (ext == 'jpg') {
        ext = 'jpeg';
      }
      let file = `data:image/${ext};base64,${res}`;
      setIsSharing(null);
      await Share.open({
        title: 'Life Coaching | Quotes',
        message: description,
        url: file,
      })
        .then(res => {
          console.log('res', res);
        })
        .catch(err => {
          err && console.log(err);
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
    if (Token) {
      api_favOrUnfavQuote(!item?.is_favourite_by_me, item._id);
      toggleLike(!item?.is_favourite_by_me, item._id);
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

 

  function kFormatter(num) {
    {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return num;
    }
  }

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
    setisLoading(false);
    setRefreshing(false);
    setPGN({isLoadingMore: false});
    if (res) {
      if (res.code == 200) {
        let count = QuoteList?.length;
        setQuoteList([...QuoteList, ...res?.quotes]);
        count = count + res?.quotes.length;
        console.log('count', count);
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

  useEffect(() => {
    call_quoteListAPI();
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
        <View>
          <CustomImage
            resizeMode={'cover'}
            source={{uri: fileURL + item?.images?.large}}
            style={{width: '100%', height: undefined, aspectRatio: 1}}
          />
        </View>

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
                marginTop: 4,
              }}>
              {kFormatter(item?.favourite)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              downloadQuote(item?.images?.large);
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
            disabled={isSharing != null}
            onPress={() => {
              shareQuote(item);
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
    </SafeAreaView>
  );
};

export default List;
