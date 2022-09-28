/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';


PushNotification.createChannel(
  {
    channelId: '123', // (required)
    channelName: 'Done', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log('Channel Created Successfully -->\n', created), // (optional) callback returns whether the channel was created, false means it already existed.
);

const onMessageReceived = remoteMessage => {
  PushNotification.localNotification({
    channelId: '123',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    userInfo: remoteMessage.data,
    messageId: remoteMessage.messageId,
    // smallIcon: 'ic_notification',
  });
};

messaging().onMessage(onMessageReceived);

messaging().setBackgroundMessageHandler(async remoteMessage => {});

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./service'));

