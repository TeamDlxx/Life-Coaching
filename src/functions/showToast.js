import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import Colors from '../Utilities/Colors';
import React from 'react';
import {View, Text} from 'react-native';
import {font} from '../Utilities/font';

const showToast = (text2, text1 = 'Error') => {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
  });
};



export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{backgroundColor: Colors.primary, borderLeftColor: Colors.primary}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontFamily: font.medium,
        color: Colors.white,
      }}
      text2Style={{
        fontFamily: font.regular,
        color: Colors.white,
      }}
    />
  ),
};

export default showToast;
