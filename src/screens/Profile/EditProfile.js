import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {CustomSimpleTextInput} from '../../Components/CustomTextInput';

// Icons

import profile_placeholder from '../../Assets/Icons/dummyProfile.png';
import profile_avatar from '../../Assets/Icons/profileAvatar.jpg';
import ic_edit from '../../Assets/Icons/edit.png';
import pick_image from '../../Assets/Icons/pickImage.png';
import ic_gallery from '../../Assets/Icons/gallery.png';
import ic_camera from '../../Assets/Icons/camera.png';
import ic_cross from '../../Assets/Icons/cross.png';
import ic_trash from '../../Assets/Icons/trash.png';
import CustomButton from '../../Components/CustomButton';

const EditProfile = props => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [user, updateUser] = useState({
    imageURI: null,
    fullName: 'Ammar Yousaf',
  });
  const setUser = updation => updateUser({...user, ...updation});

  const SaveChangesButton = () => {
    props.navigation.goBack();
  };

  const openGallery = async () => {
    setModalVisibility(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          console.log('Image', image);
          setUser({imageURI: image.sourceURL});
        })
        .catch(e => {
          console.log('Error', e);
        });
    }, 500);
  };

  const openCamera = async () => {
    setModalVisibility(false);
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          console.log('Image', image);
          setUser({imageURI: image.sourceURL});
        })
        .catch(e => {
          console.log('Error', e);
        });
    }, 500);
  };

  const ImagePickerOptionsModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
        onBackdropPress={() => setModalVisibility(false)}
        useNativeDriverForBackdrop={true}
        style={{marginTop: 'auto', margin: 0}}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                Profile Photo
              </Text>
            </View>

            <Pressable
              onPress={() => setModalVisibility(false)}
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
                <Image source={ic_cross} style={{height: 10, width: 10}} />
              </View>
            </Pressable>
          </View>
          <View
            style={{marginTop: 25, flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={openCamera} style={{alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_camera} style={{height: 20, width: 20}} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}>
                Camera
              </Text>
            </Pressable>

            <Pressable
              onPress={openGallery}
              style={{alignItems: 'center', marginLeft: 30}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_gallery} style={{height: 20, width: 20}} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}>
                Gallery
              </Text>
            </Pressable>
            <Pressable style={{alignItems: 'center', marginLeft: 30}}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_trash} style={{height: 20, width: 20}} />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}>
                Remove
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Edit Profile" navigation={props.navigation} />
      <View style={{flex: 1}}>
        <View>
          <Pressable
            onPress={() => setModalVisibility(true)}
            style={{
              height: 110,
              width: 110,
              borderRadius: 110 / 2,
              alignSelf: 'center',
              marginTop: 30,
              borderWidth: 1,
              borderColor: Colors.gray05,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            <CustomImage
              source={!!user?.imageURI ? {uri: user?.imageURI} : profile_avatar}
              style={{
                height: 100,
                width: 100,
              }}
              imageStyle={{
                borderRadius: 100 / 2,
              }}
            />

            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                bottom: 5,
                // right:-10,

                borderRadius: 999,
                overflow: 'hidden',
              }}>
              <View style={{flex: 3}} />
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#00000055',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={pick_image}
                  style={{height: 20, width: 20, tintColor: '#fff'}}
                />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={{marginTop: 30, paddingHorizontal: 20}}>
          <CustomSimpleTextInput
            lable={'Full Name'}
            value={user.fullName}
            placeholder="Your Name"
            onChangeText={val => setUser({fullName: val})}
          />
        </View>
        <View style={{marginTop: 10, paddingHorizontal: 20}}>
          <CustomButton title="Save Changes" onPress={SaveChangesButton} />
        </View>
      </View>
      {ImagePickerOptionsModal()}
    </SafeAreaView>
  );
};

export default EditProfile;
