import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';




export const Admob_Ids = Platform.select({
  ios: {
    banner: TestIds.BANNER,
    rewarded: TestIds.GAM_REWARDED_INTERSTITIAL,
    // banner: 'ca-app-pub-2781622842125846/2905395511',
    // rewarded: 'ca-app-pub-2781622842125846/7036212213'
  },
  android: {
    banner: TestIds.BANNER,
    rewarded: TestIds.REWARDED,
    // banner: 'ca-app-pub-2781622842125846/8157722198',
    // rewarded: 'ca-app-pub-2781622842125846/9007769438'
  },

});

