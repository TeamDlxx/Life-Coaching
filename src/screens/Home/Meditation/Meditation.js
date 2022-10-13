import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomImage from '../../../Components/CustomImage';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';

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
import anxious from '../../../Assets/meditationIcons/anxious.png';
import breathe from '../../../Assets/meditationIcons/breathe.png';
import focus from '../../../Assets/meditationIcons/focus.png';
import morning from '../../../Assets/meditationIcons/morning.png';
import sleep from '../../../Assets/meditationIcons/sleep.png';
import favList from '../../../Assets/Icons/favList.png';

const Meditation = props => {
  const {Token} = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});

  //? Navigation Functions

  const gotoTrackPlayer = item => {
    props.navigation.navigate(screens.trackPlayer, {
      item: item,
      category: selectedCategory,
    });
  };

  // todo /////// API's

  const call_categoryAPI = () => {
    setisLoading(true);
    api_CategoryWithTracksList();
  };

  const refresh_categoryAPI = () => {
    setRefreshing(true);
    api_CategoryWithTracksList();
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
    if (res) {
      if (res.code == 200) {
        console.log('response', res);
        setCategoryList(res?.category);
        if (res?.category.length > 0) {
          setSelectedCategory(res?.category[0]);
        }
      } else {
        showToast(res.message);
      }
    }
  };

  //* UseEffect

  useEffect(() => {
    call_categoryAPI();
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
              item._id == selectedCategory?._id ? Colors.primary : Colors.white,
            paddingHorizontal: 15,
            height: 60,
            width: 60,
          }}>
          <View>
            <CustomImage
              style={
                item._id == selectedCategory?._id
                  ? {width: 30, height: 30, tintColor: Colors.white}
                  : {width: 30, height: 30}
              }
              source={{uri: fileURL + item?.images?.small}}
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
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  const renderTrackList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoTrackPlayer(item);
        }}
        activeOpacity={1}
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
              style={{
                fontFamily: font.medium,
                color: Colors.text,
                fontSize: 12,
              }}>
              {item.note}
            </Text>
          </View>
        </View>
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={1}
            style={{padding: 10}}
            //   onPress={() => checkboxButton(item)}
          >
            <TouchableOpacity
              onPress={() => {
                gotoTrackPlayer(item);
              }}
              style={{
                width: 35,
                height: 35,
                backgroundColor: Colors.white,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: Colors.primary,
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 5,
              }}>
              <Image
                style={{
                  height: 18,
                  width: 18,
                  //   tintColor:Colors.primary
                }}
                source={play}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const flatListHeader = () => {
    return (
      <View style={{paddingHorizontal: 20, backgroundColor: Colors.background}}>
        <View style={{marginHorizontal: -20, marginTop: 0}}>
          <FlatList
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}
            data={categoryList}
            horizontal={true}
            renderItem={renderCategories}
          />
        </View>
        <View style={{marginTop: 5, marginBottom: 25}}>
          {/* <Text style={other_style.labelText}>All Habits</Text> */}
        </View>
      </View>
    );
  };

  const onFavList = () => {
    props.navigation.navigate(screens.favTracks);
  };
  // Modal

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
        rightIcononPress={onFavList}
      />
      <View style={mainStyles.innerView}>
        <View style={{flex: 1, marginHorizontal: -20}}>
          <FlatList
            listKey="main"
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={flatListHeader()}
            contentContainerStyle={{paddingVertical: 10, paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
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
              />
            }
            ListEmptyComponent={
              isLoading == false && (
                <EmptyView title="No tracks for this category" />
              )
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Meditation;
let terbcd = {
  _id: '634672ea6a598f42f8cbb9e2',
  name: 'c1',
  images: {
    large: 'HABIT/e3fa30c0-43cb-11ed-b6d8-e1cced6e1241.jpg',
    medium: 'HABIT/e3faf410-43cb-11ed-b6d8-e1cced6e1241.jpg',
    small: 'HABIT/e3fb1b20-43cb-11ed-b6d8-e1cced6e1241.jpg',
  },
  status: true,
  order: 1,
  category_track: [
    {
      _id: '6346730b6a598f42f8cbb9e4',
      name: 't1',
      audio: 'audio/af19fa60-4557-11ed-836d-cdef7cfc246c.mp3',
      duration: 635.87,
      images: {
        large: '',
        medium: '',
        small: '',
      },
    },
  ],
  load_more_url: '',
};
