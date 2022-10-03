import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment';
import AuthStack from './src/Navigation/AuthStack';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-toast-message';
import {ContextProvider} from './src/Context';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const App = props => {
  const [Token, setToken] = React.useState(null);
  
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
    <ContextProvider value={[Token, setToken]}>
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
