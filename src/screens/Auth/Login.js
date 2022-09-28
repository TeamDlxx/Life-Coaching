import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeadingText from '../../Components/HeadingText';
import {
  CustomSimpleTextInput,
  CustomPasswordTextInput,
} from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {font} from '../../Utilities/font';
import {screens} from '../../Navigation/Screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const height = Dimensions.get('screen').height;
const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUpScreen = () => {
    props.navigation.navigate(screens.signup);
  };

  const onForgotPasswordScreen = () => {
    props.navigation.navigate(screens.forgotPassword);
  };

  const onBottomTabScreen = async () => {
    const token = await messaging().getToken();
    console.log('Firebase Token\n', token);
    AsyncStorage.multiSet([
      ['@token', 'kdcdhsbchjbdshjsdcknjdsjkc'],
      ['@firebaseToken', token],
    ]).then(() => {
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: screens.bottomTabs,
          },
        ],
      });
    });
  };

  async function checkNotificationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      // await messaging().registerDeviceForRemoteMessages();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      // await messaging().registerDeviceForRemoteMessages();
    } else {
    }
  }

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  return (
    <KeyboardAwareScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      style={{}}>
      <ImageBackground
        resizeMode="stretch"
        style={{height: height, width: '100%', backgroundColor: '#fff'}}
        source={require('../../Assets/Images/loginBackgorund.png')}>
        <StatusBar
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
          translucent={true}
        />

        <View style={{marginTop: 35}}>
          <View style={loginStyles.headerView}>
            <HeadingText>Sign In</HeadingText>
          </View>
          <View
            style={{
              height: height * 0.67,
              paddingHorizontal: 20,
            }}>
            <View>
              <CustomSimpleTextInput
                lable={'E-mail'}
                placeholder={'Email address'}
                onChangeText={text => setEmail(text)}
                value={email}
              />
            </View>
            <View style={{marginTop: 20}}>
              <CustomPasswordTextInput
                lable={'Password'}
                placeholder={'Password'}
                onChangeText={text => setPassword(text)}
                value={password}
              />
            </View>

            <TouchableOpacity
              onPress={() => onForgotPasswordScreen()}
              style={{marginVertical: 10, alignItems: 'flex-end'}}>
              <Text style={{color: '#6C747E', fontFamily: font.medium}}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <View style={{marginVertical: 20}}>
              <CustomButton
                onPress={() => onBottomTabScreen()}
                title={'Sign In'}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <Text style={{color: '#313131', fontFamily: font.regular}}>
                Don't have account?{' '}
                <Text
                  onPress={() => onSignUpScreen()}
                  style={{color: colors.primary}}>
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const loginStyles = StyleSheet.create({
  headerView: {
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
