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
import React, {useState, useEffect} from 'react';
import CustomButton from '../../Components/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {font} from '../../Utilities/font';
import {screens} from '../../Navigation/Screens';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import {isIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';

import showToast from '../../functions/showToast';
import {validateEmail, checkSpace} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';

const height = Dimensions.get('screen').height;
const screen = Dimensions.get('screen');

const OTP = props => {
  let interval;
  const email = props?.route?.params?.email;
  const [code, setCode] = useState('');
  const [countDown, setCountDown] = useState(30);
  const [isLoading, setisLoading] = useState(false);

  const onNewPasswordScreen = () => {
    props.navigation.navigate(screens.newPassword, {
      email,
    });
  };

  const btn_Verify = async () => {
    let t_code = code.trim();
    if (t_code == '') {
      showToast('Code should not be empty', 'Alert');
    } else if (t_code.length != 6) {
      showToast('Code must not less than 6 digit', 'Alert');
    } else {
      let obj_verify = {
        email: email.toLowerCase(),
        verification_code: t_code,
      };
      api_VerifyCode(obj_verify);
    }
  };

  const api_VerifyCode = async obj => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/app_api/code_verification',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        onNewPasswordScreen();
      } else {
        showToast(res.message);
      }
    }
  };

  const api_emailVerification = async () => {
    setisLoading(true);
    let res = await invokeApi({
      path: 'api/app_api/email_verification',
      method: 'POST',
      postData: {
        email: email,
      },
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        setCountDown(30);
      } else {
        showToast(res.message);
      }
    }
  };

  useEffect(() => {
    interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown == 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countDown]);
  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        translucent={true}
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{}}>
        <ImageBackground
          resizeMode="stretch"
          style={{height: height, width: '100%', backgroundColor: '#fff'}}
          source={require('../../Assets/Images/loginBackgorund.png')}>
          <View
            style={{
              marginTop:
                Platform.OS == 'android'
                  ? 50
                  : isIphoneX()
                  ? 50
                  : 50 - getStatusBarHeight(),
            }}>
            <Header navigation={props.navigation} title={'Verify Email'} />

            <View
              style={{
                height: height * 0.76,
                paddingHorizontal: 20,
                // paddingTop: 80,
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
                  Please enter 6 digit code sent to your email.
                </Text>
                {!!email && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.main,
                      fontFamily: font.medium,
                      textAlign: 'center',
                      textDecorationLine: 'underline',
                    }}>
                    {`${email}`}
                  </Text>
                )}
              </View>
              <View>
                <CodeField
                  {...props}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={code}
                  onChangeText={text => setCode(text)}
                  cellCount={6}
                  autoFocus={true}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <View key={index} style={styles.cellView}>
                      <Text
                        key={index}
                        style={styles.cell}
                        selectionColor={Colors.primary}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View style={{marginTop: 30}}>
                <CustomButton onPress={btn_Verify} title={'Verify'} />
              </View>

              <View style={{marginTop: 50, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: font.medium,
                    color: Colors.main,
                    fontSize: 14,
                  }}>
                  Didn't received code yet?
                </Text>
                <Pressable
                  onPress={api_emailVerification}
                  disabled={countDown != 0}
                  style={{padding: 0}}>
                  <Text
                    style={{
                      fontFamily: font.medium,
                      color: countDown == 0 ? Colors.primary : Colors.main,
                      fontSize: 14,
                    }}>
                    Resend code{' '}
                    {countDown != 0 ? 'in ' + countDown + 's' : 'again'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Loader
            enable={isLoading}
            style={{
              marginTop: Platform.OS == 'android' ? 110 : 100,
            }}
          />
        </ImageBackground>
      </KeyboardAwareScrollView>
    </>
  );
};

export default OTP;

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cellView: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.secondary,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 3,
    // height: 50,
    aspectRatio: 1,
    width: Platform.OS == 'android' ? 45 : 50,
    marginHorizontal: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    fontSize: 24,
    fontFamily: font.medium,

    borderWidth: 1,
    borderColor: Colors.gray02,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 35,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.black,
  },
  focusCell: {
    borderColor: '#000',
  },
});
