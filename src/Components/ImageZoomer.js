import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
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
          backgroundColor: !!props.color ? props.color : Colors.background,
          // backgroundColor:"#000000DD",
          justifyContent: 'center',
        }}>
        {/* <StatusBar barStyle="light-content" backgroundColor={'#000'} /> */}
        <Pressable
          onPress={() => props?.closeModal()}
          style={{
            position: 'absolute',
            top: Platform.OS == 'ios' ? 50 : 10,
            right: Platform.OS == 'ios' ? 10 : 10,
            zIndex: 2,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Image
              style={{
                tintColor: '#000',
                height: 25,
                width: 25,
              }}
              source={ic_cross}
              resizeMode="stretch"
            />
          </View>
        </Pressable>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ImageViewer
            style={{
              width: Dimensions.get('screen').width,
              // width:200,
              // height:200
              // aspectRatio: 1,
            }}
            // doubleClickInterval={1}
            backgroundColor={'transparent'}
            loadingRender={() => (
              <ActivityIndicator color={Colors.primary} size={'large'} />
            )}
            saveToLocalByLongPress={false}
            imageUrls={[
              {url: props?.noUrl ? props?.url : fileURL + props?.url},
            ]}
            index={0}
            useNativeDriver={true}
            renderIndicator={() => <></>}
          />

          {/* <CustomImage
            resizeMode={'contain'}
            source={{uri: fileURL + props?.url}}
            style={{width: '100%', height: undefined, aspectRatio: 1}}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

export default ImageZoomer;
