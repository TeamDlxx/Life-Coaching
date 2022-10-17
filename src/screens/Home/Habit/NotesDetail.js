import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Header from '../../../Components/Header';
import Colors, {Bcolors} from '../../../Utilities/Colors';
import {mainStyles, createHabit_styles} from '../../../Utilities/styles';
import {CustomMultilineTextInput} from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CustomImage from '../../../Components/CustomImage';

// For API's calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import Toast from 'react-native-toast-message';

const NotesDetail = props => {
  const {Token, habitList, setHabitList} = useContext(Context);
  const {params} = props.route;
  const detailNoteMenu = useRef();
  const [habit, sethabit] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState({
    modalVisible: false,
    text: '',
  });
  const updateNote = updation => setNote({...note, ...updation});
  const noteText = habit?.notes.find(
    x => moment(x.date).format('DDMMYYYY') == moment(date).format('DDMMYYYY'),
  );
  console.log('noteText', noteText);

  const dropDownMenu = () => {
    return (
      <Menu
        style={{
          backgroundColor: Colors.white,
        }}
        ref={detailNoteMenu}
        onRequestClose={() => detailNoteMenu?.current.hide()}
        anchor={
          <TouchableHighlight
            onPress={() => detailNoteMenu?.current.show()}
            underlayColor={Colors.lightPrimary}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor:'pink',
              borderRadius: 25,
            }}>
            <Image
              source={require('../../../Assets/Icons/threeDots.png')}
              style={{height: 15, width: 15, tintColor: Colors.black}}
            />
          </TouchableHighlight>
        }>
        <MenuItem onPress={editNote}>
          <Text style={{fontFamily: font.bold}}>Edit Note</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            detailNoteMenu?.current.hide();
            deleteNote();
          }}>
          <Text style={{fontFamily: font.bold}}>Mark Uncomplete</Text>
        </MenuItem>
      </Menu>
    );
  };

  const editNote = async () => {
    await detailNoteMenu?.current?.hide();

    setTimeout(() => {
      updateNote({
        text: noteText.note_text,
        modalVisible: true,
      });
    }, 400);
  };

  const editNoteModal = () => {
    return (
      <Modal
        isVisible={note.modalVisible}
        onBackButtonPress={() => updateNote({modalVisible: false})}
        onBackdropPress={() => updateNote({modalVisible: false})}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        hideModalContentWhileAnimating={true}
        style={{marginHorizontal: 5}}>
        <View
          style={{
            marginTop: 'auto',
            backgroundColor: Colors.background,
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
          <View
            style={{
              height: 80,
              width: 80,
              marginTop: -40,
              alignSelf: 'center',
              borderWidth: 10,
              borderColor: Colors.background,
              borderRadius: 40,
              backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{height: 70, width: 70}}
              source={require('../../../Assets/Icons/check.png')}
            />
          </View>
          <View style={{marginTop: 10}}>
            <CustomMultilineTextInput
              lable={note.update == false ? 'Add Note' : 'Edit Note'}
              placeholder={'Please enter a note for completing this Habit'}
              lableBold
              lableColor={Colors.black}
              value={note.text}
              onChangeText={text => updateNote({text: text})}
            />
          </View>
          <View style={{marginTop: 20}}>
            <CustomButton
              height={50}
              onPress={btn_saveChnages}
              title={'Save Changes'}
            />
          </View>
        </View>
        {!!note?.modalVisible && <Toast />}
      </Modal>
    );
  };

  const btn_saveChnages = () => {
    let obj = {
      note_id: noteText._id,
      note_text: note?.text.trim(),
      date: noteText.date,
    };
    api_editNote(obj);
    setisLoading(true);
    setTimeout(() => {
      updateNote({text: '', modalVisible: false, item: null});
    }, 50);
  };

  

  const api_editNote = async obj => {
    let res = await invokeApi({
      path: 'api/habit/edit_note/' + habit?._id,
      method: 'PUT',
      headers: {
        'x-sh-auth': Token,
      },
      postData: obj,
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        if (!!params?.backScreenfunc) {
          params?.backScreenfunc(res.habit);
        }
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
        sethabit(res.habit);
        updateHabitList(res.habit);
      } else {
        showToast(res.message);
      }
    }
  };

  const deleteNote = () => {
    detailNoteMenu?.current.hide();
    Alert.alert(
      'Confirmation',
      'Are you sure you want to uncompleted for this date',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => api_removeNote(),
        },
      ],
    );
  };

  const api_removeNote = async () => {
    setisLoading(true);

    let res = await invokeApi({
      path: 'api/habit/remove_note/' + habit._id,
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: {
        note_id: noteText._id,
      },
      navigation: props.navigation,
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        if (!!params?.backScreenfunc) {
          params?.backScreenfunc(res.habit);
        }
        sethabit(res.habit);
        updateHabitList(res.habit);
        if (!!params?.updateHabit) {
          params?.updateHabit(res.habit);
        }
        setTimeout(() => {
          props.navigation.goBack();
        }, 200);
      } else {
        showToast(res.message);
      }
    }
  };

  const updateHabitList = habit => {
    let newArray = [...habitList];
    let index = newArray.findIndex(x => x._id == habit._id);
    if (index != -1) {
      newArray.splice(index, 1, habit);
      setHabitList(newArray);
    }
  };

  useEffect(() => {
    if (!!params?.habit) {
      sethabit(params?.habit);
    }
    if (!!params?.date) {
      setDate(params?.date);
    }
  }, []);

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      {!!params?.habit && !!params?.date && (
        <>
          <Header
            menu={dropDownMenu}
            navigation={props.navigation}
            title={moment(date).format('DD MMM, YYYY')}
          />
          <View style={{flex: 1, paddingHorizontal: 10}}>
            <Loader enable={isLoading} />
            <ScrollView>
              <View style={{}}>
                <Text style={{fontFamily: font.bold, fontSize: 20}}>Note:</Text>
              </View>

              <View style={{marginTop: 5}}>
                <Text style={{fontFamily: font.regular, fontSize: 14}}>
                  {!!noteText?.note_text ? noteText?.note_text : 'No Note'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </>
      )}
      {editNoteModal()}
    </SafeAreaView>
  );
};

export default NotesDetail;

const styles = StyleSheet.create({});
