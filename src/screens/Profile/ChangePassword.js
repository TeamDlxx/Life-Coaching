import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import React from 'react';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {CustomPasswordTextInput} from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
const ChangePassword = props => {
  const [passwords, updatePasswords] = React.useState({
    old: '',
    new: '',
    confirm: '',
  });

  const setPasswords = updation => updatePasswords({...passwords, ...updation});

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Change Password" navigation={props.navigation} />

      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{marginTop: 20}}>
          <CustomPasswordTextInput
            placeholder="Enter your old password"
            value={passwords.old}
            lable={'Old Password'}
            onChangeText={text => setPasswords({old: text})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <CustomPasswordTextInput
            placeholder="Enter your new password"
            value={passwords.new}
            lable={'New Password'}
            onChangeText={text => setPasswords({new: text})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <CustomPasswordTextInput
            placeholder="Enter your new password again"
            value={passwords.confirm}
            lable={'Confirm Password'}
            onChangeText={text => setPasswords({confirm: text})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <CustomButton title="Save" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
