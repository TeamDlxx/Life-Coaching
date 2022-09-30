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

import showToast from '../../functions/showToast';
import {validateEmail, checkSpace} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';

const height = Dimensions.get('screen').height;

const NewPassword = props => {
  const email = props?.route?.params?.email;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const btn_chnagePassword = () => {
    let t_password = password;
    let t_newPassword = confirmPassword;
    if (t_password == '') {
      showToast('Please enter your password', 'Alert');
    } else if (checkSpace(t_password)) {
      showToast('Password should not have white spaces', 'Alert');
    } else if (t_password.length < 6) {
      showToast('Password length must be minimim 6 letters', 'Alert');
    } else if (t_password != t_newPassword) {
      showToast('Passwords are not matched', 'Alert');
    } else {
      let obj_resetPassword = {
        email: email.toLowerCase(),
        password: t_password,
        confirm_password: t_newPassword,
      };
      setisLoading(true);
      api_resetPassword(obj_resetPassword);
    }
  };

  const api_resetPassword = async obj => {
    let res = await invokeApi({
      path: 'api/app_api/reset_password',
      method: 'POST',
      postData: obj,
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        onLoginScreen();
      } else {
        showToast(res.message);
      }
    }
  };
  const onLoginScreen = () => {
    props.navigation.navigate(screens.Login);
  };

  return (
    <>
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
        <ImageBackground
          resizeMode="stretch"
          style={{height: height, width: '100%', backgroundColor: '#fff'}}
          source={require('../../Assets/Images/loginBackgorund.png')}>
          <View style={{marginTop: 50}}>
            <Header navigation={props.navigation} title={'Change Password'} />

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
                  Please enter your new password.
                </Text>
              </View>
              <View>
                <View style={{marginTop: 20}}>
                  <CustomPasswordTextInput
                    lable={'Password'}
                    placeholder={'Password'}
                    onChangeText={text => setPassword(text)}
                    value={password}
                  />
                </View>

                <View style={{marginTop: 20}}>
                  <CustomPasswordTextInput
                    lable={'Confirm Password'}
                    placeholder={'Confirm Password'}
                    onChangeText={text => setConfirmPassword(text)}
                    value={confirmPassword}
                  />
                </View>
              </View>

              <View style={{marginTop: 30}}>
                <CustomButton
                  onPress={btn_chnagePassword}
                  title={'Change Password'}
                />
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

export default NewPassword;
