import {View, Text, ActivityIndicator, Platform} from 'react-native';
import React from 'react';
import Colors from '../Utilities/Colors';

const Loader = props => {
  if (props.enable) {
    return (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            // marginTop: Platform.OS == 'android' ? 50 : 100,
            ...props.style,
          },
        ]}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </View>
    );
  }
};

export default Loader;
