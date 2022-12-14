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

  console.log('<===REQUEST-OBJECT===>\n', reqObj);

  try {
    results = await axios(reqObj);
    console.log('<===Api-Success-Result===>\n', results);
    return results.data;
  } catch (error) {
    console.log('<===Api-Error===>\n', error.response.data);
    console.log('<===Api-Error===>\n', error);
    if (error.code == 'ERR_NETWORK') {
      return {
        code: 'ERR_NETWORK',
        message: 'No Internet Connection',
      };
    } else if (error?.response?.data?.code === 401) {
      if (navigation != undefined) {
        showToast('Please login again!', 'Authentication Failed');
        try {
          let res = await AsyncStorage.multiRemove(['@token', '@user']);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: screens.landing,
                params: {
                  logout: true,
                },
              },
            ],
          });
        } catch (e) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: screens.landing,
                params: {
                  logout: true,
                },
              },
            ],
          });
        }
      }
    }

    return {
      code: error.response.status,
      message: error.response.data.message
        ? error.response.data.message
        : error.message,
    };
  }
}
