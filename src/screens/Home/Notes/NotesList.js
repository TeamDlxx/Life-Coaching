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
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, FAB_style} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import moment from 'moment';
import {notesColors} from '../../../Utilities/Colors';
import Collapsible from 'react-native-collapsible';
import AutoHeightWebView from 'react-native-autoheight-webview';
import SwipeableFlatList from 'react-native-swipeable-list';

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

const List = props => {
  const {navigation} = props;
  const [list, setList] = useState(notes);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [searchText, setSearchText] = useState('');

  const onNoteEditorScreen = () => {
    navigation.navigate(screens.noteEditor);
  };

  React.useEffect(() => {
    if (!!props.route?.params?.updated) {
      setList(notes);
    }
  }, [props.route]);

  const flatListRenderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate(screens.notesDetail, {
            note: item,
          })
        }
        style={{
          flex: 1,
          // paddingLeft: 20,
          // paddingRight: 20,
          // paddingHorizontal: 20,
          // paddingTop: 20,
          // marginHorizontal:20,
          marginTop: 20,
          width: '95%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            backgroundColor: item?.colors?.light,
            alignItems: 'center',
            paddingVertical: 15,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: item?.colors?.dark,
            flexDirection: 'row',
            paddingHorizontal: 30,
            // height: 100,
          }}>
          <View>
            <Image
              source={ic_notes}
              style={{height: 40, width: 40, tintColor: item?.colors.dark}}
            />
          </View>
          <View
            style={{
              marginLeft: 20,
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text style={{fontFamily: font.bold, fontSize: 18}}>
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
                {item?.description.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
            )}
            {(item?.images.length != 0 || item?.audio.length != 0) && (
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
                {item?.audio.length != 0 && (
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
              {moment().subtract(index, 'days').format('DD-MM-YYYY')}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const flatListEmptyComponent = () => {
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
            width: screen_size.width * 0.65,
            height: screen_size.width * 0.65,
          }}
        />
        <Text
          style={{
            fontFamily: font.xbold,
            fontSize: 42,
            marginTop: 30,
          }}>
          No Notes
        </Text>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: 16,
            marginTop: 20,
            color: Colors.placeHolder,
            width: '80%',
            textAlign: 'center',
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut
        </Text>
        <View style={{flex: 0.5, justifyContent: 'center'}}>
          <Pressable
            onPress={onNoteEditorScreen}
            style={[
              FAB_style.View,
              {
                position: 'relative',
                marginTop: 30,
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
      </View>
    );
  };

  const filterAndSearch = list => {
    let newArray = [];
    let text = searchText.trim().toLowerCase();
    if (text == '') {
      newArray = list;
    } else newArray = list.filter(x => x.title.toLowerCase().includes(text));

    return newArray;
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          // backgroundColor: isSearchVisible ? Colors.background : Colors.white,
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
      <Header
        navigation={navigation}
        titleAlignLeft
        title={'Notes'}
        rightIcon2={ic_filter}
        rightIcon={ic_search}
        rightIcononPress={() => setIsSearchVisible(!isSearchVisible)}
        rightIcon2onPress={() => props.navigation.navigate(screens.notesFilter)}
        // toggleSearch={toggleSearch}

        // rightIcon={list.length == 0 ? null : isGridView ? ic_list : ic_grid}
        // rightIcononPress={() => setGridView(prev => !prev)}
      />

      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Collapsible collapsed={!isSearchVisible}>
          <View
            style={{
              // flex: 1,
              height: 50,
              // paddingRight: 20,
              backgroundColor: Colors.background,
              // paddingHorizontal: 20,
              paddingLeft: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Search..."
              style={{flex: 1, height: '100%', fontSize: 16}}
              onChangeText={text => setSearchText(text)}
              value={searchText}
            />
            <Pressable
              onPress={() => {
                setIsSearchVisible(false);
                setSearchText('');
              }}
              style={{alignItems: 'center'}}>
              <View
                style={{
                  // backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // borderRadius: 25,
                }}>
                <Image source={ic_cross} style={{height: 20, width: 20}} />
              </View>
            </Pressable>
          </View>
        </Collapsible>
        <View style={{flex: 1, paddingHorizontal: 5}}>
          <SwipeableFlatList
            contentContainerStyle={[
              filterAndSearch(list).length == 0 && {
                flex: 1,
              },
              {
                // paddingTop: 5,
              },
            ]}
            keyExtractor={item => {
              return item._id;
            }}
            shouldBounceOnMount={true}
            maxSwipeDistance={70}
            data={filterAndSearch(list)}
            renderItem={flatListRenderItem}
            ListEmptyComponent={flatListEmptyComponent}
            renderQuickActions={({item, index}) => {
              return (
                <Pressable
                  key={item._id}
                  onPress={() =>
                    Alert.alert(
                      'Delete Note',
                      'Are you sure you want to delete this Note',
                      [{text: 'No'}, {text: 'Yes'}],
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
                    style={{height: 25, width: 25, tintColor: Colors.white}}
                  />
                </Pressable>
              );
            }}
          />
          {filterAndSearch(list).length != 0 && (
            <Pressable
              onPress={onNoteEditorScreen}
              style={[FAB_style.View, {borderRadius: 50 / 2}]}>
              <Image
                source={require('../../../Assets/Icons/plus.png')}
                style={FAB_style.image}
              />
            </Pressable>
          )}
        </View>
        {/* {filterModal()} */}
      </View>
    </SafeAreaView>
  );
};

export default List;

const notes = [
  {
    _id: '1',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    description:
      "<div><p style='color:orange'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div>",
    audio: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    ],
    images: ['https://picsum.photos/seed/picsum/400/400'],
    colors: notesColors[0],
  },

  {
    _id: '2',
    title: 'Work',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    audio: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    ],
    images: [
      'https://picsum.photos/id/203/300/300',
      'https://picsum.photos/id/212/300/300',
      'https://picsum.photos/id/213/300/300',
      'https://picsum.photos/id/222/300/300',
      'https://picsum.photos/id/215/300/300',
      'https://picsum.photos/id/233/300/300',
      'https://picsum.photos/id/223/300/300',
      'https://picsum.photos/id/220/300/300',
    ],
    colors: notesColors[1],
  },

  {
    _id: '3',
    title: 'Home',
    description: '',
    audio: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    ],
    images: [
      'https://picsum.photos/seed/picsum/400/400',
      'https://picsum.photos/seed/picsum/400/400',
    ],
    colors: notesColors[2],
  },

  {
    _id: '4',
    title: 'Extra',
    description:
      '<div><ul><li><font color="#ff0000">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque. Duis at tellus at urna condimentum. Morbi tincidunt ornare massa eget egestas purus. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Nec dui nunc mattis enim ut. Sed odio morbi quis commodo odio. Pellentesque habitant morbi tristique senectus et netus et. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Donec enim diam vulputate ut pharetra sit amet aliquam. Risus feugiat in ante metus dictum at. Nibh praesent tristique magna sit amet purus gravida quis. In eu mi bibendum neque egestas congue quisque egestas diam. Nunc id cursus metus aliquam. Neque aliquam vestibulum morbi blandit. Suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Leo integer malesuada nunc vel. Semper auctor neque vitae tempus.</font><ul><li></div>',
    audio: [],
    images: [],
    colors: notesColors[3],
  },
];
