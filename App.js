import {View, Text} from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaView, StatusBar} from 'react-native';
import moment from 'moment';
import AuthStack from './src/Navigation/AuthStack';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const App = props => {
  React.useEffect(() => {
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
