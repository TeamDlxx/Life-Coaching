import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';

const Admob_Ids = Platform.select({
  ios: {
    banner:!__DEV__ ? 'ca-app-pub-1612661276193414/3453084331' : TestIds.BANNER,
    rewarded: !__DEV__
      ? 'ca-app-pub-1612661276193414/1291074987'
      : TestIds.REWARDED,
  },
  android: {
    banner: !__DEV__ ? 'ca-app-pub-1612661276193414/3552037126' : TestIds.BANNER,
    rewarded: !__DEV__
      ? 'ca-app-pub-1612661276193414/6078714849'
      : TestIds.REWARDED,
  },
});

export default Admob_Ids;
