import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import {screens} from '../../Navigation/Screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const Onboarding = ({navigation}) => {
  const slider = useRef();

  const onLandingScreen = () => {
    // navigation.navigate(screens.landing);
    navigation.reset({
      index: 0,
      routes: [{name: screens.landing}],
    });
  };

  const OnboardingChecked = () => {
    AsyncStorage.setItem('@onboarding', 'true');
  };

  useEffect(() => {
    SplashScreen.hide();
    OnboardingChecked();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={_styleOB.slide}>
        <Image source={item.image} style={_styleOB.image} />
        <Text style={_styleOB.title}>{item.title}</Text>
        <Text style={_styleOB.text}>{item.text}</Text>

        <View
          style={{
            width: '100%',
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: '25%',
          }}>
          {slides.length - 1 == index ? (
            <CustomButton
              onPress={() => {
                onLandingScreen();
              }}
              title="Finish"
            />
          ) : (
            <CustomButton
              onPress={() => slider?.current?.goToSlide(index + 1)}
              title="Next feature"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.background}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <View style={{flex: 1}}>
        <AppIntroSlider
          ref={slider}
          renderItem={renderItem}
          data={slides}
          showNextButton={false}
          showDoneButton={false}
          activeDotStyle={{
            // width: 100,
            flex: 1,
            height: 3,
            backgroundColor: Colors.primary,
            marginHorizontal: 5,
          }}
          dotStyle={{
            flex: 1,
            height: 3,
            backgroundColor: '#E8E8E8',
            marginHorizontal: 5,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const slides = [
  {
    key: 1,
    title: 'Towards a better life',
    text: 'Improving your lifestyle by providing you multiple features like habit tracker, mood tracker and meditations.',
    image: require('../../Assets/Images/onbarding1.png'),
    backgroundColor: '#Fff',
  },
  {
    key: 2,
    title: 'Disciplined Life',
    text: 'Makes a sense of discipline by making your daily time table and tracking your routine.',
    image: require('../../Assets/Images/onbarding2.png'),
    backgroundColor: '#Fff',
  },
  {
    key: 3,
    title: 'Higher Motivations',
    text: 'Keeping you motivated by presenting you daily quotes, different meditations and reminders.',
    image: require('../../Assets/Images/onbarding3.png'),
    backgroundColor: '#Fff',
  },
];

const _styleOB = StyleSheet.create({
  slide: {
    alignItems: 'center',
    // marginTop: 50,
    flex: 1,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: font.regular,
  },
  text: {
    fontSize: 16,
    color: '#9E9D9D',
    marginTop: 10,
    fontFamily: font.regular,
    textAlign: 'center',
  },
  image: {
    height: 350,
    width: 350,
    marginTop: 50,
  },
});
