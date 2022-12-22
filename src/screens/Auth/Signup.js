import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
  Image,
} from 'react-native';
import Colors from '../../Utilities/Colors';
import React, {useState} from 'react';
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
import {isIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';
import analytics from '@react-native-firebase/analytics';

import showToast from '../../functions/showToast';
import {
  validateEmail,
  checkSpace,
  isFirstLetterAlphabet,
} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';

import {useContext} from 'react';
import Context from '../../Context';
const height = Dimensions.get('screen').height;
const Signup = props => {
  const {params} = props?.route;
  const {setToken} = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const onLoginScreen = () => {
    props.navigation.navigate(screens.Login);
  };

  const GuestLogin = async () => {
    try {
      let res = await AsyncStorage.setItem('@guestMode', 'true');
      props.navigation.reset({
        index: 0,
        routes: [{name: screens.bottomTabs}],
      });
    } catch (e) {
      showToast('Please try again', 'Something went wrong');
    }
  };

  const onBottomTabScreen = data => {
    const asyncData = [
      ['@token', data?.token],
      [
        '@user',
        JSON.stringify({
          name: data?.name,
          profile_image: data?.profile_image,
          user_id: data?.user_id,
        }),
      ],
      ['guestMode', 'false'],
    ];
    console.log('Async Data', asyncData);
    AsyncStorage.multiSet(asyncData)
      .then(() => {
        setToken(data?.token);
        setisLoading(false);
        if (!!params?.from) {
          props.navigation.navigate({
            name: params?.from,
            params: {loggedIn: true},
            merge: true,
          });
        } else {
          props.navigation.reset({
            index: 0,
            routes: [{name: screens.bottomTabs}],
          });
        }
      })
      .catch(e => {
        setisLoading(false);
        console.log('Async Error', e);
        showToast('Please Sign-in Again', 'Something went wrong');
      });
  };

  const SigUpBtn = () => {
    let t_name = name.trim();
    let t_email = email.toLowerCase().trim();
    let t_password = password;
    if (t_name == '') {
      showToast('Please enter your name', 'Alert');
    } else if (t_email == '') {
      showToast('Please enter your email', 'Alert');
    } else if (validateEmail(t_email) == '') {
      showToast('Please enter valid email', 'Alert');
    } else if (t_password == '') {
      showToast('Please enter your password', 'Alert');
    } else if (checkSpace(t_password)) {
      showToast('Password should not have white spaces', 'Alert');
    } else if (t_password.length < 6) {
      showToast('Password length must be minimim 6 letters', 'Alert');
    } else {
      let obj_SignUp = {
        name: t_name,
        email: t_email,
        password: t_password,
      };
      setisLoading(true);
      api_signUp(obj_SignUp);
    }
  };

  const api_signUp = async obj => {
    let res = await invokeApi({
      path: 'api/customer/signup_customer',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      if (res.code == 200) {
        onBottomTabScreen(res.customer);
        await analytics().logEvent('USER_SIGNUP');
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  React.useEffect(() => {
    analytics().logEvent(props?.route?.name);
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
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            borderRadius: 25,
            marginTop:
              Platform.OS == 'android'
                ? 50
                : isIphoneX()
                ? 50
                : 50 - getStatusBarHeight(),
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 10,
            zIndex: 999,
          }}>
          <Image
            source={require('../../Assets/Icons/back.png')}
            style={{height: 25, width: 25, tintColor: Colors.black}}
          />
        </Pressable>
        <View style={{marginTop: 35}}>
          <View style={loginStyles.headerView}>
            <HeadingText>Sign Up</HeadingText>
          </View>
          <View
            style={{
              height: height * 0.67,
              paddingHorizontal: 20,
            }}>
            <View>
              <CustomSimpleTextInput
                lable={'Name'}
                placeholder={'Your Name'}
                onChangeText={text => setName(text)}
                value={name}
                autoCapitalize={true}
              />
            </View>
            <View style={{marginTop: 20}}>
              <CustomSimpleTextInput
                lable={'E-mail'}
                placeholder={'Email address'}
                onChangeText={text => setEmail(text)}
                value={email}
                type="email-address"
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

            {/* <View style={{marginVertical: 10, alignItems: 'flex-end'}}>
              <Text style={{color: '#6C747E', fontFamily: font.medium}}>
                Forgot Password?
              </Text>
            </View> */}

            <View style={{marginTop: 30}}>
              <CustomButton onPress={() => SigUpBtn()} title={'Sign Up'} />
            </View>
            <View
              style={{
                alignItems: 'center',
                // flex: 1,
                justifyContent: 'flex-end',
                marginTop: 20,
              }}>
              <Text style={{color: '#313131', fontFamily: font.regular}}>
                Continue as{' '}
                <Text
                  onPress={() => GuestLogin()}
                  style={{color: colors.primary}}>
                  Guest
                </Text>
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <Text style={{color: '#313131', fontFamily: font.regular}}>
                Already have an Account?{' '}
                <Text
                  onPress={() => onLoginScreen()}
                  style={{color: colors.primary}}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <Loader
          enable={isLoading}
          style={{
            marginBottom: '40%',
            marginTop: Platform.OS == 'android' ? 50 : 100,
          }}
        />
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

export default Signup;

const loginStyles = StyleSheet.create({
  headerView: {
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
