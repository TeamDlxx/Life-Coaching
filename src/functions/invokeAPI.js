import axios from 'axios';
import {baseURL} from '../Utilities/domains';
import showToast from '../functions/showToast';
import {screens} from '../Navigation/Screens';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default async function invokeApi({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  postData = {},
  navigation,
}) {
  console.log('invoke--?', navigation);
  const reqObj = {
    method,
    url: baseURL + path,
    headers,
  };

  reqObj.params = queryParams;

  if (method === 'POST') {
    reqObj.data = postData;
  }
  if (method === 'PUT') {
    reqObj.data = postData;
  }
  if (method === 'DELETE') {
    reqObj.data = postData;
  }

  let results;

  console.log('<===REQUEST-OBJECT===>', reqObj);

  try {
    results = await axios(reqObj);
    console.log('<===Api-Success-Result===>', results);
    return results.data;
  } catch (error) {
    console.log('<===Api-Error===>', error.response.data);
    console.log('<===Api-Error===>', error);
    if (error.code == 'ERR_NETWORK') {
      showToast('', 'No Internet Connection', 'error');
      return;
    } else if (error?.response?.status === 401) {
      if (navigation != undefined) {
        showToast('Please login again!', 'Authentication Failed');
        try {
          let res = await AsyncStorage.multiRemove(['@token', '@user']);
          navigation.reset({
            index: 0,
            routes: [{name: screens.landing}],
          });
        } catch (e) {
          navigation.reset({
            index: 0,
            routes: [{name: screens.landing}],
          });
        }
      }
    }

    return {
      code: error.response.status,
      message: error.response.data.message ? error.response.data.message : '',
    };
  }
}
