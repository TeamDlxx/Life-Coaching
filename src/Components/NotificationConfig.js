import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {screens} from '../Navigation/Screens';

export default function NotificationConfig(props) {
  console.log('NotificationConfig Props', props);
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {},

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('onNotification', notification);
      if (notification.userInteraction) {
        NotificationAction(notification);
      }
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.log(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,

    requestPermissions: true,
  });

  const NotificationAction = notification => {
    let {data} = notification;
    console.log(data, 'notificationId');
    switch (data.type) {
      case 'quotes':
        props.navigation.reset({
          index: 0,
          routes: [
            {name: screens.bottomTabs},
            {
              name: screens.qouteList,
              params: {
                _id: data._id,
              },
            },
          ],
        });

        break;

      case 'habit':
        props.navigation.reset({
          index: 0,
          routes: [
            {name: screens.bottomTabs},
            {name: screens.habitTracker},
            {name: screens.habitDetail, params: {id: data._id}},
          ],
        });

        break;
      case 'track_download':
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: screens.bottomTabs,
              params: {
                screen: screens.profile,
              },
            },
            {name: screens.dowloadedTracks, params: {id: data._id}},
          ],
        });
        break;
    }
  };
}
