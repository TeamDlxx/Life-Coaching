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
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {LoginManager} from 'react-native-fbsdk';
import messaging from '@react-native-firebase/messaging';

const height = Dimensions.get('screen').height;

let FCM_Token = '';
const Signup = props => {
  const {params} = props?.route;
  const {setToken, setDashBoardData} = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const onLoginScreen = () => {
    props.navigation.navigate(screens.Login, {logout: false});
  };

  const GuestLogin = async () => {
    try {
      let res = await AsyncStorage.setItem('@guestMode', 'true');
      props.navigation.reset({
        index: 0,
        routes: [{name: screens.bottomTabs}],
      });
      await AsyncStorage.setItem('@googleOrAppleLogin', 'false');
    } catch (e) {
      showToast('Please try again', 'Something went wrong');
    }
  };

  const onBottomTabScreen = async data => {
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
      ['@guestMode', 'false'],
      ['@isSubscribedToTopic', 'false'],
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
          dashBoardApi(data?.token);
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

  const dashBoardApi = async token => {
    let res = await invokeApi({
      path: 'api/customer/app_dashboard',
      method: 'GET',
      headers: {
        'x-sh-auth': token,
      },
      navigation: props.navigation,
    });
    if (res) {
      if (res.code == 200) {
        let meditation = res.meditation_of_the_day;
        let quote = res.quote_of_day;
        let habit = res.habit_stats;
        let note = res.notes;

        await setDashBoardData({
          habitStats: habit,
          meditationOfTheDay: meditation,
          quoteOfTheDay: quote,
          notes: note,
        });
      } else {
      }
    }
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
        fcm_token: FCM_Token,
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
        await AsyncStorage.setItem('@googleOrAppleLogin', 'false');
        onBottomTabScreen(res.customer);
        await analytics().logEvent('USER_SIGNUP');
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  const socialLoginApi = async obj => {
    let res = await invokeApi({
      path: 'api/app_api/register_by_social_media',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      if (res.code == 200) {
        console.log(res, 'response...');
        await AsyncStorage.setItem('@googleOrAppleLogin', 'true');
        onBottomTabScreen(res);
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      let hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (hasPlayServices) {
        const userInfo = await GoogleSignin.signIn();
        let idToken = userInfo.idToken;

        let loginObj = {
          code: idToken,
          login_by: 'Google',
          fcm_token: FCM_Token,
        };
        socialLoginApi(loginObj);
      }
    } catch (error) {
      setisLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async function signInWithApple() {
    // performs login request

    try {
      console.log('button clicked apple');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
      }

      console.log(appleAuthRequestResponse, 'response from apple');

      let loginObj = {
        code: appleAuthRequestResponse.identityToken,
        login_by: 'Apple',
        fcm_token: FCM_Token,
      };
      setisLoading(true);
      socialLoginApi(loginObj);
    } catch (e) {
      console.log('error', e);
    }
  }

  const signInWithFacebook = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile']);
    console.log(result, 'result....');
    if (result.isCancelled) {
      console.log('Login is cancelled ...');
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    } else {
      console.log(data.accessToken.toString());
    }
  };

  const GoogleSignUpConfiguration = async () => {
    await GoogleSignin.configure({
      offlineAccess: true,
      webClientId:
        '943544818199-rl7j7rbngtg07d17ehktlonq40ldmki6.apps.googleusercontent.com',
    });
    await GoogleSignin.signOut();
  };

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      messaging().getToken().then((token) => {
        FCM_Token = token
        console.log(token, "FCM token....")
      });
    });
    return () => {
        unsubscribe;
    }
}, [props.navigation]);

  React.useEffect(() => {
    GoogleSignUpConfiguration();
    analytics().logEvent(props?.route?.name);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        resizeMode="stretch"
        style={{
          height: height,
          width: '100%',
          backgroundColor: '#fff',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        source={require('../../Assets/Images/loginBackgorund.png')}></ImageBackground>

      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        translucent={true}
      />
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{flex: 1}}>
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

        <View style={{marginTop: 35, paddingHorizontal: 20}}>
          <View style={loginStyles.headerView}>
            <HeadingText>Sign Up</HeadingText>
          </View>

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

          <View style={{marginVertical: 20}}>
            <CustomButton onPress={() => SigUpBtn()} title={'Sign Up'} />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Text style={{color: '#313131', fontFamily: font.regular}}>
              Continue as{' '}
              <Text
                onPress={() => GuestLogin()}
                style={{color: Colors.primary}}>
                Guest
              </Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: 40,
              marginHorizontal: 20,
            }}>
            <View
              style={{backgroundColor: Colors.gray04, height: 1, flex: 1}}
            />
            <Text
              style={{
                color: '#313131',
                fontFamily: font.regular,
                marginHorizontal: 10,
              }}>
              Or continue with
            </Text>
            <View
              style={{backgroundColor: Colors.gray04, height: 1, flex: 1}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Pressable
              onPress={async () => {
                setisLoading(true);
                signInWithGoogle();
              }}
              style={loginStyles.buttonStyle}>
              <Image
                source={require('../../Assets/Icons/google.png')}
                style={loginStyles.btnImageStyle}
              />
            </Pressable>

            {Platform.OS == 'ios' && (
              <Pressable
                onPress={() => {
                  signInWithApple();
                }}
                style={loginStyles.buttonStyle}>
                <Image
                  source={require('../../Assets/Icons/apple.png')}
                  style={loginStyles.btnImageStyle}
                />
              </Pressable>
            )}

            {/* <Pressable
                onPress={() => { }}
                // onPress={sigFnInWithFacebook}
                style={loginStyles.buttonStyle}>
                <Image source={require("../../Assets/Icons/facebook.png")} style={loginStyles.btnImageStyle} />
              </Pressable> */}
          </View>

          <View
            style={{
              marginTop: 20,
              alignItems: 'center',
              marginBottom: 10,
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

        <Loader
          enable={isLoading}
          style={{
            marginBottom: '40%',
            marginTop: Platform.OS == 'android' ? 50 : 100,
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;

const loginStyles = StyleSheet.create({
  headerView: {
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonStyle: {
    width: Dimensions.get('window').width / 6,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    marginRight: 5,
    marginHorizontal: 15,
  },

  btnImageStyle: {
    width: 35,
    height: 35,
  },
});
