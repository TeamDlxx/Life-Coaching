import {View, Text} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import Colors from '../Utilities/Colors';

const IAP_Modal = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      // onBackButtonPress={() => setVisibleAddHabitModal(false)}
      // onBackdropPress={() => setVisibleAddHabitModal(false)}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      style={{}}>
      <View
        style={{
          backgroundColor: Colors.background,
          minHeight: 200,
          borderRadius: 10,
          // marginHorizontal:-10
          // borderRadius: 10,
          // paddingVertical: 20,
        }}>
        <View>
          <Text>Purchase</Text>
        </View>
      </View>
    </Modal>
  );
};

export default IAP_Modal;
