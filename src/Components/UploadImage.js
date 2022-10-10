import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Colors from '../Utilities/Colors';
import {font} from '../Utilities/font';
import Modal from 'react-native-modal';
// For API's
import showToast from '../functions/showToast';

import invokeApi from '../functions/invokeAPI';
import {fileURL} from '../Utilities/domains';

import ImagePicker from 'react-native-image-crop-picker';
import CustomImage from './CustomImage';
const screen = Dimensions.get('screen');
const ic_addImage = require('../Assets/Icons/addImage.png');
import ic_gallery from '../Assets/Icons/gallery.png';
import ic_camera from '../Assets/Icons/camera.png';
import ic_cross from '../Assets/Icons/cross.png';
import ic_trash from '../Assets/Icons/trash.png';
import pick_image from '../Assets/Icons/pickImage.png';

const UploadImage = props => {
  const Token = props.Token;
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  console.log('props', props);

  const openGallery = async () => {
    setModalVisibility(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          console.log('Image', image);

          props.setImage(image);
          // setUser({imageURI: image.sourceURL});

          // let data = new FormData();
          // data.append('image', {
          //   uri: image.path,
          //   name: 'image',
          //   type: image.mime,
          // });
          // api_fileUpload(data);
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
        width: 600,
        height: 600,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          console.log('Image', image);
          let data = new FormData();
          data.append('image', {
            uri: image.path,
            name: 'image',
            type: image.mime,
          });
          api_fileUpload(data);
        })
        .catch(e => {
          console.log('Error', e);
        });
    }, 500);
  };

  const api_fileUpload = async file => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/app_api/upload_image_s3',
      method: 'POST',
      postData: file,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-sh-auth': Token,
      },
    });
    setisLoading(false);
    if (res) {
      if (res.code == 200) {
        props.setImage(res?.path);
      } else {
        showToast(res.message);
      }
    }
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
                Select Image
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
            {!!props.removeImage && (
              <Pressable
                onPress={() => {
                  props.setImage('');
                  setModalVisibility(false);
                }}
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
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         width: props.width,
  //         aspectRatio: 1,
  //         borderRadius: 20,
  //         alignSelf: 'center',
  //         marginVertical: 10,
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         backgroundColor: Colors.white,
  //         borderColor: Colors.gray02,
  //         borderWidth: 1,
  //       }}>
  //       <ActivityIndicator size={'small'} color={Colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <>
      <Pressable
        onPress={() => setModalVisibility(true)}
        style={[
          {
            width: props.width,
            borderRadius: props.borderRadius,
            marginVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.white,
            borderColor: Colors.gray02,
            borderWidth: 1,
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
          {isLoading ? (
            <ActivityIndicator size={'small'} color={Colors.primary} />
          ) : !!props.localImage ? (
            <CustomImage
              source={{uri: props.localImage}}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}
              imageStyle={{
                borderRadius: props.borderRadius,
              }}
              indicatorProps={{
                color: Colors.primary,
              }}
            />
          ) : !!props.NetworkImage ? (
            <CustomImage
              source={{uri: fileURL + props.NetworkImage}}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}
              imageStyle={{
                borderRadius: props.borderRadius,
              }}
              indicatorProps={{
                color: Colors.primary,
              }}
            />
          ) : (
            <Image
              source={ic_addImage}
              style={{
                width: '30%',
                height: '30%',
                tintColor: Colors.placeHolder,
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              bottom: 0,
              overflow: 'hidden',
              borderBottomLeftRadius: props.borderRadius,
              borderBottomRightRadius: props.borderRadius,
            }}>
            <View style={{flex: 3}} />
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF88',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={pick_image}
                style={{height: 20, width: 20, tintColor: '#000'}}
              />
            </View>
          </View>
        </>
      </Pressable>

      {ImagePickerOptionsModal()}
    </>
  );
};

export default UploadImage;
