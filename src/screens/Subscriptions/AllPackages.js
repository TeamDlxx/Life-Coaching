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
  TouchableOpacity,
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

//Icons

const ic_filledTick = require('../../Assets/Icons/circleFilledCheck.png');
const ic_star = require('../../Assets/pkgIcons/star.png');
const ic_diamond = require('../../Assets/pkgIcons/diamond.png');
const ic_crown = require('../../Assets/pkgIcons/crown.png');
const ic_tick = require('../../Assets/Icons/tick.png');

const AllPackages = props => {
  const {Token} = useContext(Context);
  const {navigation} = props;
  const {params} = props.route;
  const [selectedPkg, setSelectedPkg] = useState(packages[0]);

  const formatPrice = price => {
    if (price < 10) {
      return '0' + price + '.00';
    }
    return price + '.00';
  };

  const FlatListHeader = () => {
    return (
      <View style={{marginBottom: 0}}>
        <View style={{marginTop: 20}}>
          <Text
            style={{fontFamily: font.bold, fontSize: 30, color: Colors.black}}>
            Get Access to more Features
          </Text>
        </View>

        <View style={{marginTop: 15}}>
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: 14,
              color: Colors.gray10,
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut
          </Text>
        </View>

        <View style={{marginTop: 25}}>
          {selectedPkg?.description.map((x, i) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Image
                  source={ic_filledTick}
                  style={{height: 15, width: 15, tintColor: Colors.completed}}
                />
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    color: Colors.black,
                    marginLeft: 5,
                  }}>
                  {x}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={{marginTop: 25}}>
          <Text
            style={{
              color: Colors.darkPrimary,
              fontSize: 16,
              fontFamily: font.bold,
            }}>
            Select your subscription
          </Text>
        </View>
      </View>
    );
  };

  const pkgView = ({item, index}) => {
    return (
      <Pressable
        onPress={() => setSelectedPkg(item)}
        style={{
          marginTop: 10,
          backgroundColor: Colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: selectedPkg._id == item._id ? 2 : 1,
          borderColor:
            selectedPkg._id == item._id ? Colors.primary : Colors.gray02,
          minHeight: 80,
          paddingHorizontal: 10,
          borderRadius: 20,
        }}>
        <Image
          source={
            item?.type == 'star'
              ? ic_star
              : item?.type == 'diamond'
              ? ic_diamond
              : item?.type == 'crown'
              ? ic_crown
              : null
          }
          style={{height: 50, width: 50}}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            {item.duration}
          </Text>
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: 12,
              marginTop: 5,
            }}>
            {item.name}
          </Text>
        </View>

        <View style={{marginLeft: 10}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 18,
              textTransform: 'capitalize',
              color: Colors.primary,
            }}>
            {`$ ${formatPrice(item.price)}`}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Subscriptions" navigation={props.navigation} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{flex: 1}}>
          <FlatList
            data={packages}
            ListHeaderComponent={FlatListHeader()}
            renderItem={pkgView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
        <View style={{}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
              backgroundColor: Colors.primary,
              borderRadius: 30,
              paddingHorizontal: 5,
            }}>
            <View style={{height: 50, width: 50}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.medium,
                  color: Colors.white,
                  fontSize: 16,
                }}>
                Subscribe Now
              </Text>
            </View>
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: Colors.lightPrimary3,
                borderRadius: 40 / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ic_tick}
                style={{height: 20, width: 20, tintColor: Colors.white}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllPackages;

const packages = [
  {
    _id: '1',
    name: 'Habits',
    description: ['Unlimited Habits', 'Unlimited time for Habits', 'Reminder'],
    price: 3,
    type: 'star',
    duration: 'monthly',
  },
  {
    _id: '2',
    name: 'Meditations',
    description: ['Access to all tracks', 'Download & listen without internet'],
    price: 3,
    type: 'star',
    duration: 'monthly',
  },
  {
    _id: '3',
    name: 'All in one',
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
    ],
    price: 5,
    type: 'diamond',
    duration: 'monthly',
  },
  {
    _id: '4',
    name: 'Access to all features',
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
    ],
    price: 15,
    type: 'crown',
    duration: 'lifetime',
  },
];
