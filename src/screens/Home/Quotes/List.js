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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import CustomImage from '../../../Components/CustomImage';
const screen = Dimensions.get('screen');

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';

//ICONS

import liked from '../../../Assets/Icons/liked.png';
import notliked from '../../../Assets/Icons/notliked.png';
import Fav from '../../../Assets/Icons/fav.png';
import notFav from '../../../Assets/Icons/notfav.png';
import qouteSign from '../../../Assets/Icons/quote.png';
import favList from '../../../Assets/Icons/favList.png';
import ic_share from '../../../Assets/Icons/share.png';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';

const List = props => {
  const {Token} = useContext(Context);
  const [QuoteList, setQuoteList] = useState();
  const [loading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onFavList = () => {
    props.navigation.navigate(screens.favQuoteList);
  };

  const likeUnLikeFunction = (item, index) => {
    let newArray = [...QuoteList];
    let newObj = newArray[index];
    newObj.liked = !newObj.liked;
    if (newObj.liked) {
      newObj.likes = newObj.likes + 1;
    } else {
      newObj.likes = newObj.likes - 1;
    }
    newArray.splice(index, 1, newObj);
    setQuoteList([...newArray]);
  };

  const favUnFavFunction = (item, index) => {
    let newArray = [...QuoteList];
    let newObj = newArray[index];
    newObj.fav = !newObj.fav;

    newArray.splice(index, 1, newObj);
    setQuoteList([...newArray]);
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
    let res = await invokeApi({
      path: 'api/quotes/get_active_quotes',
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        setQuoteList(res?.quotes);
      } else {
        showToast(res.message);
      }
    }
  };

  const api_likeUnLikeQuote = async (val, id) => {
    let res = await invokeApi({
      path: 'api/quotes/like_quotes/' + id,
      method: 'GET',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
      } else {
        showToast(res.message);
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
            style={{width: '100%', aspectRatio: 1}}
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
          <Pressable
            onPress={() => api_likeUnLikeQuote(!false, item?._id)}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={item.liked ? liked : notliked}
              style={{
                height: 20,
                width: 20,
                tintColor: item.liked ? Colors.primary : Colors.placeHolder,
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
              {kFormatter(item?.likes)}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => favUnFavFunction(item, index)}
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            <Image
              source={item.fav ? Fav : notFav}
              style={{
                height: 20,
                width: 20,
                tintColor: item.fav ? Colors.primary : Colors.placeHolder,
              }}
            />
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              height: 50,
              justifyContent: 'center',
            }}>
            <Image
              source={ic_share}
              style={{height: 20, width: 20, tintColor: Colors.placeHolder}}
            />
          </Pressable>
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
        navigation={props.navigation}
        title={'Quotes'}
      />
      <View style={{flex: 1}}>
        <Loader enable={loading} />
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{marginTop: 10}}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            data={QuoteList}
            renderItem={flatItemView}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default List;

const Qlist = [
  {
    id: '1',
    qoute: 'The purpose of our lives is to be happy.',
    author: 'Anonymous',
    image:
      'https://i.pinimg.com/564x/f6/74/6a/f6746a74f8e41e911a99d6489073b6e9.jpg',
    liked: true,
    fav: false,
    likes: 2929992,
  },

  {
    id: '2',
    qoute: "Life is what happens when you're busy making other plans.",
    liked: false,
    fav: false,
    author: 'Anonymous',
    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/missing-you-quotes-1614923859.jpg',
    likes: 29832792,
  },

  {
    id: '3',
    qoute: 'You only live once, but if you do it right, once is enough.',
    liked: true,
    author: 'Anonymous',
    fav: true,
    likes: 12133,
    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-quotes-ever14-1593566081.jpg',
  },

  {
    id: '4',
    qoute:
      'Many of life’s failures are people who did not realize how close they were to success when they gave up.',
    liked: true,
    fav: true,
    author: 'Anonymous',
    likes: 121,
    image:
      'https://cdn.lifehack.org/wp-content/uploads/2022/06/strength_quotes_1.jpg',
  },
  {
    id: '5',
    qoute:
      'If you want to live a happy life, tie it to a goal, not to people or things.',
    liked: false,
    author: 'Anonymous',
    fav: false,
    likes: 900,
    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/missing-you-quotes-1614923859.jpg',
  },
  {
    id: '6',
    qoute: 'Never let the fear of striking out keep you from playing the game.',
    liked: true,
    fav: true,
    likes: 1100,

    author: 'Anonymous',
    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/missing-you-quotes-1614923859.jpg',
  },
  {
    id: '7',
    qoute:
      'Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma – which is living with the results of other people’s thinking.',
    liked: true,
    author: 'Anonymous',
    likes: 2100000000,
    fav: false,
    image:
      'https://cdn.lifehack.org/wp-content/uploads/2022/06/strength_quotes_1.jpg',
  },

  {
    id: '1vergere',
    qoute: 'The purpose of our lives is to be happy.',
    liked: true,
    fav: false,
    author: 'Anonymous',
    likes: 2000000,

    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/change-quotes-1617242152.jpg',
  },

  {
    id: 'ergre',
    qoute: "Life is what happens when you're busy making other plans.",
    liked: false,
    fav: false,
    likes: 900000,

    author: 'Anonymous',
    image:
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/home-quotes-v2-albanian-to-austen2-1659715834.jpg',
  },
];
