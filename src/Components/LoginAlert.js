import {View, Text, Alert} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {screens} from '../Navigation/Screens';

// const LoginAlert = async (navigation, screenName) => {
//   const AsyncAlert = async () =>
//     new Promise(resolve => {
//       Alert.alert(
//         'Login Please',
//         'Please login to continue...',
//         [
//           {
//             text: 'Not Now',
//             onPress: () => {
//               resolve('NO');
//             },
//           },
//           {
//             text: 'Login',
//             onPress: async () => {
//               try {
//                 await navigation.navigate(screens.Login, {
//                   from: screenName,
//                 });
//                 resolve('YES');
//               } catch (e) {
//                 resolve('YES');
//               }
//             },
//           },
//         ],
//         {cancelable: false},
//       );
//     });

//   await AsyncAlert();

//   // await Alert.alert('Login Please', 'Please login to continue...', [
//   //   {
//   //     text: 'Not Now',
//   //     onPress: async () => {
//   //       return false;
//   //     },
//   //   },
//   //   {
//   //     text: 'Login',
//   //     onPress: async () => {
//   //       try {
//   //         await navigation.navigate(screens.Login, {
//   //           from: screenName,
//   //         });
//   //         return true;
//   //       } catch (e) {
//   //         return false;
//   //       }
//   //     },
//   //   },
//   // ]);
//   // return res;
// };

const LoginAlert = (navigation, screenName) =>
  new Promise(resolve => {
    Alert.alert(
      'Login Please',
      'Please login to continue...',
      [
        {text: 'Not Now'},
        {
          text: 'Login',
          onPress: async () => {
            resolve();
          },
        },
      ],
      {cancelable: true},
    );
  }).then(() => {
    navigation.navigate(screens.Login, {
      logout: false,
      from: screenName,
    });
  });

export default LoginAlert;
