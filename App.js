import {View, Text} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaView, StatusBar} from 'react-native';
import moment from 'moment';
import AuthStack from './src/Navigation/AuthStack';
import TrackPlayer from 'react-native-track-player';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import Home from './src/screens/Home/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
    TrackplayerSetup();
  }, []);
  
  const TrackplayerSetup = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
    });
  };

  return (
    <NavigationContainer>
      <AuthStack />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
