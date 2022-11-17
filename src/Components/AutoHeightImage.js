import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import {fileURL} from '../Utilities/domains';

const screen = Dimensions.get('window');

const AutoHeightImg = props => {
  return (
    <AutoHeightImage
      width={screen.width - 20}
      source={{uri: fileURL + props?.url}}
    />
  );
};

export default AutoHeightImg;
