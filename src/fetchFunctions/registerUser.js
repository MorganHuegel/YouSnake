import { SERVER_BASE_URL } from './config'
import DeviceInfo from 'react-native-device-info';

import { fetchLogin } from './login';

export function registerUser (username, password) {
  const phoneId = DeviceInfo.getUniqueID()
  return fetch(`${SERVER_BASE_URL}/users/register`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username, 
      password,
      phoneId
    })
  })
  .then(res => res.json())
  .then(response => {
    console.log('Successful register fetch!', response)
    if (response.userId) {
      return fetchLogin(username, password)
    } else if (response.error) {
      return Promise.reject(response.error)
    } else {
      return Promise.reject('An error occurred :(')
    }
  })
  .catch(error => {
    return Promise.reject(error)
  })
}