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

const height = Dimensions.get('screen').height;

const ForgotPassword = props => {
  const [email, setEmail] = useState('');

  const onOTPScreen = () => {
    props.navigation.navigate(screens.otp);
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
        keyboardShouldPersistTaps={"handled"}
        style={{}}>
        <ImageBackground
          resizeMode="stretch"
          style={{height: height, width: '100%', backgroundColor: '#fff'}}
          source={require('../../Assets/Images/loginBackgorund.png')}>
          <View style={{marginTop: 50}}>
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
                />
              </View>

              <View style={{marginTop: 30}}>
                <CustomButton
                  onPress={() => onOTPScreen()}
                  title={'Send Email'}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </>
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
