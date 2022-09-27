import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import React from 'react';
import {font} from '../../Utilities/font';
import Colors from '../../Utilities/Colors';
import {screens} from '../../Navigation/Screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Landing({navigation}) {
  const onLoginScreen = () => {
    navigation.navigate(screens.Login);
  };

  const onSignUpScreen = () => {
    navigation.navigate(screens.signup);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <View style={_style.firstView}>
        <View style={_style.imageView}>
          <Image
            source={require('../../Assets/Images/landing.webp')}
            style={_style.mainImage}
          />
        </View>
        <View style={_style.secondView}>
          <View style={_style.textView}>
            <Text style={_style.heading}>Discover the better you</Text>
            <Text style={_style.decription}>
              We will help you to become a best version of you by helping you in
              many ways.
            </Text>
          </View>

          <View style={_style.buttonMainView}>
            <View style={{flex: 1}} />
            <View style={_style.buttonsInner}>
              <Pressable
                onPress={() => onSignUpScreen()}
                style={[_style.buttonView, _style.button1]}>
                <Text style={_style.buttonText1}>Register</Text>
              </Pressable>
              <Pressable
                onPress={() => onLoginScreen()}
                style={[_style.buttonView, _style.button2]}>
                <Text style={_style.buttonText2}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const _style = StyleSheet.create({
  mainImage: {width: '100%', height: '100%'},
  imageView: {flex: 1, borderRadius: 25, overflow: 'hidden'},
  firstView: {flex: 1, padding: 10},
  heading: {
    fontSize: 28,
    fontFamily: font.bold,
    color: Colors.black,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  textView: {
    alignItems: 'center',
    color: Colors.black,
    flex: 1,
    justifyContent: 'center',
    marginTop:10
  },
  secondView: {
    flex: 1,
    paddingHorizontal: 30,
    // paddingVertical: 10,
    // justifyContent: 'space-evenly',
  },
  decription: {
    color: Colors.placeHolder,
    fontFamily: font.regular,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },

  buttonText1: {
    fontFamily: font.medium,
    color: Colors.white,
  },
  buttonText2: {
    fontFamily: font.medium,
    color: Colors.primary,
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  button1: {
    backgroundColor: Colors.primary,
    borderRadius: 15,

    borderWidth: 3,
    borderColor: Colors.white,
  },
  button2: {},
  buttonMainView: {
    // flexDirection: 'row',
    // borderRadius: 10,

    flex: 1,
    

    // backgroundColor: '#ffff',
  },
  buttonsInner: {
    borderRadius: 10,
    flexDirection: 'row',
    borderRadius: 15,
    // overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
