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
import {CodeField, Cursor} from 'react-native-confirmation-code-field';

const height = Dimensions.get('screen').height;
const screen = Dimensions.get('screen');

const OTP = props => {
  const [code, setCode] = useState('');

  const onNewPasswordScreen = () => {
    props.navigation.navigate(screens.newPassword);
  };

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
          <View style={{marginTop: 50}}>
            <Header navigation={props.navigation} title={'Verify Email'} />

            <View
              style={{
                height: height * 0.66,
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
                <CustomButton
                  onPress={() => onNewPasswordScreen()}
                  title={'Verify'}
                />
              </View>
            </View>
          </View>
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

    borderWidth:1,
    borderColor:Colors.gray02
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
