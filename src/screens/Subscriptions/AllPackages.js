import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Platform,
  PermissionsAndroid,
  BackHandler,
  Alert,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {mainStyles} from '../../Utilities/styles';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import CustomButton from '../../Components/CustomButton';
import {useContext} from 'react';
import Context from '../../Context';
import Subscription from './Subscription';

const screen = Dimensions.get('screen');

const AllPackages = props => {
  const {Token} = useContext(Context);
  const {navigation} = props;
  const {params} = props.route;
  const [tab, setTab] = useState(1);

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Subscriptions" navigation={props.navigation} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{marginTop: 10}}>
          <Text
            style={{fontFamily: font.bold, fontSize: 30, color: Colors.black}}>
            Get Access to all Features
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: 14,
              color: Colors.black,
            }}>
            Congrats
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllPackages;

const Monthlypackages = [
  {
    id: '1',
    name: 'Habits',
    description: ['Unlimited Habits', 'Unlimited time for Habits', 'Reminder'],
    price: 3,
  },
  {
    id: '2',
    name: 'Meditations',
    description: ['Access to all tracks', 'Download & listen without internet'],
    price: 3,
  },
  {
    id: '3',
    name: 'Habits + Meditations',
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
    ],
    price: 5,
  },
];
