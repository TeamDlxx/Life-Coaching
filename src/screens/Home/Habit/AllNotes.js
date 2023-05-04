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
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Header from '../../../Components/Header';
import Colors, { Bcolors } from '../../../Utilities/Colors';
import { mainStyles, createHabit_styles } from '../../../Utilities/styles';
import { CustomMultilineTextInput } from '../../../Components/CustomTextInput';
import CustomButton from '../../../Components/CustomButton';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CustomImage from '../../../Components/CustomImage';
import analytics from '@react-native-firebase/analytics';

// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import { fileURL } from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import Toast from 'react-native-toast-message';

const screen = Dimensions.get('screen');

const AllNotes = props => {
  const { Token, habitList, setHabitList } = useContext(Context);
  const { params } = props.route;
  const MenuRef = useRef([]);
  const [isLoading, setisLoading] = useState(false);
  const [habit, setHabitDetail] = useState(null);
  const [note, setNote] = useState({
    modalVisible: false,
    item: null,
    text: '',
    update: false,
  });

  const updateNote = updation => setNote({ ...note, ...updation });

  const sorttheListbyDate = list => {
    return list.slice().sort(function (a, b) {
      return moment(b.date).valueOf() - moment(a.date).valueOf();
    });
  };

  const checkNotesforthisweek = list => {
    return list;
  };

  const deleteNote = (obj, index) => {
    MenuRef.current[index].hide();
    Alert.alert('Delete Note', 'Are you sure you want to delete this note', [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        onPress: () => api_editNote(obj),
      },
    ],
      { cancelable: true },
    );
  };

  const editNote = async (i, item) => {
    await MenuRef.current[i].hide();

    setTimeout(() => {
      updateNote({
        text: item?.note_text,
        modalVisible: true,
        item: item,
        update: true,
      });
    }, 400);
  };

  const editNoteModal = () => {
    return (
      <Modal
        isVisible={note.modalVisible}
        onBackButtonPress={() => updateNote({ modalVisible: false })}
        onBackdropPress={() => updateNote({ modalVisible: false })}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        hideModalContentWhileAnimating={true}
        style={{ marginHorizontal: 5 }}>
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
              style={{ height: 70, width: 70 }}
              source={require('../../../Assets/Icons/check.png')}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomMultilineTextInput
              lable={note.update == false ? 'Add Note' : 'Edit Note'}
              subLabel={'(Optional)'}
              placeholder={'Please enter a note for completing this Habit'}
              lableBold
              lableColor={Colors.black}
              value={note.text}
              onChangeText={text => updateNote({ text: text })}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <CustomButton
              height={50}
              onPress={note.update == false ? markCompeleted : btn_saveChnages}
              title={note.update == false ? 'Mark Complete' : 'Save Changes'}
            />
          </View>
        </View>
        {!!note?.modalVisible && <Toast />}
      </Modal>
    );
  };

  const markCompeleted = () => {
    let { item } = note;
    let obj_addNote = {
      note_text: note.text.trim(),
      date: moment(note.item).toISOString(),
    };
    api_addNote(item._id, obj_addNote);
    setisLoading(true);
    setNote({ modalVisible: false, text: '', item: null });
  };

  const btn_saveChnages = () => {
    let obj = {
      note_id: note?.item?._id,
      note_text: note?.text.trim(),
      date: note?.item?.date,
    };
    api_editNote(obj);
    setisLoading(true);
    setTimeout(() => {
      updateNote({ text: '', modalVisible: false, item: null });
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
        setHabitDetail(res.habit);
        updateHabitList(res.habit);
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
    if (params?.habit) {
      setHabitDetail(params?.habit);
    }

    analytics().logEvent(props?.route?.name);
  }, []);

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'All Notes'} />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        {habit != null && (
          <View style={{ flex: 1 }}>
            <FlatList
              data={!!habit ? habit.notes.filter(x => x.note_text != '') : []}
              renderItem={({ item, index }) => {
                return (
                  <LinearGradient
                    key={item._id}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    locations={[0.0, 0.99]}
                    colors={['#FCE29F', '#FCE29F55']}
                    style={{
                      marginTop: 10,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: font.medium,
                            fontSize: 12,
                            color: Colors.gray12,
                          }}>
                          {item.note_text}
                        </Text>
                      </View>
                      <Menu
                        ref={ref => (MenuRef.current[index] = ref)}
                        style={{
                          backgroundColor: Colors.white,
                        }}
                        onRequestClose={() => MenuRef.current[index].hide()}
                        anchor={
                          <Pressable
                            onPress={() => MenuRef.current[index].show()}
                            style={{
                              height: 25,
                              width: 25,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: -5,
                              marginTop: -5,
                              borderRadius: 25 / 2,
                            }}>
                            <Image
                              style={{
                                height: 10,
                                width: 10,
                                tintColor: Colors.gray12,
                              }}
                              source={require('../../../Assets/Icons/threeDots.png')}
                            />
                          </Pressable>
                        }>
                        <MenuItem onPress={() => editNote(index, item)}>
                          <Text style={{ fontFamily: font.bold }}>Edit</Text>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          onPress={() => {
                            deleteNote(
                              {
                                note_id: item._id,
                                note_text: '',
                                date: item.date,
                              },
                              index,
                            );
                            MenuRef.current[index].hide();
                          }}>
                          <Text style={{ fontFamily: font.bold }}>Delete</Text>
                        </MenuItem>
                      </Menu>
                    </View>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        fontSize: 10,
                        textAlign: 'right',
                        color: Colors.black,
                        marginTop: 5,
                      }}>
                      {moment(item.date).format('dddd, DD MMM YYYY')}
                    </Text>
                  </LinearGradient>
                );
              }}
              ListEmptyComponent={() =>
                habit.notes.filter(x => x.note_text != '').length == 0 && (
                  <EmptyView />
                )
              }
            />
          </View>
        )}
      </View>
      {editNoteModal()}
    </SafeAreaView>
  );
};

export default AllNotes;
