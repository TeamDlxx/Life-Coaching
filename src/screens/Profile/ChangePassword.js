import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {CustomPasswordTextInput} from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';

import showToast from '../../functions/showToast';
import {isFirstLetterAlphabet} from '../../functions/regex';
import Loader from '../../Components/Loader';
import invokeApi from '../../functions/invokeAPI';
import getTokenFromAsync from '../../functions/getTokenFromAsync';
import {fileURL} from '../../Utilities/domains';
import {checkSpace} from '../../functions/regex';

import {useContext} from 'react';
import Context from '../../Context';

const ChangePassword = props => {
  const [Token] = useContext(Context);
  const [isLoading, setisLoading] = useState(false);
  const [passwords, updatePasswords] = React.useState({
    old: '',
    new: '',
    confirm: '',
  });

  const setPasswords = updation => updatePasswords({...passwords, ...updation});

  const btn_Save = () => {
    let t_oldPassword = passwords.old;
    let t_new = passwords.new;
    let t_confirm = passwords.confirm;

    if (t_oldPassword == '') {
      showToast('Please enter old password', 'Alert');
    } else if (t_oldPassword.length < 6) {
      showToast('Password length must be minimim 6 letters', 'Alert');
    } else if (t_new == '') {
      showToast('Please enter new password');
    } else if (checkSpace(t_new)) {
      showToast('Password should not have white spaces', 'Alert');
    } else if (t_new.length < 6) {
      showToast('Password length must be minimim 6 letters', 'Alert');
    } else if (t_confirm == '') {
      showToast('Please confirm your password', 'Alert');
    } else if (t_confirm != t_new) {
      showToast('New and Confirm password do not match', 'Alert');
    } else {
      let obj_changePassword = {
        old_password: t_oldPassword,
        new_password: t_new,
        confirm_password: t_confirm,
      };
      setisLoading(true);
      api_changePassword(obj_changePassword);
    }
  };

  const api_changePassword = async obj => {
    let res = await invokeApi({
      path: 'api/app_api/change_password',
      method: 'PUT',
      postData: obj,
      headers: {
        'x-sh-auth': Token,
      },
    });
    if (res) {
      setisLoading(false);
      if (res.code == 200) {
        await props.navigation.goBack();
        showToast(
          'Password has been changed',
          'Password Changed Successfully',
          'success',
        );
      } else {
        showToast(res.message);
      }
    }
  };


  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Change Password" navigation={props.navigation} />

      <View style={{flex: 1, paddingHorizontal: 20}}>
        <Loader enable={isLoading} />
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
          <CustomButton title="Save" onPress={btn_Save} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
