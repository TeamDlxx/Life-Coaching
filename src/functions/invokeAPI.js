import axios from 'axios';
import {baseURL} from '../Utilities/domains';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export default async function invokeApi({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  postData = {},
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

  console.log('<===REQUEST-OBJECT===>', reqObj);

  try {
    results = await axios(reqObj);
    console.log('<===Api-Success-Result===>', results);
    return results.data;
  } catch (error) {
    console.log('<===Api-Error===>', error.response.data);
    console.log('<===Api-Error===>', error);
    if (error.response.status === 401) {
      // localStorage.clear();
      // window.location.reload();
    }
    return {
      code: error.response.status,
      message: error.response.data.message ? error.response.data.message : '',
    };
  }
}
