import React, { Component, useEffect, useRef, useState } from 'react';

import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';

import Toast from 'react-native-toast-message';
import Modal from "react-native-modal"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Colors from '../../../Utilities/Colors';
import cross from '../../../Assets/Icons/cross.png';
import uploadImage from '../../../Assets/Icons/upload.png';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../../../Components/Header';
import {CustomSimpleTextInput} from '../../../Components/CustomTextInput';
import { font } from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';
import { mainStyles } from '../../../Utilities/styles';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddTask(props) {
  const [values, setValues] = useState({
    currentWeek: '',
    selectedWeek: '',
    weekDayArray: '',
    modalVisible:false,
    imagesList:[],

    title:'',
    Description:'',
    datefinal:'Task Date...',
    time:'Task Time...',
    selectedType:'',
   
  });
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [DatepickerDate,setDatePickerDate] = useState(new Date())
  const [TimepickerDate,setTimePickerDate] = useState(new Date())





  const cancelAction = () => {

    setValues({...values,modalVisible:false})
}
  const modalOpen = () => {
    if(values.imagesList.length<5)
    {
    setValues({...values,modalVisible:true})
    }
    else
    {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'you are on maximum limit'
      });
    }
  }
const galleryAction = () => {

    setValues({...values,modalVisible:false})

    setTimeout(() => {
        chooseFromPhotoes();
    }, 400);

}
 const cameraAction = () => {
    setValues({...values,modalVisible:false})

    setTimeout(() => {
      captureImage();
    }, 400);

}


 const pushImagesIntoArray=(imageUri)=>{

  values.imagesList.push(imageUri);
  setValues({...values,modalVisible:false})

}




 const captureImage = async () => {

    let granted;
    if (Platform.OS == "android") {

        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

    }
    else {
        granted = true;
    }


    if (granted) {

        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight:1000,
                maxWidth:1000,
            },
            (response) => {
                if (!response.didCancel) {
                  pushImagesIntoArray(response.assets[0].uri)
                }
            },
        )

    }

}


 const chooseFromPhotoes = async () => {

    let granted;

    if (Platform.OS == "android") {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

    }
    else {
        granted = true;

    }


    if (granted) {
        try {
            launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
                maxHeight:1000,
                maxWidth:1000,

            },
                (response) => {


                    if (!response.didCancel) {
                      pushImagesIntoArray(response.assets[0].uri)
                    }
                },
            )

        }
        catch (e) {
            console.log(e, "error....")
        }

    }


}

 const removeItem = async(item)=>{
  values.imagesList.splice(item,1)
  setValues({...values,modalVisible:false})

}

const titleChangeHandler=(value)=>
    {
        setValues({
            ...values,
            title: value,
          })
    }

    const desctiptionChangeHandler=(value)=>
    {
        setValues({
            ...values,
            Description: value,
          })
    }


    const saveTask=()=>{
      if(values.title=='')
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Title required'
        });
        return;
      }
      if(values.datefinal=='Task Date...')
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Date required'
        });
        return;
      }
      if(values.datefinal=='Task Time...')
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Time required'
        });
        return;
      }
      if(values.Description=='')
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Description required'
        });
        return;
      }
      else
      {alert('data added')}


    }
    

    const showDatePicker = () => {
        hideTimePicker()
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDatePickerDate(date)
        setValues({...values,datefinal:moment(date).format('DD MMM YYYY')})
        hideDatePicker();
        hideTimePicker();
    };

    const showTimePicker = () => {
        hideDatePicker()
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (date) => {
        setTimePickerDate(date)
        setValues({...values,time:moment(date).format('hh:mm A')})
        hideDatePicker();
        hideTimePicker();
    };




  return (

    <SafeAreaView style={mainStyles.MainView}>

    <View style={{ flex: 1 }}>

        <Modal  
          onBackdropPress={() =>cancelAction()}
          onRequestClose={cancelAction}
          isVisible={values.modalVisible==true} transparent={true} style={{ justifyContent: "flex-end", margin: 0, }}>
        <View>

            <View style={{
                backgroundColor: Colors.background, width: "100%", paddingHorizontal: 18, paddingVertical: 15,borderTopRightRadius:20,borderTopLeftRadius:20,
            }}>



                <View style={{ width: "100%", }}>
                <View
            style={{
              height: 5,
              backgroundColor:Colors.gray04,
              borderRadius: 5,
              width: 60,
              alignSelf: 'center',
              marginBottom: 25,
              marginTop:-5,
            }}
          />
                    <TouchableOpacity  onPress={() => { galleryAction() }} style={{ width: '100%', height: 50, backgroundColor: Colors.white, borderRadius: 15, marginTop: 5, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>
                            <Text style={{ color: '#007AFF', fontSize: 15, fontFamily:font.bold }}>Photo Gallery</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => { cameraAction() }} style={{ marginTop: 1, width: '100%', height: 50, backgroundColor: Colors.white, borderRadius: 15, marginTop: 5, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{ flexDirection: "row", alignSelf: "center" }}>

                            <Text style={{ color: '#007AFF', fontSize: 15, textAlign: "center", fontFamily:font.bold }}>Camera</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: "100%", marginBottom: 10, marginTop: 5, }}>
                        <TouchableOpacity onPress={() => { cancelAction() }}  style={{ width: '100%', height: 50, backgroundColor: Colors.white, borderRadius: 15, justifyContent: 'center', alignItems: 'center',marginTop:10 }} >
                            <View style={{ flexDirection: "row", alignSelf: "center" }}>

                                <Text style={{ color: 'red', fontSize: 16, fontFamily:font.bold }}>Cancel</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>


            </View>

        </View>
        </Modal>

    
    <Header
          navigation={props.navigation}
          title={'Add Task'}
        />
      <View style={{ marginHorizontal: 20 }}>

        <View style={{ marginBottom: 10 }}>
       
        </View>

        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={modalOpen} style={{ width: '100%', height: 280, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, borderRadius: 15, borderWidth: 2, borderColor: '#DFDFDF', marginTop: 12, borderStyle: 'dashed', }} resizeMode={'contain'} >
            <Image style={{ width: 50, height: 50, }} source={uploadImage} />
            <Text
              style={{
                color: 'black',
                fontFamily: font.bold,
                fontSize: 13,
                marginTop: 5,
              }}>
              Upload up to 5 images
            </Text>
            <Text
              numberOfLines={2}
              style={{
                color: Colors.gray07,
                fontFamily: font.regular,
                fontSize: 11,
                marginTop: 5,
                marginHorizontal: 55,
                textAlign: 'center'
              }}>
              (345*255 or larger recommended, up to 1MB each)
            
          </Text>

          

          </TouchableOpacity>

          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          legacyImplementation={false}
          style={{marginTop: 5}}
          data={values.imagesList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={{height: 90, marginTop: 12 }}>

            <Image source={{uri:item}} style={[{ flex: 1, height: 80,width:100, margin: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: Colors.gray02, },]} />
            <TouchableOpacity onPress={()=>{removeItem(index)}} style={{width:20,height:20,borderRadius:10,backgroundColor:'red',position:'absolute',top:-5,right:0,alignItems:'center',justifyContent:'center'}} >
            <Image style={{height:10,width:10,alignSelf:'center',tintColor:Colors.white}} source={cross}></Image>

            </TouchableOpacity>
            </View>
          )}

          />


              <CustomSimpleTextInput
                placeholder={'Task Title...'}
                onChangeText={async(e)=>{titleChangeHandler(e)}}
              />

          <View style={{ flexDirection: 'row',marginTop:22,height:55 }}>

            <TouchableOpacity onPress={showDatePicker} style={{ flex: 1, marginRight: 4,backgroundColor: "#fff",borderRadius: 15,justifyContent:'center', borderWidth: 1,borderColor: Colors.gray02,  }}>
            <Text
                style={{
                borderRadius: 10,
                paddingHorizontal: 10,
                color: Colors.placeHolder,
                marginLeft:5,
                fontFamily:font.regular
              }}
            >   
            {values.datefinal} 
            </Text>   
            </TouchableOpacity>

            
            <TouchableOpacity onPress={showTimePicker} style={{ flex: 1, marginLeft: 4, backgroundColor: "#fff",borderRadius: 15,justifyContent:'center', borderWidth: 1,borderColor: Colors.gray02, }}>
            <Text
                style={{ 
                
                borderRadius: 10,
                paddingHorizontal: 10,
                color: Colors.placeHolder,
                marginLeft:5,
                fontFamily:font.regular

              }}
            >   
            {values.time}
            </Text>   
            </TouchableOpacity>

          </View>
          {/* {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )} */}

             <CustomSimpleTextInput
                placeholder={'Description...'}
                onChangeText={async(e)=>{desctiptionChangeHandler(e)}}
              />

          <View style={{marginTop:40,marginBottom:80}}>
              <CustomButton
                onPress={() => saveTask()}
                title={'Save'}
              />
            </View>

        </KeyboardAwareScrollView>
      </View>
      <DateTimePickerModal
                isVisible={isDatePickerVisible}
                date={DatepickerDate}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        <DateTimePickerModal
            isVisible={isTimePickerVisible}
            date={TimepickerDate}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
        />
    </View>

    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 5,
    },
    profileImage: {
        height: 42,
        width: 42,
        borderRadius: 12,
        
    },
    screenHeading: {
        fontSize: 24,
        fontFamily: font.bold,
        color: Colors.black,
    },
  })