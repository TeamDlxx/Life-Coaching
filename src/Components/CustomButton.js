import {View, Text, Pressable} from 'react-native';
import React from 'react';
import colors from '../Utilities/Colors';
import {font} from '../Utilities/font';

export default function CustomButton(props) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        backgroundColor: colors.primary,
        height: !!props.height ? props.height : 55,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: colors.white, fontSize: 18, fontFamily: font.bold}}>
        {props.title}
      </Text>
    </Pressable>
  );
}
