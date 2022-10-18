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
  Platform,
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
import messaging, {firebase} from '@react-native-firebase/messaging';

import showToast from '../../functions/showToast';
import {validateEmail, checkSpace} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import {useContext} from 'react';
import Context from '../../Context';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

const height = Dimensions.get('screen').height;
const Login = props => {
  const {setToken} = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const onSignUpScreen = () => {
    props.navigation.navigate(screens.signup);
  };

  const onForgotPasswordScreen = () => {
    props.navigation.navigate(screens.forgotPassword);
  };

  const onBottomTabScreen = async data => {
    const asyncData = [
      ['@token', data?.token],
      ['@user', JSON.stringify(data?.user)],
    ];
    console.log('Async Data', asyncData);
    AsyncStorage.multiSet(asyncData)
      .then(() => {
        setisLoading(false);
        setToken(data?.token);
        props.navigation.reset({
          index: 0,
          routes: [{name: screens.bottomTabs}],
        });
        scheduleNotifications(data?.habit);
      })
      .catch(e => {
        setisLoading(false);
        console.log('Async Error', e);
        showToast('Please Sign-in Agin', 'Something went wrong');
      });
  };

  const scheduleNotifications = list => {
    list.map((x, i) => {
      if (
        x.reminder == true &&
        moment(x.target_date).isSameOrAfter(moment(), 'date')
      ) {
        let days = [];
        x.frequency.filter(y => {
          if (y.status == true) {
            days.push(y.day.toLowerCase());
          }
        });

        let diff = 0;

        if (
          moment(x.target_date).format('DDMMYYYY') ==
          moment().format('DDMMYYYY')
        ) {
          diff = 0;
        } else {
          diff = moment(x.target_date).diff(moment(), 'days') + 1;
        }

        for (let i = 0; i <= diff; i++) {
          let day = moment().add(i, 'days');
          if (days.includes(day.format('dddd').toLowerCase())) {
            let scheduledTime =
              day.format('DD-MM-YYYY') +
              ' ' +
              moment(x?.reminder_time).format('HH:mm');
            PushNotification.localNotificationSchedule({
              title: x?.name,
              message: "Please complete your today's habit",
              date: moment(scheduledTime, 'DD-MM-YYYY HH:mm').toDate(),
              userInfo: {
                _id: x?._id,
                type: 'habit',
              },
              channelId: '6007',
              channelName: 'lifeCoaching',
            });
          }
        }
      }
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

  const btn_Login = () => {
    let t_email = email.toLowerCase().trim();
    let t_password = password;
    if (t_email == '') {
      showToast('Please enter your email', 'Alert');
    } else if (validateEmail(t_email) == '') {
      showToast('Please enter validate email', 'Alert');
    } else if (t_password == '') {
      showToast('Please enter your password', 'Alert');
    } else if (checkSpace(t_password)) {
      showToast('Password should not have white spaces', 'Alert');
    } else if (t_password.length < 6) {
      showToast('Password length must be minimim 6 letters', 'Alert');
    } else {
      console.log('Firebase Token', messaging().getToken());
      let obj_Login = {
        email: t_email,
        password: t_password,
        type: 1,
      };
      setisLoading(true);
      api_Login(obj_Login);
    }
  };

  const api_Login = async obj => {
    let res = await invokeApi({
      path: 'api/app_api/login',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      if (res.code == 200) {
        onBottomTabScreen(res);
      } else {
        setisLoading(false);
        showToast(res.message);
      }
    }
  };

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
              <CustomButton onPress={btn_Login} title={'Sign In'} />
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

export default Login;

const loginStyles = StyleSheet.create({
  headerView: {
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
