import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useState } from 'react';
import Colors from '../../../../Utilities/Colors';
import { font } from '../../../../Utilities/font';
import Modal from 'react-native-modal';

// For API's
import showToast from '../../../../functions/showToast';
import ImagePicker from 'react-native-image-crop-picker';
const ic_addImage = require('../../../../Assets/Icons/addImage.png');
import ic_gallery from '../../../../Assets/Icons/gallery.png';
import ic_camera from '../../../../Assets/Icons/camera.png';
import ic_cross from '../../../../Assets/Icons/cross.png';

const ImagePickerModel = props => {
  const Token = props.Token;
  const [isModalVisible, setModalVisibility] = useState(false);

  const openGallery = async () => {
    setModalVisibility(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
        mediaType: 'photo',
        multiple : true,
        cropperStatusBarColor: Colors.background,
        cropperToolbarColor: Colors.background,
        maxFiles : 15
      })
        .then(image => {
          console.log('Image', image);
          props.setImage(image);
        })
        .catch(e => {
          console.log('HI', JSON.stringify(e));
          if (e.code == 'E_NO_LIBRARY_PERMISSION') {
            showToast(
              'Please allow permssion in settings first',
              'Permission denied',
            );
          }
        });
    }, 500);
  };

  const openCamera = async () => {
    setModalVisibility(false);
    let granted;
    if (Platform.OS == 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } else {
      granted = true;
    }

    if (granted) {
      setTimeout(() => {
        ImagePicker.openCamera({
          width: 600,
          height: 600,
          cropping: true,
          mediaType: 'photo',
          cropperStatusBarColor: Colors.background,
          cropperToolbarColor: Colors.background,
        })
          .then(image => {
            console.log('Image', image);
            props.setImage([image]);
          })
          .catch(e => {
            if (e?.code == 'E_NO_CAMERA_PERMISSION') {
              showToast(e.message, 'Permission not granted');
            }
            console.log('Error', JSON.stringify(e));
          });
      }, 500);
    }
  };


  const ImagePickerOptionsModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
        onBackdropPress={() => setModalVisibility(false)}
        useNativeDriverForBackdrop={true}
        style={{ marginTop: 'auto', margin: 0 }}>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 'auto',
            marginBottom: Platform.OS == 'ios' ? 30 : 10,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 20,
          }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  letterSpacing: 0.5,
                }}>
                Select Image
              </Text>
            </View>

            <Pressable
              onPress={() => setModalVisibility(false)}
              style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_cross} style={{ height: 10, width: 10 }} />
              </View>
            </Pressable>
          </View>


          <View
            style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={openCamera} style={{ alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_camera} style={{ height: 20, width: 20 }} />
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
              style={{ alignItems: 'center', marginLeft: 30 }}>
              <View
                style={{
                  backgroundColor: '#BDC3C744',
                  height: 50,
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}>
                <Image source={ic_gallery} style={{ height: 20, width: 20 }} />
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

          </View>

        </View>
      </Modal>
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisibility(true)}
        style={[
          {
            width: props.width,
            borderRadius: props.borderRadius,
            marginVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.lightPrimary2,
            borderColor: Colors.primary,
            borderWidth: 1,
            borderStyle: "dashed"
          },
          props.height == undefined
            ? {
              aspectRatio: 1,
            }
            : {
              height: props.height,
            },
        ]}>
        <>
          <Image
            source={ic_addImage}
            style={{
              width: 35,
              height: 35,
              tintColor: Colors.primary,
            }}
          />
        </>
      </Pressable>

      {ImagePickerOptionsModal()}
    </>
  );
};

export default ImagePickerModel;
