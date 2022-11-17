import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {fileURL} from '../Utilities/domains';
import Colors from '../Utilities/Colors';
import FastImage from 'react-native-fast-image';
import CustomImage from './CustomImage';

const ic_cross = require('../Assets/Icons/cross.png');
const ImageZoomer = props => {
  console.log('props', fileURL + props?.url);
  return (
    <Modal
      isVisible={props?.visible}
      onBackButtonPress={() => props?.closeModal()}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0}
      // swipeDirection="down"
      animationIn="zoomIn"
      animationOut={'zoomOut'}
      style={{
        margin: 0,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: Colors.black,
          justifyContent: 'center',
        }}>
        {/* <StatusBar barStyle="light-content" backgroundColor={'#000'} /> */}
        <Pressable
          onPress={() => props?.closeModal()}
          style={{
            position: 'absolute',
            top: Platform.OS == 'ios' ? 50 : 10,
            right: Platform.OS == 'ios' ? 20 : 5,
            backgroundColor: '#fff',
            height: 40,
            width: 40,
            borderRadius: 50,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Image
            style={{
              tintColor: '#000',
              height: 20,
              width: 20,
            }}
            source={ic_cross}
            resizeMode="stretch"
          />
        </Pressable>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ImageViewer
            style={{
              width: Dimensions.get("screen").width,
              // aspectRatio: 1,
            }}

            loadingRender={() => (
              <ActivityIndicator color={Colors.primary} size={'large'} />
            )}
            saveToLocalByLongPress={false}
            imageUrls={[{url: fileURL + props?.url}]}
            index={0}
            useNativeDriver={true}
            renderIndicator={() => <></>}
          />

          {/* <CustomImage
            resizeMode={'cover'}
            source={{uri: fileURL + props?.url}}
            style={{width: '100%', height: undefined, aspectRatio: 1}}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

export default ImageZoomer;
