import {
  Text,
  StatusBar,
  SafeAreaView,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import Header from '../../Components/Header';
import {mainStyles} from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';

const screen = Dimensions.get('screen');
const ic_airBalllon = require('../../Assets/Images/AirBalloon.png');

const ComingSoon = props => {
  const {params} = props?.route;
  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={params?.title} />

      <View
        style={{
          flex: 0.8,
          alignItems: 'center',
          justifyContent: 'center',
          // marginBottom:"30%",
          // backgroundColor: 'pink',
        }}>
        <View
          style={{
            width: screen.width * 0.5,
            height: screen.width * 0.5,
            borderRadius: (screen.width * 0.5) / 2,
            backgroundColor: Colors.lightPrimary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={ic_airBalllon}
            style={{width: screen.width / 3, height: screen.width / 3}}
          />
        </View>
        <View style={{width: screen.width * 0.7}}>
          <View
            style={{
              marginTop: 30,

              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: 20,
                textAlign: 'center',
              }}>
              We are Coming Soon!
            </Text>
          </View>
          <View style={{marginTop: 5}}>
            <Text
              style={{
                fontFamily: font.regular,
                color: Colors.gray14,
                fontSize: 14,
                textAlign: 'center',
              }}>
              {`The ${params?.title} is soon coming up with some amazing and helpful features to track your moods, So keep yourself updated with new upcoming features.`}
            </Text>
          </View>

          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 10,
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: Colors.white,
                }}>
                Notify when available
              </Text>
            </Pressable>
          </View>
          {/* <Text
            style={{
              fontFamily: font.regular,
              fontSize: 14,
              color: Colors.black,
              textAlign: 'center',
              marginTop: 10,
            }}>
            when available
          </Text> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComingSoon;
