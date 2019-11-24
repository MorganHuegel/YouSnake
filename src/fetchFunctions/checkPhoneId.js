import { SERVER_BASE_URL } from './config'
import DeviceInfo from 'react-native-device-info';


export function checkPhoneId () {
  const phoneId = DeviceInfo.getUniqueID()
  return fetch(`${SERVER_BASE_URL}/users/check`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneId
    })
  })
  .then(res => res.json())
  .then(response => {
    if (response.userExists === true) {
      return Promise.resolve({userExists: true, avatar: response.avatar, username: response.username})
    } else if (response.userExists === false) {
      return Promise.resolve({userExists: false})
    } else {
      return Promise.reject('Could not validate unique phone id')
    }
  })
  .catch(error => {
    return Promise.reject(error)
  })
}