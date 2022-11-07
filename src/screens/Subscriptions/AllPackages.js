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

  const View_Packages = (item, index) => {
    let isDark = index % 2 == 0 ? true : false;
    return (
      <View
        style={{
          marginBottom: 10,
          backgroundColor: isDark ? Colors.white : Colors.primary,
          borderColor: Colors.gray02,
          borderWidth: 1,
          padding: 5,
          borderRadius: 10,
        }}>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: 18,
              color: isDark ? Colors.primary : Colors.white,
            }}>
            {item?.name}
          </Text>
        </View>

        <View
          style={{
            marginTop: 5,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: font.bold,
              color: isDark ? Colors.primary : Colors.white,
            }}>
            {item?.price + '$'}
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          {item?.description.map((x, i) => (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 5,
                  width: 5,
                  borderRadius: 2.5,
                  backgroundColor: isDark ? Colors.primary : Colors.white,
                  marginTop: 6,
                  marginRight: 5,
                }}
              />
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    includeFontPadding: false,
                    color: isDark ? Colors.primary : Colors.white,
                  }}>
                  {x}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable
          style={{
            backgroundColor: isDark ? Colors.primary : Colors.white,
            alignItems: 'center',
            borderRadius: 10,
            marginVertical: 10,
            marginHorizontal: 30,
            marginTop: 30,
          }}>
          <Text
            style={{
              fontFamily: font.bold,
              color: isDark ? Colors.white : Colors.primary,
              paddingVertical: 10,
            }}>
            Buy
          </Text>
        </Pressable>
      </View>
    );
  };

  const Yearly = () => {
    return (
      <View style={{}}>
        <View>
          <Text style={{fontFamily: font.bold, fontSize: 16}}>Lifetime</Text>
        </View>
        <View
          style={{
            marginBottom: 10,
            backgroundColor: Colors.white,
            borderColor: Colors.gray02,
            borderWidth: 1,
            padding: 5,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <View style={{alignItems: 'center', marginTop: 5}}>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: 16,
                color: Colors.primary,
                textAlign: 'center',
              }}>
              {'Unlock all features'}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            {[
              'Access to all tracks',
              'Download & listen without internet',
              'Unlimited Habits',
              'Unlimited time for Habits',
              'Reminder',
            ].map((x, i) => (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 2.5,
                    backgroundColor: Colors.black,
                    marginTop: 4,
                    marginRight: 5,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.regular,
                      fontSize: 10,
                      includeFontPadding: false,
                    }}>
                    {x}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <Text style={{fontSize: 22, fontFamily: font.bold}}>
              {15 + '$'}
            </Text>
          </View>
        </View>
      </View>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable onPress={() => setTab(1)} style={{padding: 10}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 16,
                color: tab == 1 ? Colors.primary : Colors.black,
              }}>
              Monthly
            </Text>
            <View
              style={{
                height: 4,
                backgroundColor: tab == 1 ? Colors.primary : Colors.background,
                borderRadius: 10,
                marginTop: 3,
                width: '50%',
              }}
            />
          </Pressable>
          <Pressable onPress={() => setTab(2)} style={{marginLeft: 10}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 16,
                color: tab == 2 ? Colors.primary : Colors.black,
              }}>
              Lifetime
            </Text>
            <View
              style={{
                height: 4,
                backgroundColor: tab == 2 ? Colors.primary : Colors.background,
                borderRadius: 10,
                marginTop: 3,
                width: '50%',
              }}
            />
          </Pressable>
        </View>
        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            // numColumns={2}
            showsVerticalScrollIndicator={false}
            data={Monthlypackages}
            renderItem={({item, index}) => View_Packages(item, index)}
            // ListFooterComponent={Yearly()}
          />
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
