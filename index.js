/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import { Capability } from 'react-native-track-player';

import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';


TrackPlayer.setupPlayer({
  waitForBuffer: false,
}).then(() => {
  TrackPlayer.updateOptions({
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
});




PushNotification.createChannel(
  {
    channelId: '6007', // (required)
    channelName: 'lifeCoaching', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log('Channel Created Successfully -->\n', created), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.createChannel(
  {
    channelId: '7007', // (required)
    channelName: 'BetterMe', // (required)
    channelDescription: 'Channel for push notification', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log('Channel Created Successfully -->\n', created), // (optional) callback returns whether the channel was created, false means it already existed.
);

const notificationBadgeCount = async (data) => {
  if(data.type == 'quotes'){
    let count = parseInt(await AsyncStorage.getItem('@badgeCount'))
    if(count != null){
      count = count + 1;
      console.log(count, "total badge count...")
      await AsyncStorage.setItem('@badgeCount', JSON.stringify(count));
    } else {
      await AsyncStorage.setItem('@badgeCount', "1");
    }
  }
}

const onMessageReceived = async remoteMessage => {
  console.log(remoteMessage, 'onMessage... foreground');

  notificationBadgeCount(remoteMessage.data)

  // await PushNotification.localNotification({
  //   channelId: '7007',
  //   channelName: 'BetterMe',
  //   title: remoteMessage.notification.title,
  //   message: !!remoteMessage?.notification?.body
  //     ? remoteMessage?.notification?.body
  //     : "Tap to read today's quote",
  //   picture: remoteMessage?.notification?.android?.imageUrl,
  //   userInfo: remoteMessage.data,
  //   messageId: remoteMessage.messageId,
  //   smallIcon: 'ic_stat_name',
  // });


};

messaging().onMessage(onMessageReceived);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage, 'onMessagsetBackgroundMessageHandlereReceived...');
  notificationBadgeCount(remoteMessage.data)
});

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => require('./service'));
