import {View, Text, Platform} from 'react-native';
import React from 'react';
import {font} from '../Utilities/font';

export default function HeadingText(props) {
  return (
    <Text
      style={{
        fontSize: 36,
        color: '#000000',
        // fontWeight: Platform.OS == 'ios' ? '300' : '400',
        fontFamily: font.regular,
      }}>
      {props.children}
    </Text>
  );
}
