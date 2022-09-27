import {SafeAreaView, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {mainStyles} from '../Utilities/styles';
import Colors from '../Utilities/Colors';

export const Wrapper = props => {
  // useEffect(() => {
  //   console.log('props', props);
  // }, []);

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      {console.log('props', props)}
      {props.children}
    </SafeAreaView>
  );
};
