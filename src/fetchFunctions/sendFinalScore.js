import { SERVER_BASE_URL } from './config'
import AsyncStorage from '@react-native-community/async-storage'
// import { AsyncStorage } from 'react-native'

export function sendFinalScoreFetch (score, numOfTouches) {
  return AsyncStorage.getItem('@webToken')
  .then(token => {
    return fetch(`${SERVER_BASE_URL}/games`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      },
      body: JSON.stringify({
        score, 
        numOfTouches
      })
    })
  })
  .then(res => res.json())
  .then(response => {
    if (response.error) {
      return Promise.reject(response.error)
    }
    return response
  })
  .catch(error => {
    return Promise.reject(error)
  })
}