import {View, Text, Dimensions, Image} from 'react-native';
import React from 'react';
import Colors from '../Utilities/Colors';
import {font} from '../Utilities/font';

const screen = Dimensions.get('screen');
const ic_nodata = require('../Assets/Icons/empty-box.png');
const EmptyView = props => {
  return (
    <View
      style={[
        {
          width: screen.width,
          marginTop: screen.width / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        {
          ...props.style,
        },
      ]}>
      <Image
        source={ic_nodata}
        style={{
          width: screen.width * 0.3,
          height: screen.width * 0.3,
        }}
      />
      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text style={{fontFamily: font.bold}}>
          {!!props.title ? props.title : 'No Data'}
        </Text>
        <Text style={{fontFamily: font.regular}}>Swipe down to refresh</Text>
      </View>
    </View>
  );
};

export default EmptyView;
