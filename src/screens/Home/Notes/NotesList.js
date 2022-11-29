import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {
  mainStyles,
  allHabit_styles,
  FAB_style,
} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
import {notesColors} from '../../../Utilities/Colors';
import {isIphoneX} from 'react-native-iphone-x-helper';

const screen_size = Dimensions.get('window');
//icons

const ic_notes = require('../../../Assets/Icons/notes.png');
const ic_text = require('../../../Assets/Icons/text.png');
const ic_mic = require('../../../Assets/Icons/microphone-black-shape.png');
const ic_image = require('../../../Assets/Icons/image.png');
const ic_list = require('../../../Assets/Icons/list.png');
const ic_grid = require('../../../Assets/Icons/grid.png');
const il_emptyNotes = require('../../../Assets/illustractions/notesEmpty.png');
const List = props => {
  const {navigation} = props;
  const [list, setList] = useState([]);
  const [isGridView, setGridView] = useState(true);

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
      <View
        style={{
          flex: isGridView ? 1 / 2 : 1,
          paddingLeft: isGridView ? (index % 2 == 0 ? 20 : 10) : 20,
          paddingRight: isGridView ? (index % 2 != 0 ? 20 : 10) : 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <View
          style={{
            backgroundColor: item?.colors?.light,
            alignItems: 'center',
            paddingVertical: isGridView ? 30 : 20,
            borderRadius: 20,
            borderWidth: 1 / 4,
            borderColor: item?.colors?.dark,
            flexDirection: isGridView ? 'column' : 'row',
            paddingHorizontal: 30,
          }}>
          <View>
            <Image
              source={ic_notes}
              style={{height: 50, width: 50, tintColor: item?.colors.dark}}
            />
          </View>
          <View
            style={{
              marginTop: isGridView ? 20 : 0,
              marginLeft: isGridView ? 0 : 10,
            }}>
            <Text style={{fontFamily: font.bold, fontSize: 18}}>
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: isGridView ? 'center' : 'flex-start',
                alignItems: 'center',
                marginTop: 10,
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
          </View>
        </View>
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
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header
        navigation={navigation}
        titleAlignLeft
        title={'Notes'}
        rightIcon={list.length == 0 ? null : isGridView ? ic_list : ic_grid}
        rightIcononPress={() => setGridView(prev => !prev)}
      />
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={
            list.length == 0 && {
              flex: 1,
            }
          }
          data={list}
          key={isGridView ? 2 : 1}
          numColumns={isGridView ? 2 : 1}
          renderItem={flatListRenderItem}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  // marginTop: isIphoneX ? -screen_size.height * 0.2 : 0,
                }}>
                <Image
                  source={il_emptyNotes}
                  style={{
                    width: screen_size.width * 0.65,
                    height: screen_size.width * 0.65,
                  }}
                />
                <Text
                  style={{fontFamily: font.xbold, fontSize: 42, marginTop: 30}}>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut
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
          }}
        />
        {list.length != 0 && (
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
    </SafeAreaView>
  );
};

export default List;

const notes = [
  {
    _id: '1',
    title: 'Office',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    audio: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    ],
    images: [
      'https://picsum.photos/seed/picsum/400/400',
      'https://picsum.photos/seed/picsum/400/400',
    ],
    colors: notesColors[1],
  },

  {
    _id: '3',
    title: 'Home',
    description: '',
    audio: [
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    audio: [],
    images: [],
    colors: notesColors[3],
  },
];
