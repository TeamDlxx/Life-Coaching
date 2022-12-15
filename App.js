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
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {BaseToast, ErrorToast} from 'react-native-toast-message';

const toastConfig = {
  success: props => <BaseToast {...props} text2NumberOfLines={2} />,
  error: props => <ErrorToast {...props} text2NumberOfLines={2} />,
};

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const App = props => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  const handleDynamicLink = link => {
    console.log('handleDynamicLink', link);
  };

  React.useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    TrackplayerSetup();
    initConnection().then(x => {
      console.log('initConnection', x);
    });
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log('getInitialLink', link);
      });
    return () => {
      endConnection();
      unsubscribe();
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
      <NavigationContainer>
        <AuthStack />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </ContextWrapper>
  );
};

export default App;
