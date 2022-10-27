import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment';
import AuthStack from './src/Navigation/AuthStack';
import TrackPlayer from 'react-native-track-player';
import {Capability} from 'react-native-track-player';
import Toast from 'react-native-toast-message';
import ContextWrapper from './src/Context/ContextWrapper';
import {Text} from 'react-native';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

console.log('Capabilities', Capability);

const App = props => {
  React.useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    TrackplayerSetup();
  }, []);

  const TrackplayerSetup = async () => {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
    });
  };

  return (
    <ContextWrapper>
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    </ContextWrapper>
  );
};

export default App;
