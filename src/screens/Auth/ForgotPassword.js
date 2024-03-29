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
  Pressable,
  Image,
  Platform,
} from 'react-native';
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
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {isIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';
import showToast from '../../functions/showToast';
import {validateEmail, checkSpace} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import analytics from '@react-native-firebase/analytics';

const height = Dimensions.get('screen').height;

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const onOTPScreen = email => {
    props.navigation.navigate(screens.otp, {
      email,
    });
  };

  const btn_EmailSend = () => {
    let t_email = email.toLowerCase().trim();
    if (t_email == '') {
      showToast('Please enter your email', 'Alert');
    } else if (validateEmail(t_email) == '') {
      showToast('Please enter  email', 'Alert');
    } else {
      let obj_sendEmail = {
        email: t_email,
      };
      setisLoading(true);
      api_emailVerification(obj_sendEmail);
    }
  };

  const api_emailVerification = async obj => {
    let res = await invokeApi({
      path: 'api/app_api/email_verification',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        onOTPScreen(obj.email);
      } else {
        showToast(res.message);
      }
    }
  };

  React.useEffect(() => {
    analytics().logEvent(props?.route?.name);
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
       <ImageBackground
        resizeMode="stretch"
        style={{
          height: height, width: '100%',
          backgroundColor: '#fff', position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0
        }}
        source={require('../../Assets/Images/loginBackgorund.png')}>
      </ImageBackground>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        translucent={true}
      />
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{}}>
        {/* <ImageBackground
          resizeMode="stretch"
          style={{height: height, width: '100%', backgroundColor: '#fff'}}
          source={require('../../Assets/Images/loginBackgorund.png')}> */}
          <View
            style={{
              marginTop:
                Platform.OS == 'android'
                  ? 50
                  : isIphoneX()
                  ? 50
                  : 50 - getStatusBarHeight(),
            }}>
            <Header navigation={props.navigation} title={'Forgot Password'} />

            <View
              style={{
                height: Platform.OS == 'ios' ? height * 0.66 : height * 0.55,
                paddingHorizontal: 20,
                justifyContent: 'center',
              }}>
              <View style={{marginVertical: Platform.OS == 'ios' ? 30 : 40}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.main,
                    fontFamily: font.regular,
                    textAlign: 'center',
                  }}>
                  Please enter your email address to receive a verification
                  code.
                </Text>
              </View>
              <View>
                <CustomSimpleTextInput
                  lable={'E-mail'}
                  placeholder={'Email address'}
                  onChangeText={text => setEmail(text)}
                  value={email}
                  type="email-address"
                />
              </View>

              <View style={{marginTop: 30}}>
                <CustomButton onPress={btn_EmailSend} title={'Send Email'} />
              </View>
            </View>
          </View>
          <Loader
            enable={isLoading}
            style={{
              marginTop: Platform.OS == 'android' ? 50 : 100,
            }}
          />
        {/* </ImageBackground> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ForgotPassword;

const loginStyles = StyleSheet.create({
  headerView: {
    height: height * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
