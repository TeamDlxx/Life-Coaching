import AsyncStorage from '@react-native-async-storage/async-storage';

const getTokenFromAsync = async () => {
  return AsyncStorage.getItem('@token').then(val => {
    if (val != null) {
      return val;
    } else {
    }
  });
};

export default getTokenFromAsync;
