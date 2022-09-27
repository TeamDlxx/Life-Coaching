import React, {useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Menuicon from '../../../Assets/Icons/menu.png';
import Colors from '../../../Utilities/Colors';
import Modal from 'react-native-modal';
import Header from '../../../Components/Header';
import {font} from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';

export default function TaskDetail(props) {
  const [values, setValues] = useState({
    currentWeek: '',
    selectedWeek: '',
    weekDayArray: '',
    ImagesArray: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ZBrBNBKLvZB9Q3BXmxmdi54NJ9v4ND82rg&usqp=CAU',
      },
      {
        url: 'https://images.unsplash.com/photo-1604251405903-b8c4e83cdf7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVsYXhhdGlvbnxlbnwwfHwwfHw%3D&w=1000&q=80',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_kPxS5Mrgm6uERvdjdtEee8OwPMY2pWGoyg&usqp=CAU',
      },
    ],
  });
  const [modal, setModal] = useState(false);

  const loginFunc = () => {
    // props.navigation.
  };

  const modalOpen = () => {
    setModal(true);
  };
  const modalClose = () => {
    setModal(false);
  };

  // Edit modal view function Supported ui function ............
  const EditModal = () => {
    return (
      <Modal
        onBackdropPress={() => modalClose()}
        onBackButtonPress={modalClose}
        onRequestClose={modalClose}
        isVisible={modal}
        transparent={true}
        useNativeDriverForBackdrop={true}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View>
          <View
            style={{
              backgroundColor: Colors.background,
              width: '100%',
              paddingHorizontal: 18,
              paddingVertical: 15,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <View style={{width: '100%'}}>
              <View
                style={{
                  height: 5,
                  backgroundColor: Colors.gray04,
                  borderRadius: 5,
                  width: 60,
                  alignSelf: 'center',
                  marginBottom: 25,
                  marginTop: -5,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  modalClose();
                }}
                style={{
                  width: '100%',
                  height: 50,
                  backgroundColor: Colors.white,
                  borderRadius: 15,
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: '#007AFF',
                      fontSize: 15,
                      fontFamily: font.bold,
                    }}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  modalClose();
                }}
                style={{
                  marginTop: 1,
                  width: '100%',
                  height: 50,
                  backgroundColor: Colors.white,
                  borderRadius: 15,
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: '#007AFF',
                      fontSize: 15,
                      textAlign: 'center',
                      fontFamily: font.bold,
                    }}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{width: '100%', marginBottom: 10, marginTop: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    modalClose();
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: Colors.white,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 15,
                        fontFamily: font.bold,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#F2F3F3', paddingHorizontal: 0}}>
      <View style={{flex: 1}}>
        {EditModal()}
        <View style={{flex: 1}}>
          <Header
            navigation={props.navigation}
            title={'Task Detail'}
            //   titleAlignLeft
          />
          <View
            style={{
              backgroundColor: Colors.white,
              flex: 1,
              marginTop: 10,
              borderTopLeftRadius: 35,
              borderTopRightRadius: 35,
              paddingTop: 20,
            }}>
            <ScrollView>
              <View style={{marginHorizontal: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    marginBottom: 10,
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 19,
                        color: Colors.black,
                        fontFamily: font.bold,
                      }}>
                      Go for gym
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={modalOpen}
                      style={{padding: 5, alignSelf: 'flex-end'}}>
                      <Image
                        style={{height: 18, width: 18}}
                        source={Menuicon}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.gray09,
                    fontFamily: font.medium,
                    marginTop: 10,
                    textAlign: 'justify',
                    lineHeight: 22,
                  }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </Text>
                <Text
                  style={{
                    fontSize: 19,
                    color: Colors.black,
                    fontFamily: font.bold,
                    marginTop: 20,
                  }}>
                  Attachments
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  legacyImplementation={false}
                  style={{marginTop: 10}}
                  data={values.ImagesArray}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View
                      onPress={() => {
                        this.onDatePress(item);
                      }}
                      style={{
                        margin: 5,
                        width: 151.5,
                        height: 121.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: Colors.gray02,
                        borderWidth: 1.5,
                        borderRadius: 8,
                      }}>
                      <Image
                        style={{width: 150, height: 120}}
                        source={{uri: item.url}}
                        borderRadius={8}></Image>
                    </View>
                  )}
                />

                <Text
                  style={{
                    fontSize: 19,
                    color: Colors.black,
                    fontFamily: font.bold,
                    marginTop: 20,
                  }}>
                  Time Of Accomplishment
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.gray09,
                    fontFamily: font.medium,
                    marginTop: 10,
                    textAlign: 'left',
                    lineHeight: 20,
                  }}>
                  28 March 2022 || 9:40 PM{' '}
                </Text>
                {/* 
                <View style={{marginTop: 40, marginBottom: 80}}>
                  <CustomButton
                    onPress={() => loginFunc()}
                    title={'Mark Complete'}
                  />
                </View> */}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
