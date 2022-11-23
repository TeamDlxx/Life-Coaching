import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment';
import AuthStack from './src/Navigation/AuthStack';
import TrackPlayer from 'react-native-track-player';
import {Capability} from 'react-native-track-player';
import Toast from 'react-native-toast-message';
import ContextWrapper from './src/Context/ContextWrapper';
import {Text} from 'react-native';
import {initConnection, endConnection} from 'react-native-iap';
import analytics from '@react-native-firebase/analytics';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const App = props => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    TrackplayerSetup();
    initConnection().then(x => {
      console.log('initConnection', x);
    });
    return () => {
      endConnection();
    };
  }, []);

  const TrackplayerSetup = async () => {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpBackward,
        Capability.JumpForward,
        Capability.SeekTo,
      ],
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpBackward,
        Capability.JumpForward,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
  };

  return (
    <ContextWrapper>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current =
            navigationRef?.current?.getCurrentRoute()?.name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef?.current;
          const currentRouteName =
            navigationRef?.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    </ContextWrapper>
  );
};

export default App;
