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
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {
  mainStyles,
  allHabit_styles,
  FAB_style,
  stat_styles
} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
import {notesColors} from '../../../Utilities/Colors';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modal';
import CustomButton from '../../../Components/CustomButton';

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
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState(1);
  const onNoteEditorScreen = () => {
    navigation.navigate(screens.noteEditor);
  };

  React.useEffect(() => {
    if (!!props.route?.params?.updated) {
      setList(notes);
    }
  }, [props.route]);

  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
  };

  const flatListRenderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <View
          style={{
            backgroundColor: item?.colors?.light,
            alignItems: 'center',
            paddingVertical: 20,
            borderRadius: 20,
            borderWidth: 1 / 4,
            borderColor: item?.colors?.dark,
            flexDirection: 'row',
            paddingHorizontal: 30,
            height: 100,
          }}>
          <View>
            <Image
              source={ic_notes}
              style={{height: 60, width: 60, tintColor: item?.colors.dark}}
            />
          </View>
          <View
            style={{
              marginLeft: 20,
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={{fontFamily: font.bold, fontSize: 18}}>
              {item.title}
            </Text>
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
              style={{fontFamily: font.regular, fontSize: 12, marginTop: 7}}>
              {moment().subtract(index, 'days').format('DD-MM-YYYY')}
            </Text>
          </View>
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

  const filterModal = () => {
    return (
      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={isFilterVisible}
        useNativeDriverForBackdrop={true}
        style={{margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            // marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
            // alignItems: 'center',
            // paddingTop: 40,
            // paddingBottom: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
              }}
            />

            <View style={{flex: 1}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: font.bold,
                  fontSize: 16,
                }}>
                Filter
              </Text>
            </View>
            <View>
              <Pressable
                onPress={() => {
                  setFilterVisible(false);
                }}
                style={{alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: '#BDC3C744',
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 25,
                  }}>
                  <Image source={ic_cross} style={{height: 20, width: 20}} />
                </View>
              </Pressable>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Pressable
              onPress={() => setFilterOption(1)}
              style={[stat_styles.filterButtonView, {marginTop: 0}]}>
              <Text style={stat_styles.filterButtonText}>This Week</Text>
              <Image
                source={filterOption == 1 ? checked : unChecked}
                style={stat_styles.filterButtonIcon}
              />
            </Pressable>

            <Pressable
              onPress={() => setFilterOption(2)}
              style={stat_styles.filterButtonView}>
              <Text style={stat_styles.filterButtonText}>This Month</Text>
              <Image
                source={filterOption == 2 ? checked : unChecked}
                style={stat_styles.filterButtonIcon}
              />
            </Pressable>

            <Pressable
              onPress={() => setFilterOption(3)}
              style={stat_styles.filterButtonView}>
              <Text style={stat_styles.filterButtonText}>Select Dates</Text>
              <Image
                source={filterOption == 3 ? checked : unChecked}
                style={stat_styles.filterButtonIcon}
              />
            </Pressable>

            {/* <Collapsible collapsed={filterOption == 3 ? false : true}>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                  <CustomTouchableTextInput
                    onPress={() =>
                      setDateRange({...dateRange, startDateModal: true})
                    }
                    lable="From"
                    height={45}
                    lableBold
                    lableColor={Colors.black}
                    value={moment(dateRange.startDate).format('DD MMM YYYY')}
                  />
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  <CustomTouchableTextInput
                    onPress={() =>
                      setDateRange({...dateRange, endDateModal: true})
                    }
                    height={45}
                    lable="To"
                    lableBold
                    lableColor={Colors.black}
                    value={moment(dateRange.endDate).format('DD MMM YYYY')}
                  />
                </View>
              </View>
            </Collapsible> */}

            <View style={{marginTop: 10}}>
              <CustomButton onPress={()=>{}} title="Apply" height={45} />
            </View>
          </View>
        </View>
      </Modal>
    );
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
        rightIcon2onPress={() => setFilterVisible(!isFilterVisible)}
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
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={
              (list.length == 0 && {
                flex: 1,
              },
              {
                paddingTop: 5,
              })
            }
            data={filterAndSearch(list)}
            // key={isGridView ? 2 : 1}
            // numColumns={isGridView ? 2 : 1}
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
        {filterModal()}
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
