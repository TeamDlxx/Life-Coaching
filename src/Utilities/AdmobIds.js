import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';




export const Admob_Ids = Platform.select({
  ios: {
    // banner: TestIds.BANNER,
    // rewarded: TestIds.GAM_REWARDED_INTERSTITIAL,
    banner: 'ca-app-pub-1612661276193414/3522414246',
    rewarded: 'ca-app-pub-1612661276193414/4699764541'
  },
  android: {
    // banner: TestIds.BANNER,
    // rewarded: TestIds.REWARDED,
    banner: 'ca-app-pub-1612661276193414/3552037126',
    rewarded: 'ca-app-pub-1612661276193414/6078714849'
  },

});

