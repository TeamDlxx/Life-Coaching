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
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, allHabit_styles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
import Modal from 'react-native-modal';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import ColorPicker from 'react-native-wheel-color-picker';

//icons
const ic_pallete = require('../../../Assets/Icons/palette.png');
const ic_cross = require('../../../Assets/Icons/cross.png');
const ic_save = require('../../../Assets/Icons/tick.png');

const Editor = props => {
  const {navigation} = props;
  const RichText = React.useRef();
  const colorPicker = React.useRef();
  const [notes, updateNotes] = useState({
    title: '',
    note: '',
    images: [],
    audio: [],
  });

  const [colorPickerModal, updateColorPickerModal] = useState({
    visibility: false,
    currentColor: '#000000',
  });

  const setColorPickerModal = val =>
    updateColorPickerModal({...colorPickerModal, ...val});

  React.useEffect(() => {
    console.log(RichText?.current, '..rich text');
  }, []);

  console.log(RichText?.current?._focus, '...focus');
  const ColorPickerModal = () => {
    return (
      <Modal
        isVisible={colorPickerModal.visibility}
        onBackdropPress={() => setColorPickerModal({visibility: false})}
        onBackButtonPress={() => setColorPickerModal({visibility: false})}
        style={{}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: '#fff',
            borderRadius: 15,
            marginHorizontal: -10,
          }}>
          <Pressable
            onPress={() => setColorPickerModal({visibility: false})}
            style={{
              alignSelf: 'flex-end',
              padding: 5,
              backgroundColor: Colors.gray01,
              borderRadius: 999,
              margin: 10,
            }}>
            <Image source={ic_cross} style={{height: 25, width: 25}} />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            {myColors.map(item => (
              <Pressable
                style={{
                  height: 35,
                  width: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}
                onPress={() => {
                  RichText?.current.sendAction('foreColor', 'result', item);
                  setColorPickerModal({currentColor: item});
                }}>
                <View
                  style={{
                    backgroundColor: item,
                    height: colorPickerModal.currentColor === item ? 35 : 30,
                    width: colorPickerModal.currentColor === item ? 35 : 30,
                    borderRadius: 999,
                    borderColor:
                      colorPickerModal.currentColor === item
                        ? Colors.primary
                        : Colors.gray08,
                    borderWidth: 1.5,
                  }}
                />
              </Pressable>
            ))}
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
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header
        titleAlignLeft
        navigation={navigation}
        title={'Add Note'}
        rightIcon={ic_save}
        rightIcononPress={() =>
          props.navigation.navigate({
            name: screens.notesList,
            params: {
              updated: true,
            },
            merge: true,
          })
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 97 : 0}
          enabled={true}
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <>
            <View style={{flex: 1}}>
              <View
                style={{
                  paddingTop: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.gray01,
                }}>
                <TextInput
                  style={{
                    fontSize: 16,
                    fontFamily: font.bold,
                    paddingBottom: 3,
                  }}
                  placeholder="Title"
                  selectionColor={Colors.primary}
                />
              </View>

              <View
                style={{
                  borderRadius: 10,
                  // backgroundColor: Colors.gray01,
                  overflow: 'hidden',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    // backgroundColor: Colors.gray01,
                    minHeight: 150,
                  }}>
                  <RichEditor
                    ref={RichText}
                    style={{
                      borderRadius: 10,
                      // backgroundColor: Colors.gray01,
                    }}
                    initialHeight={150}
                    editorStyle={{
                      // backgroundColor: Colors.gray01,
                      // color: Colors.primary,
                      caretColor: Colors.primary,
                      // fontFamily: font.light,
                    }}
                    setDisplayZoomControls={true}
                    initialContentHTML={notes.note}
                    useContainer={true}
                    placeholder={"What's in your mind"}
                    // onChange={text => this.setState({decription: text})}
                    androidLayerType="software"
                    androidHardwareAccelerationDisabled
                  />
                </View>
              </View>
            </View>
            <RichToolbar
              editor={RichText}
              // onInsertLink={() => this.openDialogue()}
              // editor={this[`TextEditor`]}

              actions={[
                // ...defaultActions,
                actions.keyboard,
                // actions.hiliteColor,
                actions.undo,
                actions.redo,
                actions.foreColor,
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.removeFormat,
                // actions.insertLink,
                // actions.setSubscript,
                // actions.setSuperscript,
                // actions.setStrikethrough,
                actions.insertBulletsList,
                actions.insertOrderedList,
                // actions.setParagraph,
                // actions.heading1,
                // actions.heading2,
                // actions.heading3,
                // actions.heading4,
                // actions.heading5,
                // actions.heading6,
                // actions.line,
                // actions.alignLeft,
                // actions.alignCenter,
                // actions.alignRight,
                // actions.alignFull,
                // actions.outdent,
                // actions.indent,
                // actions.blockquote,
              ]}
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                // position: 'absolute',
                // bottom: 0,
              }}
              iconTint={Colors.placeHolder}
              iconMap={{
                [actions.foreColor]: ({tintColor}) => (
                  <Pressable
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => setColorPickerModal({visibility: true})}>
                    <Image
                      source={ic_pallete}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: Colors.placeHolder,
                      }}
                    />
                  </Pressable>
                ),
              }}
              selectedIconTint={Colors.primary}
            />
          </>
        </KeyboardAvoidingView>
        {ColorPickerModal()}
      </View>
    </SafeAreaView>
  );
};

export default Editor;

const myColors = [
  '#FFFFFF',
  '#000000',
  '#C0C0C0',
  '#808080',
  '#008000',
  '#00FF00',
  '#800000',
  '#FF0000',
  '#000080',
  '#0000FF',
  '#008080',
  '#00FFFF',
  '#FF00FF',
  '#800080',
  '#FFFF00',
];
