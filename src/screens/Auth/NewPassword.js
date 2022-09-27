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

const NewPassword = props => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        keyboardShouldPersistTaps={"handled"}
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
                  onPress={() => onLoginScreen()}
                  title={'Change Password'}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </>
  );
};

export default NewPassword;
