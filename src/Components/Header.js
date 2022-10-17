import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import Colors from '../Utilities/Colors';
import {font} from '../Utilities/font';
import {screens} from '../Navigation/Screens';

const Header = props => {
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal:10
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
              props.navigation.goBack();
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
            <Image source={props.rightIcon2} style={{height: 20, width: 20}} />
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
            <Image source={props.rightIcon} style={{height: 20, width: 20}} />
          </Pressable>
        ) : !!props.menu ? (
          props.menu()
        ) : null}
      </View>
    </View>
  );
};

export default Header;
