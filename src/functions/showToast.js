import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import Colors from '../Utilities/Colors';
import React from 'react';
import {View, Text} from 'react-native';
import {font} from '../Utilities/font';

const showToast = (text2, text1 = 'Error', type = 'error') => {
  Toast.hide();
  setTimeout(() => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      autoHide: true,
      visibilityTime: 3000,
      
    });
  }, 150);
};

export default showToast;
