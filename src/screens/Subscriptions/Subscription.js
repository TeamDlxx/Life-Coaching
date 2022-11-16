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
import ReactNativeBlobUtil from 'react-native-blob-util';

const Subscription = props => {
  const {Token} = useContext(Context);

  const descriptionView = ({item}) => {
    return (
      <View key={item.id} style={_styleSubscription.itemView}>
        <Text style={_styleSubscription.titleText}>{item.title}</Text>
        <View style={_styleSubscription.descriptionView}>
          <Text style={_styleSubscription.descriptionText}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const footerView = () => {
    return (
      <View>
        <View style={_styleSubscription.itemView}>
          <Text style={_styleSubscription.titleText}>Subscription Plans</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.gray04,
              width: '100%',
              marginTop: 20,
              padding: 20,
              borderRadius: 10,
            }}>
            <Text
              style={{
                backgroundColor: Colors.background,
                position: 'absolute',
                top: -9,
                // left: 0,
                // right: 0,
                // textAlign: 'center',
                color: Colors.gray13,
                alignSelf: 'center',
                fontFamily: font.regular,
                paddingHorizontal: 10,
                letterSpacing: 0.5,
                fontSize: 12,
              }}>
              After 3-days Trail
            </Text>

            <Pressable style={_styleSubscription.btnView1}>
              <Text style={_styleSubscription.btnText}>
                Rs 650.00{' '}
                <Text style={_styleSubscription.btnSubText}>
                  Monthly Subscription
                </Text>
              </Text>
            </Pressable>
            <Text style={_styleSubscription.subText}>Billed Every Month</Text>
            <View style={{marginTop: 20}}>
              <Pressable style={_styleSubscription.btnView1}>
                <Text style={_styleSubscription.btnText}>
                  Rs 1150.00{' '}
                  <Text style={_styleSubscription.btnSubText}>
                    3 Months Subscription
                  </Text>
                </Text>
              </Pressable>
              <Text style={_styleSubscription.subText}>
                Billed Every 3 Months
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 20, paddingHorizontal: 25}}>
          <Pressable style={_styleSubscription.btnView}>
            <Text style={_styleSubscription.btnText}>
              Rs 2150.00{' '}
              <Text style={_styleSubscription.btnSubText}>Lifetime Access</Text>
            </Text>
          </Pressable>
        </View>
        <View style={{marginTop: 20}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: font.regular,
              color: Colors.gray13,
            }}>
            Cancel subscription any time. Subscription automatically renews
            unless auto renew is turned off at least 24-hours before the end of
            the current period by going to your iOS Account Settings after
            purchase. Payment will be charged to itunes Account. Any unused
            portion of free trial period. If offered, will be forteified when
            you purchase a subscription.
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable style={{padding: 20}}>
            <Text
              style={{
                fontFamily: font.bold,
                color: Colors.primary,
              }}>
              Privacy Policy
            </Text>
          </Pressable>
          <Text style={{fontFamily: font.bold, color: Colors.gray13}}>&</Text>
          <Pressable style={{padding: 20}}>
            <Text style={{fontFamily: font.bold, color: Colors.primary}}>
              Term of Use
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const dirs = ReactNativeBlobUtil.fs.dirs;

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header titleAlignLeft title="RN DIR" navigation={props.navigation} />
      <View style={{flex: 1}}>
        {Object.keys(dirs).map(x => (
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: Colors.black,
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <Text>{x}</Text>
            </View>
            <View style={{flex: 2, borderLeftWidth: 1,padding:5}}>
              <Text>{dirs[x]}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header
        titleAlignLeft
        title="Subscription"
        navigation={props.navigation}
      />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={arr_description}
          renderItem={descriptionView}
          ListFooterComponent={footerView()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Subscription;

const _styleSubscription = StyleSheet.create({
  itemView: {
    alignItems: 'center',
    marginTop: 30,
  },
  titleText: {fontFamily: font.bold, fontSize: 16, textAlign: 'center'},
  descriptionView: {
    marginTop: 5,
  },
  descriptionText: {
    fontFamily: font.regular,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.gray13,
  },
  btnView: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnView1: {
    backgroundColor: Colors.gray06,

    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    color: Colors.white,
    fontFamily: font.bold,
    textAlign: 'center',
    fontSize: 16,
  },
  btnSubText: {
    color: Colors.white,
    fontFamily: font.medium,
    fontSize: 12,
  },
  subText: {
    fontFamily: font.regular,
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: Colors.gray13,
  },
});

const arr_description = [
  {
    id: '1',
    title: 'All Contents & Features',
    description: 'Unlock more features & additional hours of audio content.',
  },

  {
    id: '2',
    title: 'Offline Listenings',
    description: 'Save to favourites and listen wherever.',
  },

  {
    id: '3',
    title: 'Free Updates',
    description: 'Access to all new content and features.',
  },
  {
    id: '4',
    title: '100% Satisfaction Guarantee',
    description: "if anything went wrong just Email us we'll make it right.",
  },
];
