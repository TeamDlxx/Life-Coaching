import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import Colors from '../Utilities/Colors';
import {font} from '../Utilities/font';
import {screens} from '../Navigation/Screens';
import * as Animatable from 'react-native-animatable';

const HeaderWithSearch = props => {
  return (
    <>
      <View
        style={{
          width: '100%',
          height: 50 ,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.white,
        }}>
        <View style={{height: 50, width: 50}}>
          {!!props.navigation && (
            <Pressable
              style={{
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                !!props.onBackPress
                  ? props.onBackPress()
                  : props.navigation.goBack();
              }}>
              <Image
                source={require('../Assets/Icons/back.png')}
                style={{height: 25, width: 25}}
              />
            </Pressable>
          )}
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            numberOfLines={1}
            style={{
              color: Colors.black,
              fontSize: 20,
              fontFamily: font.bold,
              textAlign: !!props.titleAlignLeft ? 'left' : 'center',
            }}>
            {props.title}
          </Text>
        </View>
        {!!props.rightIcon2 && (
          <View style={{height: 50, width: 40}}>
            <Pressable
              style={{
                height: 50,

                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={props.rightIcon2onPress}>
              <Image
                source={props.rightIcon2}
                style={{height: 20, width: 20}}
              />
            </Pressable>
          </View>
        )}
        <View
          style={{
            height: 50,
            width: !!props.menu ? 50 : 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!!props.rightIcon ? (
            <Pressable
              style={{
                height: 50,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:"pink",
                marginRight: 10,
              }}
              onPress={props.rightIcononPress}>
              <Image
                source={props.rightIcon}
                style={[{height: 20, width: 20}, props?.rightIconStyle]}
              />
            </Pressable>
          ) : !!props.menu ? (
            props.menu()
          ) : null}
        </View>
      </View>
      <Animatable.View
        // opacity={props.isSearchVisible ? 1 : 0}
        animation={props.isSearchVisible ? 'slideInDown' : 'slideOutUp'}
        duration={300}
        style={{
          backgroundColor: Colors.background,
          width: '100%',
          height: 50,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          position: 'absolute',
          zIndex: 999,
          // top: Platform.OS == 'android' ? -50 : -1,
          // top: !props.isSearchVisible ? -400 : -1,
        }}>
        <View style={{height: 50, width: 50}}>
          <Pressable
            style={{
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              props.toggleSearch();
            }}>
            <Image
              source={require('../Assets/Icons/back.png')}
              style={{height: 25, width: 25}}
            />
          </Pressable>
        </View>
        <View style={{flex: 1, height: 50, paddingRight: 20}}>
          <TextInput
            placeholder="Search..."
            style={{flex: 1, height: '100%', fontSize: 16}}
          />
        </View>
      </Animatable.View>
    </>
  );
};

export default HeaderWithSearch;

const mySlideInDown = {
  0: {
    opacity: 0,
    top: -200,
  },
  // 0.25: {
  //   opacity: 0.5,
  //   top: -30,
  // },
  // 0.5: {
  //   opacity: 0.75,
  //   top: -20,
  // },
  1: {
    opacity: 1,
    top: -1,
  },
};

const mySlideInUp = {
  0: {
    opacity: 1,
    top: 1,
  },
  0.5: {
    opacity: 0.5,
    top: -25,
  },

  1: {
    opacity: 0,
    top: -50,
  },
};
