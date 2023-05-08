import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, FAB_style } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import moment from 'moment';
import Collapsible from 'react-native-collapsible';
import SwipeableFlatList from 'react-native-swipeable-list';
import debounnce from '../../../functions/debounce';
// fro API calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import analytics from '@react-native-firebase/analytics';
import LoginAlert from '../../../Components/LoginAlert';

import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Admob_Ids } from '../../../Utilities/AdmobIds';
const screen_size = Dimensions.get('window');
//icons

const ic_notes = require('../../../Assets/Icons/notes.png');
const ic_text = require('../../../Assets/Icons/text.png');
const ic_mic = require('../../../Assets/Icons/microphone-black-shape.png');
const ic_image = require('../../../Assets/Icons/image.png');
const ic_list = require('../../../Assets/Icons/list.png');
const ic_grid = require('../../../Assets/Icons/grid.png');
const ic_search = require('../../../Assets/Icons/search.png');
const ic_filter = require('../../../Assets/Icons/filter.png');
const ic_cross = require('../../../Assets/Icons/cross.png');
const il_emptyNotes = require('../../../Assets/illustractions/notesEmpty.png');
const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');

const limit = 10;
let pageNumber = 0;
let canLoadMore = false;
let startDate = '';
let endDate = '';
let selectedColors = [];

const List = props => {

  const { navigation } = props;
  const { Token, dashboardData, setDashBoardData, notesList, setNotesList } = useContext(Context);
  const searchTextRef = useRef();
  // const [list, setList] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [adError, setAdError] = useState(false);

  const onNoteEditorScreen = () => {
    if (Token) {
      navigation.navigate(screens.noteEditor);
    } else {
      onLoginScreen();
    }
  };

  React.useEffect(() => {
    if (Token) {
      console.log(props.route, 'props.route');
      if (!!props.route?.params?.filter) {
        let { filter } = props.route.params;
        startDate = filter?.date.start;
        endDate = filter?.date.end;
        selectedColors = filter?.selectedColors;
        pageNumber = 0;
        setisLoading(true);
        api_listNotes({
          search: searchText.trim(),
          date_from: startDate,
          date_to: endDate,
          color: JSON.stringify(selectedColors.map(x => x.dark)),
        });
      }

      if (!!props.route?.params?.deleteId) {
        deleteLocallyfromList(props.route?.params?.deleteId);
      }
      if (!!props.route?.params?.addNew) {
        setNotesList(prev => [props.route?.params?.addNew, ...prev]);
      }
    } else {
      setNotesList([])
    }
  }, [props.route]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboardVisible(true) });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboardVisible(false) });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const searchFromAPI = text => {
    setSearchText(text);
    performDebounce(text);
  };

  const onLoginScreen = () => {
    LoginAlert(props.navigation, props.route?.name);
  };

  const performDebounce = debounnce(text => {
    api_listNotes({
      search: text.trim(),
      date_from: startDate,
      date_to: endDate,
      color: JSON.stringify(selectedColors.map(x => x.dark)),
    });
  }, 800);
  //todo ///////// API;s

  const call_api_listNotes = () => {
    setisLoading(true);
    api_listNotes({
      search: searchText.trim(),
      date_from: startDate,
      date_to: endDate,
      color: JSON.stringify(selectedColors.map(x => x.dark)),
    });
  };

  const api_listNotes = async body => {
    let res = await invokeApi({
      path: `api/note/get_notes?page=0&limit=${limit}`,
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setisLoadingMore(false);
    if (res) {
      if (res.code == 200) {
        // let arr = [];
        // res.notes.forEach(async element => {
        //   let plainDescription = '';
        //   if (element.description) {
        //     plainDescription = await element?.description.slice(50);
        //   }
        //   arr.push({...element, plainDescription});
        // });
        // console.log('arr', arr);
        setNotesList(res.notes);
        pageNumber = 1;
        if (res.notes.length < res.count) {
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const api_listNotesMore = async body => {
    canLoadMore = false;
    let res = await invokeApi({
      path: `api/note/get_notes?page=${pageNumber}&limit=${limit}`,
      method: 'POST',
      postData: body,
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    setisLoadingMore(false);
    if (res) {
      if (res.code == 200) {
        let total = notesList.length + res.notes.length;
        // let arr = [];
        // res.notes.forEach(async element => {
        //   let plainDescription = '';
        //   if (element.description) {
        //     plainDescription = await element?.description.slice(50);
        //   }
        //   arr.push({...element, plainDescription});
        // });
        setNotesList([...notesList, ...res.notes]);
        pageNumber++;
        if (total < res.count) {
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
      } else {
        showToast(res.message);
      }
    }
  };

  const api_deleteNote = async NoteID => {
    setisLoading(true);
    let res = await invokeApi({
      path: `api/note/delete_note/${NoteID}`,
      method: 'DELETE',
      headers: {
        'x-sh-auth': Token,
      },
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        deleteLocallyfromList(NoteID);
        setisLoading(false);
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  const deleteLocallyfromList = async noteID => {
    let arr = [...notesList];
    let index = arr.findIndex(x => x._id === noteID);
    if (index !== -1) {
      arr.splice(index, 1);
      await deleteDashBoardNotes(noteID, arr)
      setNotesList(arr);
    }
  };

  const deleteDashBoardNotes = async (id, arr) => {
    let tempArr = [...dashboardData.notes]
    let idx = tempArr.findIndex(x => x._id == id)
    if (idx != -1) {
      tempArr = []

      if (arr[0] != undefined) {
        tempArr.push(arr[0])
      }
      if (arr[1] != undefined) {
        tempArr.push(arr[1])
      }
      console.log(tempArr, "new Arr......")
    }
    await setDashBoardData({
      ...dashboardData,
      notes: [...tempArr]
    })
  }

  useEffect(() => {
    if (Token) {
      pageNumber = 0;
      canLoadMore = false;
      startDate = '';
      endDate = '';
      selectedColors = [];
      call_api_listNotes();
    }
  }, [Token]);

  useEffect(() => {
    analytics().logEvent(props?.route?.name);
  }, []);

  const updateNote = item => {
    let arr = [...notesList];
    let index = arr.findIndex(x => x._id == item._id);
    if (index > -1) {
      arr.splice(index, 1, item);
      setNotesList(arr);
    }
  };

  const extractText = useMemo(i => {
    if (!!notesList[i]?.description) {
      return notesList[i]?.description.replace(/<\/?[^>]+(>|$)/g, '');
    }
  }, []);

  const flatListRenderItem = useCallback(
    ({ item, index }) => {
      let regex = /<p(?:\sclass="[^"]+")?>([^(?:<\/p)]+)<\/p>/;

      return (
        <Pressable
          onPress={() =>
            navigation.navigate(screens.notesDetail, {
              note: item,
              updateNote,
            })
          }
          style={{
            // flex: 1,
            marginTop: 20,
            width: '95%',
            alignSelf: 'center',
            // height:200,
          }}>
          <View
            style={{
              backgroundColor: item?.color?.light,
              alignItems: 'center',
              paddingVertical: 15,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: item?.color?.dark,
              flexDirection: 'row',
              paddingHorizontal: 30,
              // height: 100,
            }}>
            <View>
              <Image
                source={ic_notes}
                style={{ height: 40, width: 40, tintColor: item?.color.dark }}
              />
            </View>
            <View
              style={{
                marginLeft: 20,
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={{ fontFamily: font.bold, fontSize: 18 }}>
                {item.title}
              </Text>

              {/* {!!item?.description && (
                <AutoHeightWebView
                  style={{height: 32}}
                  source={{html: item?.description}}
                  scrollEnabled={false}
                  javaScriptEnabled={true}
                  viewportContent={'width=device-width, user-scalable=no'}
                  // customScript={`document.getElementsByTagName("*").style.font-family ="'Verdana', sans-serif"`}
                  customScript={`let length = document.getElementsByTagName("*").length;
                  for(let i=0; i<length;i++){
                  document.getElementsByTagName("*")[i].style.color = "black";
                  // document.getElementsByTagName("*")[i].style.font-size = "14px";
                  }`}
  
                    customStyle={`
                    *{
                      font-family: 'Verdana', sans-serif;
                      font-size: 12px;
                      // color:'black' !important;
                    },
                    p{
                      font-family: 'Verdana', sans-serif;
                      font-size: 12px;
                      // color:'#000' !important;
                    }
  
                  `}
                />
              )} */}
              {item?.description && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    marginVertical: 2,
                  }}>
                  {/* {item?.description.slice(0, 50)} */}
                  {item?.description.replace(/<[^>]+>/g, '').slice(0, 100)}

                  {/* {item?.description.match(regex)[1]} */}
                  {item?.plainDescription}
                </Text>
              )}
              {(item?.images.length != 0 || item?.audio != '') && (
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: isGridView ? 'center' : 'flex-start',
                    alignItems: 'center',
                    marginTop: 7,
                    minHeight: 15,
                  }}>
                  {item?.images.length != 0 && (
                    <Image
                      source={ic_image}
                      style={{
                        height: 15,
                        width: 15,
                        marginRight: 5,
                        tintColor: Colors.placeHolder,
                      }}
                    />
                  )}
                  {item?.audio != '' && (
                    <Image
                      source={ic_mic}
                      style={{
                        height: 15,
                        width: 15,
                        tintColor: Colors.placeHolder,
                      }}
                    />
                  )}
                </View>
              )}
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: font.regular,
                  fontSize: 10,
                  marginTop: 7,
                  color: Colors.gray10,
                }}>
                <Text>
                  {item?.updatedAt == item?.createdAt
                    ? 'Created on : '
                    : 'Updated on : '}
                </Text>
                {moment(item?.updatedAt).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [notesList],
  );

  const flatListEmptyComponent = () => {
    if (isLoading == false)
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,

            // marginTop: isIphoneX() ? -screen_size.height * 0.2 : 0,
          }}>
          <Image
            source={il_emptyNotes}
            style={{
              marginTop: 30,
              width: screen_size.width * 0.65,
              height: screen_size.width * 0.65,
            }}
          />
          <Text
            style={{
              fontFamily: font.xbold,
              fontSize: 42,
              marginTop: 20,
            }}>
            No Notes
          </Text>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 16,
              marginTop: 15,
              color: Colors.placeHolder,
              width: '80%',
              textAlign: 'center',
            }}>
            Create fully customisable notes. Add colors of your own choice. Add
            voice notes, images and many more.
          </Text>
          {!isSearchVisible &&
            startDate == '' &&
            endDate == '' &&
            selectedColors.length == 0 && (
              <View style={{ justifyContent: 'center' }}>
                <Pressable
                  onPress={onNoteEditorScreen}
                  style={[
                    FAB_style.View,
                    {
                      position: 'relative',
                      marginTop: 50,
                      right: 0,
                      height: 71,
                      width: 71,
                      borderRadius: 71 / 2,
                    },
                  ]}>
                  <Image
                    source={require('../../../Assets/Icons/plus.png')}
                    style={FAB_style.image}
                  />
                </Pressable>
              </View>
            )}
        </View>
      );
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
      <Header
        navigation={navigation}
        // titleAlignLeft
        title={'Notes'}
        rightIcon2={ic_filter}
        rightIcon={ic_search}
        rightIcononPress={() => {
          if (Token) {
            if (isSearchVisible) {
              setIsSearchVisible(false);
              searchTextRef?.current?.blur();
              console.log(searchTextRef.current);
            } else {
              setIsSearchVisible(true);
              searchTextRef?.current?.focus();
            }
          } else {
            onLoginScreen();
          }
        }}
        rightIcon2onPress={() => {
          if (Token) {
            props.navigation.navigate(screens.notesFilter, {
              filter: { startDate, endDate, selectedColors },
            });
          } else {
            onLoginScreen();
          }
        }}
      />

      <View style={{ flex: 1, backgroundColor: Colors.white }}>

        <Collapsible collapsed={!isSearchVisible}>
          <View
            style={{
              height: 50,
              backgroundColor: Colors.background,
              paddingLeft: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              ref={searchTextRef}
              placeholder="Search..."
              style={{ flex: 1, height: '100%', fontSize: 16 }}
              onChangeText={searchFromAPI}
              value={searchText}
            />
            <Pressable
              onPress={() => {
                setIsSearchVisible(false);
                setSearchText('');
                searchFromAPI('');
              }}
              style={{ alignItems: 'center' }}>
              <View
                style={{
                  // backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderRadius: 25,
                }}>
                <Image source={ic_cross} style={{ height: 20, width: 20 }} />
              </View>
            </Pressable>
          </View>
        </Collapsible>

        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          <SwipeableFlatList
            contentContainerStyle={[
              notesList.length == 0 && {
                flex: 1,
              },
              {
                paddingBottom: 70,
              },
            ]}
            keyExtractor={item => {
              return item._id;
            }}
            // maxToRenderPerBatch={20}
            showsVerticalScrollIndicator={false}
            // shouldBounceOnMount={true}
            maxSwipeDistance={70}
            data={notesList}
            renderItem={flatListRenderItem}
            ListEmptyComponent={flatListEmptyComponent}
            renderQuickActions={({ item, index }) => {
              return (
                <Pressable
                  key={item._id}
                  onPress={() =>
                    Alert.alert(
                      'Delete Note',
                      'Are you sure you want to delete this Note',
                      [
                        { text: 'No' },
                        { text: 'Yes', onPress: () => api_deleteNote(item._id) },
                      ],
                      { cancelable: true },
                    )
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    // justifyContent: 'center',
                    // marginHorizontal: 20,
                    // backgroundColor: Colors.delete,
                    backgroundColor: Colors.lightRed2,
                    borderRadius: 20,
                    // borderBottomEndRadius: 20,
                    // paddingRight: 20,

                    flex: 1,
                    // height:"100%",
                    width: '94%',
                    alignSelf: 'center',
                    marginTop: 20,
                    // margin: 20,
                    paddingRight: 20,
                    // paddingHorizontal: 20,
                  }}>
                  <Image
                    source={require('../../../Assets/Icons/trash.png')}
                    style={{ height: 25, width: 25, tintColor: Colors.white }}
                  />
                </Pressable>
              );
            }}
            onEndReached={() => {
              if (canLoadMore) {
                setisLoadingMore(true);
                api_listNotesMore({
                  search: searchText.trim(),
                  date_from: startDate,
                  date_to: endDate,
                  color: JSON.stringify(selectedColors.map(x => x.dark)),
                });
              }
            }}
            ListFooterComponent={
              isLoadingMore && (
                <View style={{ height: 100, justifyContent: 'center' }}>
                  <ActivityIndicator color={Colors.primary} size="small" />
                </View>
              )
            }
          />
          {notesList.length != 0 && isKeyboardVisible == false && (
            <Pressable
              onPress={onNoteEditorScreen}
              style={[FAB_style.View, { borderRadius: 50 / 2 }]}>
              <Image
                source={require('../../../Assets/Icons/plus.png')}
                style={FAB_style.image}
              />
            </Pressable>
          )}
        </View>

        <Loader enable={isLoading} />

        {adError == false && isKeyboardVisible == false && (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
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

        {/* {filterModal()} */}
      </View>
    </SafeAreaView>
  );
};

export default List;
